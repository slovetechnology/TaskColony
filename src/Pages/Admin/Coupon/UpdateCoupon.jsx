import React, { useCallback, useEffect, useState } from 'react';
import ModalLayout from '../../../Components/Admin/ModalLayout';
import { Apis, AuthGeturl, AuthPosturl } from '../../../Components/General/Api';
import { useForm } from 'react-hook-form';
import { ToastAlert } from '../../../Components/General/Utils';
import Select from 'react-select';
import ToggleButton from '../../../Components/General/toggle-button';

const statusOptions = [
    { label: 'ACTIVE', value: 'active' },
    { label: 'INACTIVE', value: 'inactive' },
];

const typeOptions = [
    { value: 'priceOff', label: 'Price Off' },
    { value: 'percentage', label: 'Percentage' },
];

const UpdateCoupon = ({ closeView, singles, resendSignal }) => {
    const { register, watch, handleSubmit, setValue, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [items, setItems] = useState([]);

    // Initialize form values when `singles` changes
    useEffect(() => {
        if (singles) {
            setValue('name', singles.name || '');
            setValue('status', singles.status || 'inactive');
            setValue('type', singles.type || 'priceOff');
            setValue('value', singles.value || 0);
            setValue('expiredate', singles.expiredate || '');
            setValue('displayonapp', singles.displayonapp || false);
            setValue('description', singles.description || '');
            setValue('services', singles.services || []);
        }
    }, [setValue, singles]);

    // Fetch services from the API
    const getAllServices = useCallback(async () => {
        try {
            const res = await AuthGeturl(Apis.admins.get_admin_services);
            if (res.status) {
                const serviceOptions = (res.data.data || []).map(service => ({
                    label: service.name,
                    value: service.trackid
                }));
                setItems(serviceOptions);
            } else {
                throw new Error('Failed to fetch services');
            }
        } catch (err) {
            console.error(err.message);
        }
    }, []);

    useEffect(() => {
        getAllServices();
    }, [getAllServices]);

    // Handle service selection
    const handleServiceChange = (selectedOptions) => {
        const serviceIds = selectedOptions?.map(option => option.value) || [];
        setValue('services', serviceIds);
    };

    // Form submission handler
    const onSubmit = async (data) => {
        if (isSubmitting) return; // Prevent duplicate submissions
        setIsSubmitting(true);

        try {
            const services = (data.services || []).filter(Boolean).join(',');
            const dataToSend = {
                name: data.name,
                status: data.status === 'active' ? 1 : 0,
                type: data.type === 'priceOff' ? 1 : 2,
                value: Number(data.value),
                expiredate: data.expiredate,
                displayonapp: data.displayOnApp ? 1 : 0,
                description: data.description,
                services: services,
                coupon_tid: singles.trackid
            };

            const res = await AuthPosturl(Apis.admins.update_admin_coupon, dataToSend);
            if (res.status) {
                ToastAlert(res.text);
                resendSignal(); // Trigger data refresh
                closeView(); // Close the modal
            } else {
                ToastAlert(res.text || 'Update failed');
            }
        } catch (error) {
            console.error('Error:', error);
            // ToastAlert('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ModalLayout closeView={closeView}>
            <div className="bg-white w-[95%] mx-auto text-primary h-[35rem] pt-10 overflow-auto scrollsdown">
                <div className="text-slate-600 text-xl rounded-lg shadow-xl mb-5 bg-blue-50 p-3">Update Coupon</div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-2 mb-5 gap-5">
                        <div>
                            <label className="text-xs">Name</label>
                            <input
                                className="admininput"
                                type="text"
                                placeholder="Enter name"
                                {...register('name')}
                            />
                        </div>
                        <div>
                            <label className="text-xs">Coupon Type</label>
                            <select
                                className="admininput"
                                {...register('type')}
                            >
                                {typeOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 mb-5 gap-5">
                        <div>
                            <label className="text-xs">Expiry Date</label>
                            <input
                                className="admininput"
                                type="date"
                                placeholder="YYYY-MM-DD"
                                {...register('expiredate')}
                            />
                        </div>
                        <div>
                            <label className="text-xs">Coupon Value</label>
                            <input
                                className="admininput"
                                type="number"
                                placeholder="$3"
                                {...register('value')}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs">Service Applicable</label>
                        <Select
                            isMulti
                            options={items}
                            onChange={handleServiceChange}
                            placeholder="Select Services"
                            value={items.filter(item => (watch('services') || []).includes(item.value))}
                        />
                    </div>
                    <div className="mt-5">
                        <label className="text-xs">Status</label>
                        <select
                            className="admininput"
                            {...register('status')}
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-8 mt-5">
                        <label className="text-xs mb-2 block">Description</label>
                        <textarea
                            className="admininput w-full h-24 p-3 border border-gray-300 rounded-md"
                            placeholder="Description"
                            {...register('description')}
                        />
                    </div>

                    <div className="flex items-center justify-between mt-20">
                        <div className="flex items-center gap-4 mb-8">
                            <ToggleButton
                                checked={watch('displayonapp')}
                                onChange={() => setValue('displayonapp', !watch('displayonapp'))}
                            />
                            <span className="font-medium text-xs">Display In App</span>
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

export default UpdateCoupon;
