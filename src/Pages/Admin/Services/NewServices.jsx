import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import { Apis, AuthGeturl, AuthPosturl } from '../../../Components/General/Api';
import { useForm } from 'react-hook-form';
import { ErrorAlert, ToastAlert } from '../../../Components/General/Utils';
import { Link } from 'react-router-dom';

const NewServices = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [categories, setCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bannerImageName, setBannerImageName] = useState(''); // For banner image name
    const [galleryImageName, setGalleryImageName] = useState(''); // For gallery image name

    // Fetch categories when the component mounts
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
        event.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name); // Name of the service
        formData.append('duration', data.min_duration); // Duration
        formData.append('commission', data.commission); // Commission
        formData.append('category_tid', data.category); // Category ID
        formData.append('status', data.status); // Status (active/inactive)
        formData.append('featured', data.feature_front_page); // Featured (yes/no)
        formData.append('description', data.description); // Description

        // Adding the images if they are selected
        if (data.banner_image[0]) {
            formData.append('images[]', data.banner_image[0]); // Banner Image
        }
        if (data.gallery_image[0]) {
            formData.append('gallery[]', data.gallery_image[0]); // Gallery Image
        }

        setIsSubmitting(true);

        try {
            const res = await AuthPosturl(Apis.admins.create_admin_services, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.status === true) {
                ToastAlert(res.text); // Success alert
            } else {
                ErrorAlert(res.text); // Error alert
            }
        } catch (error) {
            ErrorAlert('An unexpected error occurred. Please try again.'); // General error
        } finally {
            setIsSubmitting(false); // Reset submitting state
        }
    };

    // Handle file change for banner image
    const handleBannerImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setBannerImageName(e.target.files[0].name); 
        }
    };

    // Handle file change for gallery image
    const handleGalleryImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setGalleryImageName(e.target.files[0].name)
        }
    };

    return (
        <AdminLayout>
            <div className="bg-[#5a5a5a] h-[40.8rem] w-full py-6">
            <div className=" my-3 mx-9">
                    <Link to='/auth/admin/service' className="bg-white py-2 px-5 font-semibold text-lg rounded-lg w-fit">Back</Link>
                </div>
                <div className="bg-white w-[95%] mx-auto text-primary h-[37rem] px-10 pt-10 overflow-hidden">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-3 mb-5 gap-12">
                            <div>
                                <label className="text-xs">Name</label>
                                <input
                                    className="admininput"
                                    type="text"
                                    placeholder="Enter name"
                                    {...register('name', { required: 'Name is required' })}
                                />
                                {errors.name && <span className="text-red-500">{errors.name.message}</span>}
                            </div>
                            <div>
                                <label className="text-xs">Minimum Duration</label>
                                <input
                                    className="admininput"
                                    type="text"
                                    placeholder="Duration"
                                    {...register('min_duration')}
                                />
                            </div>
                            <div>
                                <label className="text-xs">Commission</label>
                                <input
                                    className="admininput"
                                    type="number"
                                    placeholder="$3"
                                    {...register('commission')}
                                />
                            </div>
                        </div>

                        {/* Category, Status, Feature Inputs */}
                        <div className="grid grid-cols-3 mb-5 gap-12">
                            <div>
                                <label className="text-xs">Categories</label>
                                <select className="admininput" {...register('category')}>
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.trackid} value={cat.trackid}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs">Status</label>
                                <select className="admininput" {...register('status')}>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs">Feature on Front Page</label>
                                <select className="admininput" {...register('feature_front_page')}>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>
                        </div>

                        {/* Description Input */}
                        <div>
                            <label className="text-xs mb-2 block">Description</label>
                            <textarea
                                className="admininput w-full h-24 p-3 border border-gray-300 rounded-md"
                                placeholder="Description"
                                {...register('description')}
                            />
                        </div>

                        {/* Image Inputs (Banner & Gallery) */}
                        <div className="flex gap-5 items-center mt-5">
                            <div className="relative w-[50%]">
                                <label className="text-xs">Banner Image</label>
                                <input
                                    type="file"
                                    {...register('banner_image')}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleBannerImageChange}
                                />
                                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                    <div className="w-full px-4 py-2 text-gray-500">
                                        {bannerImageName || 'Choose Image'}
                                    </div>
                                    <div className="bg-gray-200 border-l border-gray-300 text-gray-700 px-4 py-2 cursor-pointer">
                                        Browse
                                    </div>
                                </div>
                            </div>
                            <div className="relative w-[50%]">
                                <label className="text-xs">Gallery Image</label>
                                <input
                                    type="file"
                                    {...register('gallery_image')}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleGalleryImageChange}
                                />
                                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                    <div className="w-full px-4 py-2 text-gray-500">
                                        {galleryImageName || 'Choose Image'}
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

export default NewServices;
