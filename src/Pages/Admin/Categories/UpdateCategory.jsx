import React, { useEffect, useState } from 'react';
import ModalLayout from '../../../Components/Admin/ModalLayout';
import { Apis, AuthPosturl } from '../../../Components/General/Api';
import { useForm } from 'react-hook-form';
import { ToastAlert } from '../../../Components/General/Utils';

const statusOptions = [
    { label: 'ACTIVE', value: 'active' },
    { label: 'INACTIVE', value: 'inactive' },
];

const UpdateCategory = ({ singles, closeView, resendSignal }) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [iconPreview, setIconPreview] = useState(null);

    // Pre-populate form fields with existing data or set default values
    useEffect(() => {
        if (singles) {
            setValue('name', singles.name || '');
            setValue('status', singles.status ? 'active' : 'inactive');
            setValue('data_tid', singles.trackid || '');
        } else {
            // Set default status to active if no singles data
            setValue('status', 'active');
        }
    }, [singles, setValue]);

    // Handle image preview
    const handleBannerImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIconPreview(URL.createObjectURL(file));
        }
    };

    // Handle form submission
    const onSubmit = async (data, event) => {
        event.preventDefault(); // Prevent default form behavior
        setIsSubmitting(true);

        // Log the data being submitted for debugging
        console.log('Submitting data:', data);

        // Form data to send to the backend
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('status', data.status); // Ensure this is a string
        formData.append('data_tid', singles.trackid);
        if (data.iconImage[0]) {
            formData.append('images[]', data.iconImage[0]);
        }

        try {
            const res = await AuthPosturl(Apis.admins.update_categories, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.status === true) {
                ToastAlert(res.text);
                resendSignal(); // Refresh parent view
            } else {
                ToastAlert(res.text);
            }
        } catch (error) {
            ToastAlert('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ModalLayout closeView={closeView}>
            <div className="bg-white w-[95%] mx-auto text-primary h-[25rem] px-scroll pt-10 overflow-auto">
                <div className="text-slate-600 text-xl rounded-lg shadow-xl mb-5 bg-blue-50 p-3">Update Category</div>
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

                        {/* Status Dropdown using select */}
                        <div>
                            <label className="text-xs">Status</label>
                            <select
                                {...register('status', { required: 'Status is required' })}
                                className="admininput"
                                defaultValue={singles && singles.status ? (singles.status ? 'active' : 'inactive') : 'active'}
                                onChange={(e) => setValue('status', e.target.value)}
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.status && <span className="text-red-500">{errors.status.message}</span>}
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
        </ModalLayout>
    );
};

export default UpdateCategory;