import React, { useEffect, useState } from 'react';
import ModalLayout from '../../../Components/Admin/ModalLayout';
import { Apis, AuthPosturl } from '../../../Components/General/Api';
import { useForm } from 'react-hook-form';
import { ToastAlert } from '../../../Components/General/Utils';


const statusOptions = [
    { label: 'ACTIVE', value: 1 },
    { label: 'INACTIVE', value: 0 },
];

const UpateUser = ({ closeView, singles, resendSignal }) => {
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
            data_tid: singles.trackid,
            status: Number(data.status),
        };

        try {
            const res = await AuthPosturl(Apis.admins.user_update, dataToSend);
            if (res.status === true) {
                ToastAlert(res.text);
                resendSignal();
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
            <div className="bg-white w-[95%] mx-auto text-primary h-[27rem] pt-10 overflow-hidden scrollsdown">
                <div className="text-slate-600 text-xl rounded-lg shadow-xl mb-5 bg-blue-50 p-3">Update User</div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 mb-5 gap-5">
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

export default UpateUser;