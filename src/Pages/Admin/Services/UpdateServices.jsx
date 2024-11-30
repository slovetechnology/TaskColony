import React, { useEffect, useState } from 'react';
import ModalLayout from '../../../Components/Admin/ModalLayout';
import { Apis, AuthGeturl, AuthPosturl } from '../../../Components/General/Api';
import { useForm } from 'react-hook-form';
import { ToastAlert } from '../../../Components/General/Utils';

const UpdateService = ({ closeView, singles, resendSignal }) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);

    // Pre-populate form fields with existing data from singles
    useEffect(() => {
        if (singles) {
            setValue('name', singles.name || '');
            setValue('duration', singles.duration || '');
            setValue('commission', singles.commission || '');
            setValue('category', singles.category_tid || '');
            setValue('status', singles.status ? 'active' : 'inactive');
            setValue('feature_front_page', singles.featured ? 'yes' : 'no');
            setValue('description', singles.description || '');
            setValue('data_tid', singles.trackid || '');
        }
    }, [singles, setValue]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await AuthGeturl(Apis.admins.get_categories);
                if (res.status === true) {
                    setCategories(res.data.data || []);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Handle form submission
    const onSubmit = async (data, event) => {
        event.preventDefault(); // Prevent default form behavior

        setIsSubmitting(true);

        // Form data to send to the backend
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('duration', data.duration);
        formData.append('commission', data.commission);
        formData.append('category_tid', data.category);
        formData.append('data_tid', singles.trackid);
        formData.append('status', data.status === 'active' ? 1 : 0);
        formData.append('featured', data.feature_front_page === 'yes' ? 1 : 0);
        formData.append('description', data.description);

        // Handle image uploads
        if (data.banner_image && data.banner_image[0]) {
            formData.append('images[]', data.banner_image[0]);
        }
        if (data.gallery_image && data.gallery_image[0]) {
            formData.append('gallery[]', data.gallery_image[0]);
        }

        try {
            const res = await AuthPosturl(Apis.admins.update_admin_services, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.status === true) {
                ToastAlert(res.text);
                resendSignal(); // Trigger a refresh of the data
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
            <div className="bg-white w-[95%] mx-auto text-primary h-[35rem] px- scrollsdown pt-10 overflow-auto">
                <div className="text-slate-600 text-xl rounded-lg shadow-xl mb-5 bg-blue-50 p-3">Update Service</div>
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="mb-5">
                        <label className="text-xs">Name</label>
                        <input
                            className="admininput"
                            type="text"
                            placeholder="Enter name"
                            {...register('name', { required: 'Name is required' })}
                        />
                        {errors.name && <span className="text-red-500">{errors.name.message}</span>}
                    </div>

                    {/* Duration */}
                    <div className="mb-5">
                        <label className="text-xs">Duration</label>
                        <input
                            className="admininput"
                            type="text"
                            placeholder="Duration"
                            {...register('duration', { required: 'Duration is required' })}
                        />
                        {errors.duration && <span className="text-red-500">{errors.duration.message}</span>}
                    </div>

                    {/* Commission */}
                    <div className="mb-5">
                        <label className="text-xs">Commission</label>
                        <input
                            className="admininput"
                            type="number"
                            placeholder="$3"
                            {...register('commission')}
                        />
                    </div>

                    {/* Category */}
                    <div className="mb-5">
                        <label className="text-xs">Categories</label>
                        <select className="admininput" {...register('category', { required: 'Category is required' })}>
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.trackid} value={cat.trackid}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.category && <span className="text-red-500">{errors.category.message}</span>}
                    </div>

                    <div className="mb-5">
                        <label className="text-xs">Status</label>
                        <select className="admininput" {...register('status')}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="mb-5">
                        <label className="text-xs">Feature on Front Page</label>
                        <select className="admininput" {...register('feature_front_page')}>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>

                    <div className="mb-5">
                        <label className="text-xs mb-2 block">Description</label>
                        <textarea
                            className="admininput w-full h-24 p-3 border border-gray-300 rounded-md"
                            placeholder="Description"
                            {...register('description')}
                        />
                    </div>

                    <div className="gap-5 items-center mb-5">
                        <div className="relative w-full">
                            <label className="text-xs">Banner Image</label>
                            <input
                                type="file"
                                {...register('banner_image')}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                <div className="w-full px-4 py-2 text-gray-500">
                                    Choose Image
                                </div>
                                <div className="bg-gray-200 border-l border-gray-300 text-gray-700 px-4 py-2 cursor-pointer">
                                    Browse
                                </div>
                            </div>
                        </div>

                        <div className="relative w-full">
                            <label className="text-xs">Gallery Image</label>
                            <input
                                type="file"
                                {...register('gallery_image')}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                <div className="w-full px-4 py-2 text-gray-500">
                                    Choose Image
                                </div>
                                <div className="bg-gray-200 border-l border-gray-300 text-gray-700 px-4 py-2 cursor-pointer">
                                    Browse
                                </div>
                            </div>
                        </div>
                    </div>

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

export default UpdateService;