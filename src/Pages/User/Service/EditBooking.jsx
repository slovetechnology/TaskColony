import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../../Components/General/Modal';
import { Apis, AuthPosturl } from '../../../Components/General/Api';
import { ErrorAlert, ToastAlert } from '../../../Components/General/Utils';

const EditBooking = ({ closeView, singles }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    // Populate form with existing user data
    useEffect(() => {
        if (singles) {
            setValue('address', singles.address || '');
            setValue('description', singles.description || '');
            setValue('job_title', singles.job_title || '');
            setValue('time', singles.time || '');
            setValue('date', singles.date || '');
            }
    }, [singles, setValue]);

    const onSubmit = async (data, event) => {
        event.preventDefault();
        setIsSubmitting(true);

        const payload = {
            description: data.description,
            address: data.address,
            job_title: data.job_title,
            time: data.time,
            date: data.date,
        };

        try {
            const response = await AuthPosturl(Apis.users.update_bookings, payload,);
            if (response.status === true) {
                ToastAlert(res.text)
            }
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error updating user:', error);
            ErrorAlert(res.text)
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal height="h-[35rem]" closeView={closeView}>
            <div className="text-black">
                <h2 className="text-xl font-bold mb-4">Edit Booking</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label>Address</label>
                        <input
                            {...register('address', { required: 'address is required' })}
                            type="text"
                            className={`input border ${errors.address ? 'border-red-600' : 'border'}`}
                        />
                        {errors.address && <div className="text-red-600">{errors.address.message}</div>}
                    </div>
                    <div className="mb-3">
                        <label>Description</label>
                        <input
                            {...register('description', { required: 'Description is required' })}
                            type="text"
                            className={`input border ${errors.description ? 'border-red-600' : 'border'}`}
                        />
                        {errors.description && <div className="text-red-600">{errors.description.message}</div>}
                    </div>
                    <div className="mb-3">
                        <label>Job Title</label>
                        <input
                            {...register('job_title', { required: 'Job Title is required' })}
                            type="text"
                            className={`input border ${errors.job_title ? 'border-red-600' : 'border'}`}
                        />
                        {errors.job_title && <div className="text-red-600">{errors.job_title.message}</div>}
                    </div>

                    <div className="mb-3">
                        <label>Time</label>
                        <input
                            {...register('time', { required: 'Time is required' })}
                            type="time"
                            className={`input border ${errors.time ? 'border-red-600' : 'border'}`}
                        />
                        {errors.time && <div className="text-red-600">{errors.time.message}</div>}
                    </div>
                    <div className="mb-3">
                        <label>Date</label>
                        <input
                            {...register('date', { required: 'Date is required' })}
                            type="date"
                            className={`input border ${errors.date ? 'border-red-600' : 'border'}`}
                        />
                        {errors.date && <div className="text-red-600">{errors.date.message}</div>}
                    </div>



                    <div className="flex justify-end mt-10 gap-3">
                        <button
                            type="button"
                            onClick={closeView}
                            className="px-4 py-2 bg-gray-200 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`px-4 py-2 bg-blue-500 text-white rounded ${isSubmitting ? 'opacity-50' : ''}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default EditBooking;
