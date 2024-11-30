import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../../../Components/General/Modal';
import { useForm } from 'react-hook-form';
import { Apis, AuthGeturl, AuthPosturl } from '../../../Components/General/Api';
import { ToastAlert } from '../../../Components/General/Utils';

const FavouriteService = ({ isOpen, closeview, resendSignal }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch available services
    const fetchServices = useCallback(async () => {
        try {
            const res = await AuthGeturl(Apis.users.get_all_services);
            if (res.status === true) {
                setItems(res.data.data); // Update state with fetched items
            } else {
                throw new Error('Failed to fetch services.');
            }
        } catch (err) {
            setError(err.message);
        }
    }, []);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    // Handle form submission
    const onSubmit = async (data) => {
        if (isSubmitting) return; // Prevent multiple submissions
        setIsSubmitting(true);

        try {
            const selectedService = items.find(item => item.id.toString() === data.service);
            if (!selectedService) {
                ToastAlert('Invalid service selected.');
                return;
            }

            const dataToSend = {
                service_tid: selectedService.trackid,
            };

            const res = await AuthPosturl(Apis.users.favourite_services, dataToSend);
            if (res.status) {
                ToastAlert(res.text || 'Favorite service updated successfully!');
                resendSignal?.();
                closeview();
            } else {
                ToastAlert(res.text || 'Failed to update favorite service.');
            }
        } catch (error) {
            console.error('Error updating favorite service:', error);
            ToastAlert('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal closeView={closeview}>
            <div className="font-semibold text-lg mb-4">Favourite Services</div>
            <div className="mb-6">
                <p className="text-sm">What is your favourite service on Task Colony?</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label className="text-xs font-medium mb-2 block">Favourite Service</label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded"
                        {...register('service', { required: 'Selecting a service is required' })}
                    >
                        <option value="">Select Service</option>
                        {items.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                    {errors.service && (
                        <p className="text-red-500 text-xs mt-1">{errors.service.message}</p>
                    )}
                </div>

                {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-200 text-sm rounded"
                        onClick={closeview}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={`px-4 py-2 text-sm rounded ${
                            isSubmitting ? 'bg-gray-400' : 'bg-blue-500 text-white'
                        }`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default FavouriteService;