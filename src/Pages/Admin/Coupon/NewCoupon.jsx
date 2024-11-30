import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import ToggleButton from '../../../Components/General/toggle-button';
import { Apis, AuthGeturl, AuthPosturl } from '../../../Components/General/Api';
import { ErrorAlert, ToastAlert } from '../../../Components/General/Utils';
import { Link } from 'react-router-dom';

const statusOptions = [
    { label: 'ACTIVE', value: 'active' },
    { label: 'INACTIVE', value: 'inactive' },
];

const typeOptions = [
    { value: 'priceOff', label: 'Price Off' },
    { value: 'percentage', label: 'Percentage' },
];

const NewCoupon = () => {
    const [items, setItems] = useState([]);
    const { register, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            name: '',
            type: 'priceOff',
            value: '',
            expiredate: '',
            services: [], // Initialize as an array for multiple services
            status: 'active',
            description: '',
            displayonapp: false,
        }
    });

    const getAllServices = useCallback(async () => {
        try {
            const res = await AuthGeturl(Apis.admins.get_admin_services);
            if (res.status === true) {
                const fetchedItems = res.data.data || [];
                const serviceOptions = fetchedItems.map(service => ({
                    label: service.name,
                    value: service.trackid
                }));
                setItems(serviceOptions);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (err) {
            console.error(err.message);
        }
    }, []);

    useEffect(() => {
        getAllServices();
    }, [getAllServices]);

    const handleServiceChange = (selectedOptions) => {
        const serviceIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setValue('services', serviceIds);
    };

    const onSubmit = async (data) => {
        const services = data.services.filter(service => service).join(',');

        const Data = {
            name: data.name,
            type: data.type === 'priceOff' ? 1 : 2,
            value: parseInt(data.value, 10),
            expiredate: data.expiredate,
            status: data.status === 'active' ? 1 : 0,
            displayonapp: data.displayonapp ? 1 : 0,
            description: data.description,
            services: services,
        };

        try {
            const res = await AuthPosturl(Apis.admins.create_admin_coupon, Data);
            if (res.status === true) {
                ToastAlert(res.text);
            } else {
                ErrorAlert(res.text);
            }
        } catch (error) {
            ErrorAlert("Something isn't right somewhere");
        }
    };

    return (
        <AdminLayout>
            <div className="bg-[#5a5a5a] h-[40.8rem] w-full py-5">
                <div className=" my-3 mx-9">
                    <Link to='/auth/admin/coupon' className="bg-white py-2 px-5 font-semibold text-lg rounded-lg w-fit">Back</Link>
                </div>
                <div className="bg-white w-[95%] mx-auto text-primary h-[37rem] px-10 pt-5 overflow-hidden">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-3 mb-5 gap-12">
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
                                <label className="text-xs">Discount Type</label>
                                <select
                                    className="admininput"
                                    {...register('type')}
                                >
                                    {typeOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs">Discount</label>
                                <input
                                    className="admininput"
                                    type="number"
                                    placeholder="$3"
                                    {...register('value')}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 mb-5 gap-12">
                            <div>
                                <label className="text-xs">Expiry Date</label>
                                <input
                                    className="admininput"
                                    type="text"
                                    placeholder="YYYY-MM-DD"
                                    {...register('expiredate')}
                                />
                            </div>
                            <div>
                                <label className="text-xs">Service Applicable</label>
                                <Select
                                    isMulti
                                    options={items}
                                    onChange={handleServiceChange}
                                    placeholder="Select Services"
                                    value={items.filter(item => watch('services').includes(item.value))}
                                />
                            </div>
                            <div>
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
                        </div>

                        <div className="mb-8">
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
                            <div className="flex items-start justify-start">
                                <button type="submit" className="bg-pink px-10 py-2 text-white rounded-md">
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default NewCoupon;