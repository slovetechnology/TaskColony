import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Apis, AuthPosturl, Geturl } from '../../../Components/General/Api';
import { ErrorAlert } from '../../../Components/General/Utils';
import CalendarDays from '../../../Components/General/CalendarDays';
import { FaPlus, FaTimes } from 'react-icons/fa';
import moment from 'moment';
import Layout from '../../../Components/User/Layout';
import ConfirmBooking from './ConfirmBooking';
import Popups from '../../../Components/General/Popups';

const Booking = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState(1); // 1 = Booking Form, 2 = Confirm Booking
    const [selectedDateTime, setSelectedDateTime] = useState({ date: null, time: null });
    const [categories, setCategories] = useState([]);
    const [states, setStates] = useState([]);
    const [services, setServices] = useState([]);
    const [images, setImages] = useState([]);
    const [bookingData, setBookingData] = useState(null);
    const [location, setLocation] = useState({
        address: '',
        latitude: null,
        longitude: null,
    });
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [locationButtonText, setLocationButtonText] = useState('Get Location');

    const getUserGeoAddress = async () => {
        setLocationButtonText('Getting your location...'); // Change button text
        if (!navigator.geolocation) {
            ErrorAlert('Geolocation is not supported by your browser.');
            setLocationButtonText('Get Location'); // Reset button text
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const apiKey = "AIzaSyAWrGaFeWRxxtjxUCZGG7naNmHtg0RK88o"; // Replace with your API key
                try {
                    const response = await fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
                    );
                    const data = await response.json();
                    if (data.status === "OK" && data.results.length > 0) {
                        setLocation({
                            address: data.results[0].formatted_address,
                            latitude,
                            longitude,
                        });
                    }
                } catch (error) {
                    console.error('Error fetching geolocation:', error);
                } finally {
                    setLocationButtonText('Get Location'); // Reset button text
                }
            },
            (error) => {
                ErrorAlert(`Error fetching location: ${error.message}`);
                setLocationButtonText('Get Location'); // Reset button text
            }
        );
    };

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

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('job_title', data.job_title);
        formData.append('service_tid', data.service_tid);
        formData.append('state_tid', data.state_tid);
        formData.append('coupon_code', data.coupon_code);
        formData.append('description', data.description);
        formData.append('address', location.address || data.address);
        formData.append('location_long', location.longitude || 6.11223322);
        formData.append('location_lat', location.latitude || 6.11223322);
        formData.append('time', moment(data.time, 'HH:mm').format('hh:mm A'));
        formData.append('price', data.price);
        formData.append('date', selectedDateTime.date ? moment(selectedDateTime.date).format('MM-DD-YYYY') : moment().format('MM-DD-YYYY'));

        images.forEach(image => {
            formData.append('images[]', image);
        });

        formData.append('zipcode', data.zipcode);
        formData.append('urgent', 0);

        setIsSubmitting(true);
        setIsModalOpen(true);

        try {
            const res = await AuthPosturl(Apis.users.create_bookings, formData);
            if (res.status === true && res.data[0].paid === true) {
                setBookingData({
                    ...data,
                    price: data.price,
                    paymentUrl: res.text,
                    firstImage: images[0] ? URL.createObjectURL(images[0]) : null,
                });
                setView(2);
            } else {
                if (res.data[0].paid === false) {
                    setTimeout(() => {
                        window.location.href = res.text;
                    }, 2000);
                }
                ErrorAlert('You do not have enough funds to carry out this booking.');
            }
        } catch (error) {
            console.error('Error submitting booking:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDateSelect = useCallback((selectedDate) => {
        setSelectedDateTime((prev) => ({
            date: selectedDate,
            time: prev.time,
        }));
    }, []);

    const handleUpload = (e) => {
        const files = Array.from(e.target.files);
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/svg+xml'];

        const newImages = files.filter(file => {
            if (!validTypes.includes(file.type)) {
                alert('Please upload valid images (JPEG/PNG/SVG).');
                return false;
            }
            if (file.size > 2 * 1024 * 1024) {
                alert('File size should not exceed 2MB.');
                return false;
            }
            return true;
        });

        setImages(prevImages => [...prevImages, ...newImages]);
    };
    const handleDelete = (index) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };
    return (
        <Layout>
            <div className="bg-gray w-full xl:h-[10rem]">
                <div className="text-center py-10 pt-10">
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
                        <div className="bg-[#e2e2e2] md:w-[40rem] py-5 px-4">
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

                                    {/* Job Description */}
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

                                    {/* Select Categories */}
                                    <div className="mb-5">
                                        <label className="text-xs font-semibold">Select Categories</label>
                                        <select
                                            className={`inputs border`}
                                            {...register('category', { required: false })} // Dummy field
                                            onChange={(e) => setSelectedCategory(e.target.value)} // Update selected category
                                        >
                                            <option value="">Select Categories</option>
                                            {categories.map((category) => (
                                                <option key={category.trackid} value={category.trackid}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Select Service */}
                                    <div className="mb-5">
                                        <label className="text-xs font-semibold">Select Service</label>
                                        <select
                                            className={`inputs border ${errors.service_tid ? 'border-red-600' : 'border'}`}
                                            {...register('service_tid', { required: 'Service is required' })}
                                        >
                                            <option value="">Select Service</option>
                                            {services
                                                .filter((service) => service.cat_tid === selectedCategory) // Filter services by selected category
                                                .map((service) => (
                                                    <option key={service.trackid} value={service.trackid}>
                                                        {service.name}
                                                    </option>
                                                ))}
                                        </select>
                                        {errors.service_tid && (
                                            <div className="text-red-600">{errors.service_tid.message}</div>
                                        )}
                                    </div>

                                    {/* Select State */}
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

                                    {/* Date Required */}
                                    <div className="mb-5 mt-5">
                                        <label className="text-xs font-semibold">Date Required</label>
                                        <div className="overflow-x-auto scrollsdown mb-4">
                                            <div className="flex space-x-2">
                                                <CalendarDays onSelectDate={handleDateSelect} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Time Service */}
                                    <div className="mb-5">
                                        <label className="text-xs font-semibold">Time Service</label>
                                        <input
                                            {...register('time', { required: 'Time is required' })}
                                            type="time"
                                            className={`inputs border ${errors.time ? 'border-red-600' : 'border'}`}
                                            value={selectedDateTime.time || ''}
                                            onChange={(e) => {
                                                const newTime = e.target.value;
                                                setSelectedDateTime((prev) => ({ ...prev, time: newTime }));
                                                setValue('time', newTime, { shouldValidate: true }); // Sync with react-hook-form
                                            }}
                                        />
                                        {errors.time && (
                                            <div className="text-red-600">{errors.time.message}</div>
                                        )}
                                    </div>

                                    {/* Address */}
                                    <div className="mb-5">
                                        <div className="flex justify-between">
                                            <label className="text-xs font-semibold">Address</label>
                                            <button className="text-xs text-secondary font-semibold" type="button" onClick={getUserGeoAddress}>
                                                {locationButtonText}
                                            </button>
                                        </div>
                                        <input
                                            {...register('address', { required: 'Address is required' })}
                                            type="text"
                                            placeholder="Enter Address"
                                            className={`inputs border ${errors.address ? 'border-red-600' : 'border'}`}
                                            value={location.address}
                                            onChange={(e) => setLocation({ ...location, address: e.target.value })}
                                        />
                                        {errors.address && (
                                            <div className="text-red-600">{errors.address.message}</div>
                                        )}
                                    </div>

                                    {/* Price Offering */}
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
                                        <label className="text-xs font-semibold">Coupon</label>
                                        <input
                                            {...register('coupon_code')}
                                            type="text"
                                            placeholder="coupon"
                                            className={`inputs border ${errors.coupon_code ? 'border-red-600' : 'border'}`}
                                        />
                                       
                                    </div>

                                    {/* Zip Code */}
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


                                    <div className="my-4 w-full overflow-x-auto">
                                        <div className="flex gap-2">
                                            {images.length === 0 ? (
                                                <label className="w-full h-40 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center rounded-md cursor-pointer">
                                                    <FaPlus className="text-gray-500 mb-2" size={24} />
                                                    <span className="text-gray-500">Choose from gallery</span>
                                                    <span className="text-xs text-gray-400">(PNG, JPG, JPEG or SVG - max. 2MB)</span>
                                                    <input
                                                        onChange={handleUpload}
                                                        type="file"
                                                        multiple
                                                        accept=".png,.jpg,.jpeg,.svg" // Allow SVGs
                                                        hidden
                                                    />
                                                </label>
                                            ) : (
                                                <>
                                                    <div className="flex gap-2 overflow-x-auto items-start">
                                                        {images.map((image, index) => (
                                                            <div key={index} className="relative w-20 h-20">
                                                                <img
                                                                    src={URL.createObjectURL(image)}
                                                                    alt={`Preview ${index}`}
                                                                    className="w-full h-full border rounded-md object-cover"
                                                                />
                                                                <button
                                                                    onClick={() => handleDelete(index)}
                                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                                                    aria-label="Delete image"
                                                                >
                                                                    <FaTimes />
                                                                </button>
                                                            </div>
                                                        ))}
                                                        <label className="w-20 h-20 bg-slate-200 cursor-pointer flex items-center justify-center rounded-md flex-shrink-0">
                                                            <FaPlus className="text-slate-600" size={24} />
                                                            <input
                                                                onChange={handleUpload}
                                                                type="file"
                                                                multiple
                                                                accept=".png,.jpg,.jpeg,.svg" // Allow SVGs
                                                                hidden
                                                            />
                                                        </label>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-secondary mt-6 mb-3 w-full py-3 rounded-full text-white"
                                    >
                                        {isSubmitting ? 'Processing...' : 'Post'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {view === 2 && bookingData && (
                <ConfirmBooking bookingData={bookingData} />
            )}
            <Popups isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Commission Fee">
                <p>Task Colony will take a 10% commission on any payment made.</p>
            </Popups>
        </Layout>
    );
};

export default Booking;