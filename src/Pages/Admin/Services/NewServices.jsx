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
    const [bannerImageName, setBannerImageName] = useState('');
    const [galleryImages, setGalleryImages] = useState([]); // Store gallery images

    // Fetch categories on mount
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
        formData.append('name', data.name);
        formData.append('duration', data.min_duration);
        formData.append('commission', data.commission);
        formData.append('category_tid', data.category);
        formData.append('status', data.status);
        formData.append('featured', data.feature_front_page);
        formData.append('description', data.description);

        // Add banner image
        if (data.banner_image[0]) {
            formData.append('images[]', data.banner_image[0]);
        }

        // Add all gallery images
        galleryImages.forEach((image, index) => {
            formData.append(`gallery[]`, image.file); // Append each file
        });

        setIsSubmitting(true);

        try {
            const res = await AuthPosturl(Apis.admins.create_admin_services, formData, {
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

    // Handle banner image selection
    const handleBannerImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setBannerImageName(e.target.files[0].name);
        }
    };

    // Handle gallery image selection
    const handleGalleryImageChange = (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files); // Convert to array
            const updatedImages = files.map(file => ({
                file,
                preview: URL.createObjectURL(file), // Generate preview URL
            }));
            setGalleryImages(prev => [...prev, ...updatedImages]);
        }
    };

    // Remove gallery image from preview
    const removeGalleryImage = (index) => {
        setGalleryImages(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <AdminLayout>
            <div className="bg-[#5a5a5a] h-[49rem] w-full pt-6">
                <div className=" mx-2 mb-3 md:mx-9">
                    <Link to='/auth/admin/service' className="bg-white py-2 px-5  font-semibold text-lg rounded-lg w-fit">Back</Link>
                </div>
                <div className="bg-white w-[95%] mx-auto text-primary h-auto md:px-10 px-2 py-2 pt-10">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="md:grid md:grid-cols-3 mb-5 gap-12">
                            {/* Service Name */}
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
                            {/* Duration */}
                            <div>
                                <label className="text-xs">Minimum Duration</label>
                                <input
                                    className="admininput"
                                    type="text"
                                    placeholder="Duration"
                                    {...register('min_duration')}
                                />
                            </div>
                            {/* Commission */}
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

                        <div className="md:grid md:grid-cols-3 mb-5 gap-12">
                            {/* Category */}
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
                            {/* Status */}
                            <div>
                                <label className="text-xs">Status</label>
                                <select className="admininput" {...register('status')}>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            {/* Feature on Front Page */}
                            <div>
                                <label className="text-xs">Feature on Front Page</label>
                                <select className="admininput" {...register('feature_front_page')}>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-xs mb-2 block">Description</label>
                            <textarea
                                className="admininput w-full h-24 p-3 border border-gray-300 rounded-md"
                                placeholder="Description"
                                {...register('description')}
                            />
                        </div>

                        {/* Banner Image */}
                        <div className="relative md:w-[50%] mt-5">
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

                        {/* Gallery Images */}
                        <div className="relative mt-5">
                            <label className="text-xs">Gallery Images</label>
                            <input
                                type="file"
                                multiple
                                {...register('gallery_image')}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleGalleryImageChange}
                            />
                            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                <div className="w-full px-4 py-2 text-gray-500">
                                    Select multiple images
                                </div>
                                <div className="bg-gray-200 border-l border-gray-300 text-gray-700 px-4 py-2 cursor-pointer">
                                    Browse
                                </div>
                            </div>
                            {/* Gallery Preview */}
                            <div className="mt-5 flex gap-4 flex-wrap">
                                {galleryImages.map((img, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={img.preview}
                                            alt={`Gallery ${index + 1}`}
                                            className="w-20 h-20 object-cover border rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryImage(index)}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                        >
                                            x
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-start justify-start mt-8">
                            <button
                                type="submit"
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
