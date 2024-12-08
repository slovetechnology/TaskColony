import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Apis, AuthPosturl, Geturl } from '../../../Components/General/Api';
import { ErrorAlert, ToastAlert } from '../../../Components/General/Utils';
import CalendarDays from '../../../Components/General/CalendarDays';
import { FaPlus } from 'react-icons/fa';
import moment from 'moment';
import Layout from '../../../Components/User/Layout';

const Booking = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState({ date: null, time: null });
    const [cartegory, setCategory] = useState([]);
    const [image, setImage] = useState({ main: null, preview: null });

    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const convertTimeTo12HourFormat = (time) => {
        const [hour, minute] = time.split(':');
        const hourIn12 = hour % 12 || 12; // Converts hour to 12-hour format
        const ampm = hour < 12 ? 'AM' : 'PM';
        return `${hourIn12}:${minute} ${ampm}`;
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('job_title', data.job_title);
        formData.append('service_tid', 'DF59Q');
        formData.append('state_tid', 'SBM67');
        formData.append('description', data.description);
        formData.append('address', data.address);
        formData.append('location_long', 6.11223322);
        formData.append('location_lat', 6.11223322);
        formData.append('time', convertTimeTo12HourFormat(data.time)); // Convert time to 12-hour format
        formData.append('price', data.price);
        formData.append('date', selectedDateTime.date ? moment(selectedDateTime.date).format('YYYY-MM-DD') : data.date);

        // Convert image to binary and append
        if (image.main) {
            const binaryImage = await image.main.arrayBuffer();
            formData.append('images[]', new Blob([binaryImage]), image.main.name);
        }

        formData.append('zipcode', 'zipcode');
        formData.append('urgent', 0);

        setIsSubmitting(true);

        try {
            const res = await AuthPosturl(Apis.users.create_bookings, formData);
            if (res.status === true && res.data[0].paid === true) {
                console.log(res.text);
                ToastAlert('Booking successful!');
                navigate('/booking-list');
            } else {
                // Notify the user about insufficient funds
                ErrorAlert('You do not have enough funds to complete this booking. You will be redirected to fund your account.');

                // Set a timeout to redirect to the Stripe payment page
                setTimeout(() => {
                    window.location.href = res.text; // Assuming res.text contains the Stripe URL
                }, 5000); // Redirect after 5 seconds
            }
        } catch (error) {
            ErrorAlert('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchAllHome = useCallback(async () => {
        setLoading(true);
        try {
            const res = await Geturl(Apis.users.get_system);
            if (res.status === true) {
                setCategory(res.data.categories);
            } else {
                console.log(res);
            }
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllHome();
    }, [fetchAllHome]);

    const handleDateSelect = (selectedDate) => {
        setSelectedDateTime(prev => ({
            date: selectedDate,
            time: prev.time
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
                                    {errors.job_title && <div className="text-red-600">{errors.job_title.message}</div>}
                                </div>

                                <div className="mb-5">
                                    <label className="text-xs font-semibold">Job Description</label>
                                    <input
                                        {...register('jobDescription', { required: 'Job description is required' })}
                                        type="text"
                                        placeholder="Job Description"
                                        className={`inputs border ${errors.jobDescription ? 'border-red-600' : 'border'}`}
                                    />
                                    {errors.jobDescription && <div className="text-red-600">{errors.jobDescription.message}</div>}
                                </div>

                                <div className="mb-5">
                                    <label className="text-xs font-semibold">Select Category</label>
                                    <select className="inputs" {...register('category')}>
                                        {cartegory.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.name}
                                            </option>
                                        ))}
                                    </select>
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
                                        onChange={(e) => setSelectedDateTime(prev => ({ ...prev, time: e.target.value }))}
                                    />
                                    {errors.time && <div className="text-red-600">{errors.time.message}</div>}
                                </div>

                                <div className="mb-5">
                                    <label className="text-xs font-semibold">Address</label>
                                    <input
                                        {...register('address', { required: 'Address is required' })}
                                        type="text"
                                        placeholder="Enter Address"
                                        className={`inputs border ${errors.address ? 'border-red-600' : 'border'}`}
                                    />
                                    {errors.address && <div className="text-red-600">{errors.address.message}</div>}
                                </div>

                                <div className="mb-5">
                                    <label className="text-xs font-semibold">Price Offering</label>
                                    <input
                                        {...register('price', { required: 'Price is required' })}
                                        type="text"
                                        placeholder="Price"
                                        className={`inputs border ${errors.price ? 'border-red-600' : 'border'}`}
                                    />
                                    {errors.price && <div className="text-red-600">{errors.price.message}</div>}
                                </div>

                                <div className="mb-5">
                                    <label className="text-xs font-semibold">Zip Code</label>
                                    <input
                                        {...register('zipcode', { required: 'Zip Code is required' })}
                                        type="text"
                                        placeholder="Zip Code"
                                        className={`inputs border ${errors.zipcode ? 'border-red-600' : 'border'}`}
                                    />
                                    {errors.zipcode && <div className="text-red-600">{errors.zipcode.message}</div>}
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
        </Layout>
    );
};

export default Booking;