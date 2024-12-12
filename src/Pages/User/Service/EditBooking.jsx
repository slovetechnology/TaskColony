import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../../Components/General/Modal';
import { ToastAlert } from '../../../Components/General/Utils';
import { AuthPosturl, Apis } from '../../../Components/General/Api';

const EditBooking = ({ closeView, singles }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill the form with the booking details
  useEffect(() => {
    if (singles) {
      setValue('address', singles.address);
      setValue('description', singles.description);
      setValue('job_title', singles.job_title);
      setValue('time', singles.the_time);
      setValue('date', singles.the_date);
    }
  }, [singles, setValue]);

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const dataToSend = {
        trackid : singles.trackid, // Include tracking ID from singles
        ...data, // Include form data
      };

      const res = await AuthPosturl(Apis.users.update_bookings, dataToSend); // API call
      if (res.status) {
        ToastAlert(res.text);
        closeView(); // Close the modal after successful update
      } else {
        ToastAlert(res.text || 'Update failed');
      }
    } catch (error) {
      console.error('Error:', error);
      ToastAlert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal height="h-[30rem]" closeView={closeView}>
      <div className="bg-white w-[95%] mx-auto overflow-hidden scrollsdown">
        <div className="text-xl">Edit Booking</div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-5">
            <div className="mb-3">
              <label>Address</label>
              <input
                {...register('address', { required: 'Address is required' })}
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
                {...register('job_title', { required: 'Job title is required' })}
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
            <button
              type="submit"
              className={`bg-pink px-10 py-2 text-white rounded-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
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