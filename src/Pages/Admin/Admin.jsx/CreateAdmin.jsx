import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorAlert, ToastAlert } from '../../../Components/General/Utils';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import { Apis, AuthPosturl } from '../../../Components/General/Api';
import { Link } from 'react-router-dom';

// Define options with IDs
const statusOptions = [
    { id: 1, label: 'Active', value: 'active' },
    { id: 2, label: 'Inactive', value: 'inactive' },
    { id: 3, label: 'Pending', value: 'pending' },
];

const levelOptions = [
    { id: 1, label: 'Super Admin', value: 'admin' },
    { id: 3, label: 'Editor', value: 'editor' },
    { id: 4 , label: 'Viewer', value: 'viewer' },
];

const CreateAdmin = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data, event) => {
        event.preventDefault();

        setIsSubmitting(true);

        const dataToSend = {
            name: data.name,
            email: data.email,
            password: data.password,
            status: data.status, // Ensure status is sent as a             
            level: data.level,   // Ensure level is sent as a number
        };

        try {
            const res = await AuthPosturl(Apis.admins.create_admin, dataToSend);
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

    return (
        <AdminLayout>
            <div className="bg-[#5a5a5a] h-[40.8rem] w-full py-5">
                <div className=" my-3 mx-9">
                    <Link to='/auth/admin/admin' className="bg-white py-2 px-5 font-semibold text-lg rounded-lg w-fit">Back</Link>
                </div>
                <div className="bg-white w-[95%] mx-auto text-primary h-[35rem] px-10 pt-10 overflow-hidden">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-3 gap-12 mb-10">
                            <div>
                                <label className="text-xs">Name</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    {...register('name', { required: 'Name is required' })}
                                />
                                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="text-xs">Email</label>
                                <input
                                    type="email"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    {...register('email', { required: 'Email is required' })}
                                />
                                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="text-xs">Password</label>
                                <input
                                    type="password"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    {...register('password', { required: 'Password is required' })}
                                />
                                {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
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
                                        <option key={option.id} value={option.id}>
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
                                        <option key={option.id} value={option.id}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
                            </div>
                        </div>

                        <div className="flex items-start justify-start mt-8">
                            <button type="submit" disabled={isSubmitting} className="bg-pink px-10 py-2 text-white rounded-md">
                                {isSubmitting ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CreateAdmin;
