import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import AdminDropdown from '../../../Components/Admin/AdminDropdown';
import { Apis, AuthPosturl } from '../../../Components/General/Api';
import { useForm } from 'react-hook-form';
import { ErrorAlert, ToastAlert } from '../../../Components/General/Utils';
import { Link } from 'react-router-dom';

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

// Define a mapping of states to status
const stateStatusMapping = {
    'California': 1, 'New York': 1, 'Texas': 1, 'Florida': 1, // Example of ACTIVE states
    'Alaska': 0, 'Montana': 0, 'North Dakota': 0, 'South Dakota': 0 // Example of INACTIVE states
};

const NewTax = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const defaultState = usStates[0];
        setValue('name', defaultState); // Set default state
        setValue('status', stateStatusMapping[defaultState] ?? 1); // Set default status based on the selected state
    }, [setValue]);

    // Handle state change to dynamically update status
    const handleStateChange = (selectedState) => {
        setValue('name', selectedState);
        setValue('status', stateStatusMapping[selectedState] ?? 1);
    };

    const onSubmit = async (data, event) => {
        event.preventDefault();

        setIsSubmitting(true);

        const dataToSend = {
            name: data.name,
            status: Number(data.status),
            commission: Number(data.commission),
        };


        try {
            const res = await AuthPosturl(Apis.admins.create_admin_taxes, dataToSend);
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
            <div className="bg-[#5a5a5a] h-[40.8rem] w-full py-16">
                <div className=" my-3 mx-9">
                    <Link to='/auth/admin/tax' className="bg-white py-2 px-5 font-semibold text-lg rounded-lg w-fit">Back</Link>
                </div>
                <div className="bg-white w-[95%] mx-auto text-primary h-[35rem] px-10 pt-10 overflow-hidden">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-3 mb-10 gap-12">
                            <div>
                                <label className="text-xs">State</label>
                                <select
                                    {...register('name', { required: 'State is required' })}
                                    onChange={(e) => handleStateChange(e.target.value)} // Update status on state change
                                    className={`input border ${errors.name ? 'border-red-600' : 'border-gray-300'}`}
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
                                    className={`input border ${errors.commission ? 'border-red-600' : 'border-gray-300'}`}
                                    step="0.01" // Optional: allows decimals
                                />
                            </div>
                            <div>
                                <label className="text-xs">Status</label>
                                <AdminDropdown
                                    options={statusOptions}
                                    onChange={(selectedOption) => setValue('status', selectedOption.value)}
                                    value={statusOptions.find(option => option.value === (stateStatusMapping[setValue('name')] ?? 1))?.label}
                                />
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

export default NewTax;
