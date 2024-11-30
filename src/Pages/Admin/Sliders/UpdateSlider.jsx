import React, { useEffect, useState } from 'react';
import ModalLayout from '../../../Components/Admin/ModalLayout';
import { Apis, AuthPosturl } from '../../../Components/General/Api';
import { useForm } from 'react-hook-form';
import { ToastAlert } from '../../../Components/General/Utils';
import AdminDropdown from '../../../Components/Admin/AdminDropdown';

// Status options for dropdown
const status = [
    { label: 'ACTIVE', value: 'active' },
    { label: 'INACTIVE', value: 'inactive' },
];

const UpdateSlider = ({ singles, closeView, resendSignal }) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pre-populate form fields with existing data
    useEffect(() => {
        if (singles) {
            setValue('title', singles.title || '');
            setValue('description', singles.description || '');
            setValue('status', singles.status ? 'active' : 'inactive');
            setValue('slider_id', singles.id || '');
            setValue('urltogo', singles.urltogo || '');
        }
    }, [singles, setValue]);

    // Handle form submission
    const onSubmit = async (data, event) => {
        event.preventDefault(); // Prevent default form behavior
        setIsSubmitting(true);

        // Form data to send to the backend
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('slider_id', data.slider_id);
        formData.append('urltogo', data.urltogo || '');
        formData.append('status', data.status === 'active' ? 1 : 0); // Convert status to numeric value

        try {
            // Send request using the provided API function
            const res = await AuthPosturl(Apis.admins.update_admin_slider, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.status === true) {
                ToastAlert(res.text);
                
                // Call resendSignal with the updated data
                const updatedSlider = {
                    id: data.slider_id,
                    title: data.title,
                    description: data.description,
                    status: data.status === 'active' ? 1 : 0,
                    urltogo: data.urltogo,
                };
                resendSignal(updatedSlider); // Pass the updated slider
                closeView(); // Close the modal
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
            <div className="bg-white w-[95%] mx-auto text-primary h-[35rem] scrollsdown pt-10 overflow-auto">
                <div className="text-slate-600 text-xl rounded-lg shadow-xl mb-5 bg-blue-50 p-3">
                    Update Slider
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="">
                        <div className="col-span-2">
                            <label className="text-xs">Title</label>
                            <input
                                name="title"
                                className="admininput"
                                type="text"
                                placeholder="Enter Title"
                                {...register('title', { required: 'Title is required' })}
                            />
                            {errors.title && <span className="text-red-500">{errors.title.message}</span>}
                        </div>

                        <div>
                            <label className="text-xs">URL to Go</label>
                            <input
                                name="urltogo"
                                className="admininput"
                                type="text"
                                placeholder="Enter URL"
                                {...register('urltogo')}
                            />
                        </div>

                        <div className="">
                            <label className="text-xs">Description</label>
                            <textarea
                                name="description"
                                className="admininput"
                                placeholder="Enter Description"
                                rows="4"
                                {...register('description', { required: 'Description is required' })}
                            />
                            {errors.description && (
                                <span className="text-red-500">{errors.description.message}</span>
                            )}
                        </div>

                        <div>
                            <label className="text-xs">Status</label>
                            <AdminDropdown
                                options={status}
                                value={singles.status === 1 ? 'active' : 'inactive'}
                                onChange={(value) => setValue('status', value)}
                            />
                            {errors.status && <span className="text-red-500">Status is required</span>}
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

export default UpdateSlider;