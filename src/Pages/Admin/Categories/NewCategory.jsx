import React, { useState } from 'react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import AdminDropdown from '../../../Components/Admin/AdminDropdown';
import { useForm } from 'react-hook-form';
import { Apis, AuthPosturl } from '../../../Components/General/Api';
import { ErrorAlert, ToastAlert } from '../../../Components/General/Utils';
import { Link } from 'react-router-dom';

const status = [
    { label: 'ACTIVE', value: 'active' },
    { label: 'INACTIVE', value: 'inactive' },
];

const NewCategory = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [iconPreview, setIconPreview] = useState(null);

    const onSubmit = async (data, event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('status', data.status);
        if (data.iconImage[0]) {
            formData.append('images[]', data.iconImage[0]);
        }

        setIsSubmitting(true);

        try {
            const res = await AuthPosturl(Apis.admins.create_categories, formData, {
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
                <div className=" my-3 mx-9">
                    <Link to='/auth/admin/category' className="bg-white py-2 px-5 font-semibold text-lg rounded-lg w-fit">Back</Link>
                </div>
                <div className="bg-white w-[95%] mx-auto text-primary h-[35rem] px-10 pt-10 overflow-hidden">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-3 mb-6 gap-12">
                            {/* Name Field */}
                            <div className="col-span-2">
                                <label className="text-xs">Name</label>
                                <input
                                    name="name"
                                    className="admininput"
                                    type="text"
                                    placeholder="Enter Category Name"
                                    {...register('name', { required: 'Name is required' })}
                                />
                                {errors.name && <span className="text-red-500">{errors.name.message}</span>}
                            </div>

                            {/* Status Dropdown */}
                            <div>
                                <label className="text-xs">Status</label>
                                <AdminDropdown
                                    options={status}
                                    value={''}
                                    onChange={(value) => setValue('status', value)}
                                />
                                {errors.status && <span className="text-red-500">Status is required</span>}
                            </div>
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
                                {iconPreview && (
                                    <img
                                        src={iconPreview}
                                        alt="Preview"
                                        className="mt-2 w-40 h-32 object-cover"
                                    />
                                )}
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
