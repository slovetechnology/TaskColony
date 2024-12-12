import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Apis, AuthPosturl, Geturl } from '../../../Components/General/Api';
import { ErrorAlert, ToastAlert } from '../../../Components/General/Utils';
import CalendarDays from '../../../Components/General/CalendarDays';
import { FaPlus } from 'react-icons/fa';
import moment from 'moment';
import Layout from '../../../Components/User/Layout';
import ConfirmBooking from './ConfirmBooking';

const Booking = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState(1); // 1 = Booking Form, 2 = Confirm Booking
    const [selectedDateTime, setSelectedDateTime] = useState({ date: null, time: null });
    const [categories, setCategories] = useState([]);
    const [states, setStates] = useState([]);
    const [services, setServices] = useState([]);
    const [image, setImage] = useState({ main: null, preview: null });
    const [bookingData, setBookingData] = useState(null);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        try {
            const categoryResponse = await Geturl(Apis.users.get_system);
            if (categoryResponse.status === true) {
                setCategories(categoryResponse.data.categories);
            }

            const stateResponse = await Geturl(Apis.users.get_system);
            if (stateResponse.status === true) {
                setStates(stateResponse.data.cities);
            }

            const serviceResponse = await Geturl(Apis.users.get_system);
            if (serviceResponse.status === true) {
                setServices(serviceResponse.data.all_services);
            }
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const convertTimeTo12HourFormat = (time) => {
        const [hour, minute] = time.split(':');
        const hourIn12 = hour % 12 || 12;
        const ampm = hour < 12 ? 'AM' : 'PM';
        return `${hourIn12}:${minute} ${ampm}`;
    };


    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('job_title', data.job_title);
        formData.append('service_tid', data.service_tid);
        formData.append('state_tid', data.state_tid);
        formData.append('description', data.description);
        formData.append('address', data.address);
        formData.append('location_long', 6.11223322);
        formData.append('location_lat', 6.11223322);
        formData.append('time', convertTimeTo12HourFormat(data.time));
        formData.append('price', data.price);
        formData.append('date', selectedDateTime.date ? moment(selectedDateTime.date).format('YYYY-MM-DD') : data.date);

        if (image.main) {
            const binaryImage = await image.main.arrayBuffer();
            formData.append('images[]', new Blob([binaryImage]), image.main.name);
        }

        formData.append('zipcode', data.zipcode);
        formData.append('urgent', 0);

        setIsSubmitting(true);

        try {
            const res = await AuthPosturl(Apis.users.create_bookings, formData);

            if (res.status === true && res.data[0].paid === true) {
                setBookingData({
                    ...data,
                    price: data.price,
                    paymentUrl: res.text,
                    image: image.preview,
                });
                setView(2);
            } else {
                ErrorAlert('You don not have enough funds to carry out this booking.');
                setTimeout(() => {
                    if (res.data[0].paid === false) {
                        window.location.href = res.text
                    }   
                }, 2000);
            }
        } catch (error) {
            ErrorAlert('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDateSelect = (selectedDate) => {
        setSelectedDateTime((prev) => ({
            date: selectedDate,
            time: prev.time,
        }));
    };

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                alert('Please upload a valid image (JPEG/PNG).');
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                alert('File size should not exceed 2MB.');
                return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setImage({
                    main: file,
                    preview: reader.result,
                });
            };
        }
    };

    return (
        <Layout>
            <div className="bg-gray w-full xl:h-[20rem]">
                <div className="text-center py-10 xl:pt-24">
                    <p className="font-[500] text-3xl md:text-4xl mb-3">Booking Request</p>
                    <span className="flex items-center gap-4 font-[500] justify-center">
                        <p className="text-primary">Home</p>
                        <span className="bg-[#6C757D] w-3 py-0.5"></span>
                        <p className="text-secondary">Booking Request</p>
                    </span>
                </div>
            </div>
            {view === 1 && (
                <div className="mx-3 md:flex items-center justify-center">
                    <div className="my-10">
                        <div className="bg-[#e2e2e2] md:w-[30rem] py-5 px-4">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="text-sm text-[#374151]">
                                    <div className="mb-5">
                                        <label className="text-xs font-semibold">Job Title</label>
                                        <input
                                            {...register('job_title', { required: 'Job title is required' })}
                                            type="text"
                                            placeholder="Job Title"
                                            className={`inputs border ${errors.job_title ? 'border-red-600' : 'border'}`}
                                        />
                                        {errors.job_title && (
                                            <div className="text-red-600">{errors.job_title.message}</div>
                                        )}
                                    </div>

                                    <div className="mb-5">
                                        <label className="text-xs font-semibold">Job Description</label>
                                        <input
                                            {...register('description', { required: 'Job description is required' })}
                                            type="text"
                                            placeholder="Job Description"
                                            className={`inputs border ${errors.description ? 'border-red-600' : 'border'}`}
                                        />
                                        {errors.description && (
                                            <div className="text-red-600">{errors.description.message}</div>
                                        )}
                                    </div>

                                    <div className="mb-5">
                                        <label className="text-xs font-semibold">Select Service</label>
                                        <select
                                            className={`inputs border ${errors.service_tid ? 'border-red-600' : 'border'}`}
                                            {...register('service_tid', { required: 'Service is required' })}
                                        >
                                            <option value="">Select Service</option>
                                            {services.map((service) => (
                                                <option key={service.trackid} value={service.trackid}>
                                                    {service.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.service_tid && (
                                            <div className="text-red-600">{errors.service_tid.message}</div>
                                        )}
                                    </div>

                                    <div className="mb-5">
                                        <label className="text-xs font-semibold">Select State</label>
                                        <select
                                            className={`inputs border ${errors.state_tid ? 'border-red-600' : 'border'}`}
                                            {...register('state_tid', { required: 'State is required' })}
                                        >
                                            <option value="">Select State</option>
                                            {states.map((state) => (
                                                <option key={state.trackid} value={state.trackid}>
                                                    {state.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.state_tid && (
                                            <div className="text-red-600">{errors.state_tid.message}</div>
                                        )}
                                    </div>

                                    <div className="mb-5 mt-5">
                                        <label className="text-xs font-semibold">Date Required</label>
                                        <div className="overflow-x-auto scrollsdown mb-4">
                                            <div className="flex space-x-2">
                                                <CalendarDays onSelectDate={handleDateSelect} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-5">
                                        <label className="text-xs font-semibold">Time Service</label>
                                        <input
                                            {...register('time', { required: 'Time is required' })}
                                            type="time"
                                            className={`inputs border ${errors.time ? 'border-red-600' : 'border'}`}
                                            onChange={(e) =>
                                                setSelectedDateTime((prev) => ({ ...prev, time: e.target.value }))
                                            }
                                        />
                                        {errors.time && (
                                            <div className="text-red-600">{errors.time.message}</div>
                                        )}
                                    </div>

                                    <div className="mb-5">
                                        <label className="text-xs font-semibold">Address</label>
                                        <input
                                            {...register('address', { required: 'Address is required' })}
                                            type="text"
                                            placeholder="Enter Address"
                                            className={`inputs border ${errors.address ? 'border-red-600' : 'border'}`}
                                        />
                                        {errors.address && (
                                            <div className="text-red-600">{errors.address.message}</div>
                                        )}
                                    </div>

                                    <div className="mb-5">
                                        <label className="text-xs font-semibold">Price Offering</label>
                                        <input
                                            {...register('price', { required: 'Price is required' })}
                                            type="text"
                                            placeholder="Price"
                                            className={`inputs border ${errors.price ? 'border-red-600' : 'border'}`}
                                        />
                                        {errors.price && (
                                            <div className="text-red-600">{errors.price.message}</div>
                                        )}
                                    </div>

                                    <div className="mb-5">
                                        <label className="text-xs font-semibold">Zip Code</label>
                                        <input
                                            {...register('zipcode', { required: 'Zip Code is required' })}
                                            type="text"
                                            placeholder="Zip Code"
                                            className={`inputs border ${errors.zipcode ? 'border-red-600' : 'border'}`}
                                        />
                                        {errors.zipcode && (
                                            <div className="text-red-600">{errors.zipcode.message}</div>
                                        )}
                                    </div>

                                    <div className="my-4">
                                        <label>
                                            {image.preview === null ? (
                                                <div className="w-full h-32 bg-slate-200 cursor-pointer mx-auto flex items-center justify-center text-slate-600">
                                                    <FaPlus />
                                                </div>
                                            ) : (
                                                <img
                                                    src={image.preview}
                                                    alt="Preview"
                                                    className="w-full h-40 mx-auto border rounded-md object-cover"
                                                />
                                            )}
                                            <input onChange={handleUpload} type="file" hidden />
                                        </label>
                                    </div>
                                    <div className="mt-6 mb-3">
                                        <button
                                            type="submit"
                                            className="bg-secondary w-full py-3 rounded-full text-white"
                                        >
                                            {isSubmitting ? 'Processing...' : 'Book Now'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {view === 2 && bookingData && (
                <ConfirmBooking bookingData={bookingData} />
            )}
        </Layout>
    );
};

export default Booking;