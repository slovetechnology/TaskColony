import React, { useCallback, useEffect, useState } from 'react';
import ModalLayout from '../../../Components/Admin/ModalLayout';
import { Apis, AuthGeturl, AuthPosturl } from '../../../Components/General/Api';
import { useForm } from 'react-hook-form';
import { ToastAlert } from '../../../Components/General/Utils';

const AssignBooking = ({ singles, resendSignal, closeView }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [items, setItems] = useState([]);

    const fetchUsers = useCallback(async () => {
        try {
            const res = await AuthGeturl(`${Apis.admins.get_provider}?sortbyuser=2`);
            if (res.status === true && Array.isArray(res.data.data)) {
                setItems(res.data.data);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (err) {
            console.error(err);
            ToastAlert('Failed to fetch providers.');
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const onSubmit = async (data) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const dataToSend = {
                data_tid: singles.trackid,
                provider_tid: singles.trackid,
            };

            const res = await AuthPosturl(Apis.admins.assign_bookings, dataToSend);
            if (res.status) {
                ToastAlert(res.text);
                resendSignal();
                closeView();
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
        <ModalLayout  closeView={closeView}>
            <div className="bg-white w-[95%] mx-auto text-primary h-[20rem] pt-10 overflow-hidden scrollsdown">
                <div className="text-slate-600 text-xl rounded-lg shadow-xl mb-5 bg-blue-50 p-3">
                    Assign Provider
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mt-5">
                        <div className='mb-5'>
                            <label className="text-xs">Provider</label>
                            <select
                                {...register('provider', { required: 'Provider is required' })}
                                className={`input border ${errors.provider ? 'border-red-600' : 'border'}`}
                            >
                                <option value="">Select a provider</option>
                                {items.map((provider) => (
                                    <option key={provider.provider_id} value={provider.provider_id}>
                                        {provider.fname} {provider.lname}
                                    </option>
                                ))}
                            </select>
                            {errors.provider && <p className="text-red-600 text-xs">{errors.provider.message}</p>}
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
        </ModalLayout>
    );
};

export default AssignBooking;