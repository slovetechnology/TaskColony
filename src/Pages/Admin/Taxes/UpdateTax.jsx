import React, { useEffect, useState } from 'react';
import ModalLayout from '../../../Components/Admin/ModalLayout';
import { Apis, AuthPosturl } from '../../../Components/General/Api';
import { useForm } from 'react-hook-form';
import { ToastAlert } from '../../../Components/General/Utils';

// List of U.S. states
const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida',
    'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
    'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska',
    'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
    'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee',
    'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const statusOptions = [
    { label: 'ACTIVE', value: 1 },
    { label: 'INACTIVE', value: 0 },
];

const UpateTax = ({ closeView, singles, resendSignal }) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Set initial form values
    useEffect(() => {
        if (singles) {
            setValue('name', singles.name);
            setValue('status', singles.status);
            setValue('commission', singles.commission);
        }
    }, [setValue, singles]);

    const onSubmit = async (data, event) => {
        event.preventDefault(); 

        setIsSubmitting(true);

        const dataToSend = {
            tax_tid: singles.trackid,
            name: data.name,
            status: Number(data.status), 
            commission: Number(data.commission),
        };

        try {
            const res = await AuthPosturl(Apis.admins.update_admin_taxes, dataToSend);
            if (res.status === true) {
                ToastAlert(res.text);
                resendSignal(); 
            } else {
                ToastAlert(res.text);
            }
        } catch (error) {
            console.log('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ModalLayout closeView={closeView}>
            <div className="bg-white w-[95%] mx-auto text-primary h-[35rem] px-10 pt-10 overflow-hidden">
                <div className="text-slate-600 text-xl rounded-lg shadow-xl mb-5 bg-blue-50 p-3">Update Tax</div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 mb-5 gap-5">
                        <div>
                            <label className="text-xs">State</label>
                            <select
                                {...register('name', { required: 'State is required' })}
                                className={`input ${errors.name ? 'border-red-600' : 'border-gray-300'}`}
                            >
                                {usStates.map((state) => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs">Commission</label>
                            <input
                                {...register('commission', { required: 'Commission is required' })}
                                type="number"
                                className={`input ${errors.commission ? 'border-red-600' : 'border-gray-300'}`}
                                step="0.01" // Optional: allows decimals
                            />
                        </div>
                        <div>
                            <label className="text-xs">Status</label>
                            <select
                                {...register('status', { required: 'Status is required' })}
                                className={`input ${errors.status ? 'border-red-600' : 'border-gray-300'}`}
                            >
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex items-start justify-start mt-8">
                        <button type="submit" disabled={isSubmitting} className="bg-pink px-10 py-2 text-white rounded-md">
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </ModalLayout>
    );
};

export default UpateTax;