import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Apis, Posturl } from '../../../Components/General/Api';
import { ErrorAlert, ToastAlert } from '../../../Components/General/Utils';
import CalendarDays from '../../../Components/General/CalendarDays';
import { FaPlus } from 'react-icons/fa';
import Modal from '../../../Components/General/Modal';

const Booking = ({ closeView }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [image, setImage] = useState({
        main: null,
        preview: null,
    });

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
    const navigate = useNavigate();
    const [cartegory, setCategory] = useState([]);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            const res = await Posturl(Apis.users.register,);
            if (res.data.status === true) {

            } else {
                ErrorAlert(res.text || 'Registration failed');
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
                console.log(error)
            }
        } catch (err) {
            setError(err.message);
        } finally {
        }
    }, []);

    useEffect(() => {
        fetchAllHome();
    }, [fetchAllHome]);

    const handleDateSelect = () => {
        const selectedMoment = moment(date);
        setMonth(selectedMoment.format("MMMM"));
        setYear(selectedMoment.year());

        setSelectedDateTime((prev) => {
            const newDateTime = { date, time: prev.time };
            localStorage.setItem("selectedDateTime", JSON.stringify(newDateTime));
            onTimeSelect(newDateTime);
            return newDateTime;
        });
    };
    return (
        <Modal height="h-[35rem]" closeView={closeView}>
            <div className="text-xl font-semibold">New Booking Request</div>
            <div className="flex items-center justify-center">
                <div className="my-10 ">
                    <div className="bg-[#e2e2e2]  md:w-[30rem] rounded-br-md shadow-2xl py-5 px-6">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="text-sm text-[#374151]">

                                <div className="mb-5 ">
                                    <label className='text-xs font-semibold'>job Title</label>
                                    <input
                                        {...register('lastname', { required: 'Last name is required' })}
                                        type="text" placeholder='Job Title'
                                        className={`inputs border ${errors.lastname ? 'border-red-600' : 'border'}`}
                                    />
                                    {errors.lastname && <div className="text-red-600">{errors.lastname.message}</div>}
                                </div>

                                <div className="mb-5 ">
                                    <label className='text-xs font-semibold'>Job Description</label>
                                    <input
                                        {...register('lastname', { required: 'Last name is required' })}
                                        type="text" placeholder='Job Description'
                                        className={`inputs border ${errors.lastname ? 'border-red-600' : 'border'}`}
                                    />
                                    {errors.lastname && <div className="text-red-600">{errors.lastname.message}</div>}
                                </div>

                                <div className="mb-5 ">
                                    <label className='text-xs font-semibold'>Select Category</label>
                                    <select className="inputs" {...register('status')}>
                                        {cartegory.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-5  mt-5">
                                    <label className='text-xs font-semibold'>Date Required</label>
                                    <div className="overflow-x-auto scrollsdown mb-4">
                                        <div className="flex space-x-2">
                                            <CalendarDays onSelectDate={handleDateSelect} />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-5 ">
                                    <label className='text-xs font-semibold'>Time Service</label>
                                    <input
                                        {...register('lastname', { required: 'Last name is required' })}
                                        type="time"
                                        placeholder='Time'
                                        className={`inputs border ${errors.lastname ? 'border-red-600' : 'border'}`}
                                    />
                                    {errors.lastname && <div className="text-red-600">{errors.lastname.message}</div>}
                                </div>

                                <div className="mb-5 ">
                                    <label className='text-xs font-semibold'>Address</label>
                                    <input
                                        {...register('lastname', { required: 'Last name is required' })}
                                        type="text"
                                        placeholder='Enter Address'
                                        className={`inputs border ${errors.lastname ? 'border-red-600' : 'border'}`}
                                    />
                                    {errors.lastname && <div className="text-red-600">{errors.lastname.message}</div>}
                                </div>

                                <div className="mb-5 ">
                                    <label className='text-xs font-semibold'>Price Offering</label>
                                    <input
                                        {...register('lastname', { required: 'Last name is required' })}
                                        type="text"
                                        placeholder='Price'
                                        className={`inputs border ${errors.lastname ? 'border-red-600' : 'border'}`}
                                    />
                                    {errors.lastname && <div className="text-red-600">{errors.lastname.message}</div>}
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
        </Modal>
    );
};

export default Booking;