import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Apis, AuthPosturl } from '../../../Components/General/Api';
import { ErrorAlert, ToastAlert } from '../../../Components/General/Utils';
import ModalLayout from '../../../Components/Admin/ModalLayout';

// Define options with IDs
const statusOptions = [
    { id: 1, label: 'Activate', value: 'Activate' },
    { id: 2, label: 'Deactivate', value: 'Deactivate' },
];

const levelOptions = [
    { id: 1, label: 'Admin', value: 'admin' },
    { id: 2, label: 'Editor', value: 'editor' },
    { id: 3, label: 'Viewer', value: 'viewer' },
];

const UpdateAdmin = ({ closeView, singles, resendSignal }) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (singles) {
            setValue('name', singles.name);
            setValue('email', singles.email);
            setValue('level', singles.level);  // Map level to ID
            setValue('status', singles.status);  // Map status to ID
        }
    }, [singles, setValue]);

    // Handle form submission
    const onSubmit = async (data, event) => {
        event.preventDefault(); // Prevent default form behavior

        setIsSubmitting(true);

        // Map the selected status and level to their IDs
        const selectedStatus = statusOptions.find(option => option.value === data.status)?.id;
        const selectedLevel = levelOptions.find(option => option.value === data.level)?.id;

        // Prepare data to send
        const dataToSend = {
            name: data.name,
            email: data.email,
            level: selectedLevel,
            status: selectedStatus,
            data_tid: singles.trackid,
            password: data.password // Include password if provided
        };

        try {
            const res = await AuthPosturl(Apis.admins.update_admin, dataToSend);
            if (res.status === true) {
                ToastAlert(res.text);
                resendSignal();
            } else {
                ErrorAlert(res.text);
            }
        } catch (error) {
            ErrorAlert('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ModalLayout closeView={closeView}>
            <div className="bg-white w-[95%] mx-auto text-primary h-[35rem] scrollsdown px-1 pt-16 overflow-hidden">
                <div className="text-slate-600 text-xl rounded-lg shadow-xl mb-5 bg-blue-50 p-3">Update Admin</div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-2 gap-5 mb-6">
                        {/* Name Field */}
                        <div>
                            <label className="text-xs">Name</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded"
                                {...register('name', { required: 'Name is required' })}
                            />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="text-xs">Email</label>
                            <input
                                type="email"
                                className="w-full p-2 border border-gray-300 rounded"
                                {...register('email', { required: 'Email is required' })}
                            />
                            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                        </div>

                        {/* Level Select */}
                        <div>
                            <label className="text-xs">Level</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded"
                                {...register('level', { required: 'Level is required' })}
                            >
                                <option value="">Select Level</option>
                                {levelOptions.map((option) => (
                                    <option key={option.id} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.level && <p className="text-red-500 text-xs">{errors.level.message}</p>}
                        </div>

                        {/* Status Select */}
                        <div>
                            <label className="text-xs">Status</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded"
                                {...register('status', { required: 'Status is required' })}
                            >
                                <option value="">Select Status</option>
                                {statusOptions.map((option) => (
                                    <option key={option.id} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
                        </div>

                        {/* Password Field (Optional) */}
                        <div>
                            <label className="text-xs col-span-1">Password (leave blank to keep current)</label>
                            <input
                                type="password"
                                className="w-full p-2 border border-gray-300 rounded"
                                {...register('password')}
                            />
                            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
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

export default UpdateAdmin;
