import React, { useState } from 'react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import { useForm } from 'react-hook-form';
import { Apis, AuthPosturl } from '../../../Components/General/Api';
import { ErrorAlert, ToastAlert } from '../../../Components/General/Utils';
import { Link } from 'react-router-dom';

const status = [
    { label: 'ACTIVE', value: '1' }, // Map to expected numeric values
    { label: 'INACTIVE', value: '0' },
];

const locationOptions = [
    { label: 'Location 1', value: '1' }, // Map to numeric values
    { label: 'Location 2', value: '2' },
    { label: 'Location 3', value: '3' },
];

const NewCategory = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [iconPreview, setIconPreview] = useState(null);

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('location', data.location);
        formData.append('urltogo', data.urltogo);
        formData.append('description', data.description);
        formData.append('status', data.status);

        if (data.iconImage && data.iconImage[0]) {
            formData.append('images[]', data.iconImage[0]); // Binary file
        }

        setIsSubmitting(true);

        try {
            const res = await AuthPosturl(Apis.admins.create_admin_slider, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.status === true) {
                ToastAlert(res.text);
            } else {
                ErrorAlert(res.text);
            }
        } catch (error) {
            ErrorAlert('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBannerImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIconPreview(URL.createObjectURL(file));
        }
    };

    return (
        <AdminLayout>
            <div className="bg-[#5a5a5a] h-[40.8rem] w-full py-5">
                <div className="my-3 mx-9   ">
                    <Link to='/auth/admin/slider' className="bg-white py-2 px-5 font-semibold text-lg  rounded-lg w-fit">Back</Link>
                </div>
                <div className="bg-white w-[95%] mx-auto text-primary h-[35rem] px-10 pt-10 overflow-hidden">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-2 mb-6 gap-12">
                            {/* Title */}
                            <div>
                                <label className="text-xs">Title</label>
                                <input
                                    name="title"
                                    className="admininput"
                                    type="text"
                                    placeholder="Enter title"
                                    {...register('title', { required: 'Title is required' })}
                                />
                                {errors.title && <span className="text-red-500">{errors.title.message}</span>}
                            </div>

                            {/* Location Dropdown */}
                            <div>
                                <label className="text-xs">Location</label>
                                <select
                                    name="location"
                                    className="admininput"
                                    {...register('location', { required: 'Location is required' })}
                                >
                                    <option value="">Select a location</option>
                                    {locationOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.location && <span className="text-red-500">{errors.location.message}</span>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 mb-6 gap-12">
                            {/* URL Field */}
                            <div>
                                <label className="text-xs">URL to go</label>
                                <input
                                    name="urltogo"
                                    className="admininput"
                                    type="text"
                                    placeholder="https://"
                                    {...register('urltogo', { required: 'URL is required' })}
                                />
                                {errors.urltogo && <span className="text-red-500">{errors.urltogo.message}</span>}
                            </div>

                            {/* Status Dropdown */}
                            <div>
                                <label className="text-xs">Status</label>
                                <select
                                    name="status"
                                    className="admininput"
                                    {...register('status', { required: 'Status is required' })}
                                >
                                    <option value="">Select Status</option>
                                    {status.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.status && <span className="text-red-500">{errors.status.message}</span>}
                            </div>
                        </div>

                        {/* Description Field */}
                        <div className="mb-5">
                            <label className="text-xs">Description</label>
                            <textarea
                                name="description"
                                className="admininput h-24"
                                placeholder="Enter description"
                                {...register('description', { required: 'Description is required' })}
                            />
                            {errors.description && <span className="text-red-500">{errors.description.message}</span>}
                        </div>

                        {/* Icon Image Upload */}
                        <div className="mb-8">
                            <label className="text-xs mb-2 block">Icon Image</label>
                            <div className="relative w-full">
                                <input
                                    type="file"
                                    id="file-upload"
                                    {...register('iconImage')}
                                    onChange={handleBannerImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                    <div className="w-full px-4 py-2 text-gray-500">
                                        {iconPreview ? 'Image Selected' : 'Choose Image'}
                                    </div>
                                    <div className="bg-gray-200 border-l border-gray-300 text-gray-700 px-4 py-2 cursor-pointer">
                                        Browse
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-start justify-start mt-8">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-pink px-10 py-2 text-white rounded-md"
                            >
                                {isSubmitting ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default NewCategory;
