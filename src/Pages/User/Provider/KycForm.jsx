import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../../Components/General/Modal';
import { Apis, AuthPosturl, Geturl } from '../../../Components/General/Api';
import { FaPlus } from 'react-icons/fa';
import { ErrorAlert, ToastAlert } from '../../../Components/General/Utils';
import TermsOfService from './TermsOfService';

const KycForm = ({ closeView, isOpen }) => {
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState({
        address: '',
        latitude: null,
        longitude: null,
    });
    const [states, setStates] = useState([]);
    const [locationButtonText, setLocationButtonText] = useState('Get Location');
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const [agreeTerms, setAgreeTerms] = useState(false); // Checkbox state

    const getUserGeoAddress = async () => {
        setLocationButtonText('Getting your location...');
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            setLocationButtonText('Get Location');
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
                    setLocationButtonText('Get Location');
                }
            },
            (error) => {
                alert(`Error fetching location: ${error.message}`);
                setLocationButtonText('Get Location');
            }
        );
    };

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        try {
            const stateResponse = await Geturl(Apis.users.get_system);
            if (stateResponse.status === true) {
                setStates(stateResponse.data.cities);
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

    const handleUpload = (e) => {
        const file = e.target.files[0];
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/svg+xml'];

        if (file) {
            if (!validTypes.includes(file.type)) {
                alert('Please upload a valid image (JPEG/PNG/SVG).');
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                alert('File size should not exceed 2MB.');
                return;
            }
            setImage(file);
        }
    };

    const onSubmit = async (data, event) => {
        event.preventDefault();
        if (!agreeTerms) {
            ErrorAlert('You must agree to the Terms of Service.');
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('firstname', data.firstname);
            formData.append('lastname', data.lastname);
            if (data.middlename) {
                formData.append('middlename', data.middlename);
            }
            formData.append('address', data.address);
            formData.append('email', data.email);
            formData.append('companyname', data.companyname);
            formData.append('security_number', data.security_number);
            formData.append('identitytype', data.identitytype);
            formData.append('sostype', data.sostype);
            formData.append('state_tid', data.state_tid);
            formData.append('phone', data.phone);
            formData.append('gender', data.gender);
            formData.append('dob', data.dob);
            if (image) {
                formData.append('images[]', image);
            }

            const response = await AuthPosturl(Apis.users.kyc_form, formData);
            if (response.status === true) {
                ToastAlert('KYC form submitted successfully');
                setTimeout(() => {
                    window.location.href = '/provider';
                }, 200);
            }
        } catch (error) {
            console.error('Error submitting KYC form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    const [isButtonActive, setIsButtonActive] = useState(false);

    const handleButtonClick = () => {
        setIsButtonActive(true);
    };
    const handleCheckboxChange = (e) => {
        setAgreeTerms(e.target.checked);
        if (e.target.checked) {
            setIsModalOpen(true); // Open the modal when checked
        } else {
            setIsModalOpen(false); // Close the modal if unchecked
        }
    };

    if (!isOpen) return null;

    return (
        <Modal height='h-[40rem]' width='w-[40rem]' closeView={closeView}>
            <div className="text-black">
                <h2 className="text-xl font-bold mb-4">KYC Form</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="mb-3">
                            <label className="text-xs font-semibold">First Name</label>
                            <input
                                {...register('firstname', { required: 'First name is required' })}
                                type="text"
                                className={`input border ${errors.firstname ? 'border-red-600' : 'border'}`}
                                placeholder='Enter your first name'
                            />
                            {errors.firstname && <div className="text-red-600 text-xs">{errors.firstname.message}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="text-xs font-semibold">Last Name</label>
                            <input
                                {...register('lastname', { required: 'Last name is required' })}
                                type="text"
                                className={`input border ${errors.lastname ? 'border-red-600' : 'border'}`}
                                placeholder='Enter your last name'
                            />
                            {errors.lastname && <div className="text-red-600 text-xs">{errors.lastname.message}</div>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="mb-3">
                            <label className="text-xs font-semibold">Middle Name (Optional)</label>
                            <input
                                {...register('middlename')}
                                type="text"
                                placeholder='Enter your middle name'
                                className={`input border ${errors.middlename ? 'border-red-600' : 'border'}`}
                            />
                            {errors.middlename && <div className="text-red-600 text-xs">{errors.middlename.message}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="text-xs font-semibold">Email</label>
                            <input
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                        message: 'Enter a valid email',
                                    },
                                })}
                                type="email"
                                placeholder='Enter your email address'
                                className={`input border ${errors.email ? 'border-red-600' : 'border'}`}
                            />
                            {errors.email && <div className="text-red-600 text-xs">{errors.email.message}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="mb-3">
                            <label className="text-xs font-semibold">Enter Your Phone Number</label>
                            <input
                                {...register('phone', {
                                    required: 'Phone number is required',
                                    minLength: {
                                        value: 10,
                                        message: 'Phone number must be at least 10 digits.',
                                    },
                                    maxLength: {
                                        value: 11,
                                        message: 'Phone number must not exceed 11 digits.',
                                    },
                                    pattern: {
                                        value: /^[0-9]+$/,
                                        message: 'Phone number must only contain digits.',
                                    }
                                })}
                                type="text"
                                placeholder='Enter your phone number'
                                className={`input border ${errors.phone ? 'border-red-600' : 'border'}`}
                            />
                            {errors.phone && <div className="text-red-600 text-xs">{errors.phone.message}</div>}
                        </div>
                        <div className="mb-5">
                            <label className="text-xs font-semibold">City</label>
                            <select
                                className={`inputs border ${errors.state_tid ? 'border-red-600' : 'border'}`}
                                {...register('state_tid', { required: 'State is required' })}
                            >
                                <option value="">Select City</option>
                                {states.map((state) => (
                                    <option key={state.trackid} value={state.trackid}>
                                        {state.name}
                                    </option>
                                ))}
                            </select>
                            {errors.state_tid && (
                                <div className="text-red-600 text-xs">{errors.state_tid.message}</div>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="mb-3">
                            <label className="text-xs font-semibold">Company Name</label>
                            <input
                                {...register('companyname', { required: 'Company name is required' })}
                                type="text"
                                placeholder='Enter your company name'
                                className={`input border ${errors.companyname ? 'border-red-600' : 'border'}`}
                            />
                            {errors.companyname && <div className="text-red-600 text-xs">{errors.companyname.message}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="text-xs font-semibold">What’s your identity?</label>
                            <select
                                {...register('identitytype', { required: 'Identity type is required' })}
                                className={`input border ${errors.identitytype ? 'border-red-600' : 'border'}`}
                            >
                                <option value="">Select</option>
                                <option value="Individual">Individual</option>
                                <option value="Company">Company</option>
                            </select>
                            {errors.identitytype && <div className="text-red-600 text-xs">{errors.identitytype.message}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="mb-3">
                            <label className="text-xs font-semibold">Social Security Number Type</label>
                            <select
                                {...register('sostype', { required: 'Social security number type is required' })}
                                className={`input border ${errors.sostype ? 'border-red-600' : 'border'}`}
                            >
                                <option value="">Select</option>
                                <option value="SSN">SSN</option>
                                <option value="ITIN">ITIN</option>
                                <option value="EIN">EIN</option>
                            </select>
                            {errors.sostype && <div className="text-red-600 text-xs">{errors.sostype.message}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="text-xs font-semibold">Social Security Number</label>
                            <input
                                {...register('security_number', { required: 'Security number is required' })}
                                type="text"
                                className={`input border ${errors.security_number ? 'border-red-600' : 'border'}`}
                            />
                            {errors.security_number && <div className="text-red-600 text-xs">{errors.security_number.message}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="mb-3">
                            <label className="text-xs font-semibold">Gender</label>
                            <select
                                {...register('gender', { required: 'Gender is required' })}
                                className={`input border ${errors.gender ? 'border-red-600' : 'border'}`}
                            >
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            {errors.gender && <div className="text-red-600 text-xs">{errors.gender.message}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="text-xs font-semibold">Date Of Birth</label>
                            <input
                                {...register('dob', { required: 'Date of birth is required' })}
                                type="date"
                                className={`input border ${errors.dob ? 'border-red-600' : 'border'}`}
                            />
                            {errors.dob && <div className="text-red-600 text-xs">{errors.dob.message}</div>}
                        </div>
                    </div>

                    <div className="mb-5">
                        <div className="flex justify-between">
                            <label className="text-xs font-semibold">Address</label>
                            <button
                                className="text-xs text-secondary font-semibold"
                                type="button"
                                onClick={async () => {
                                    await getUserGeoAddress();
                                    setValue('address', location.address, { shouldValidate: true });
                                }}
                            >
                                {locationButtonText}
                            </button>
                        </div>
                        <input
                            {...register('address', { required: 'Address is required' })}
                            type="text"
                            placeholder="Enter Address"
                            className={`inputs border ${errors.address ? 'border-red-600' : 'border'}`}
                            value={location.address}
                            onChange={(e) => {
                                const newAddress = e.target.value;
                                setLocation({ ...location, address: newAddress });
                                setValue('address', newAddress, { shouldValidate: true });
                            }}
                        />
                        {errors.address && (
                            <div className="text-red-600 text-xs">{errors.address.message}</div>
                        )}
                    </div>
                    <div className="my-4 w-full overflow-x-auto">
                        <div className="flex gap-2">
                            {!image ? (
                                <label className="w-full h-40 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center rounded-md cursor-pointer">
                                    <FaPlus className="text-gray-500 mb-2" size={24} />
                                    <span className="text-gray-500">Choose from gallery</span>
                                    <span className="text-xs text-gray-400">(PNG, JPG, JPEG or SVG - max. 2MB)</span>
                                    <input
                                        onChange={handleUpload}
                                        type="file"
                                        accept=".png,.jpg,.jpeg,.svg"
                                        hidden
                                    />
                                </label>
                            ) : (
                                <div className="relative">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Preview"
                                        className="w-screen h-40 border rounded-md object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-6 mb-3 space-y-3">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                className="accent-secondary mr-2"
                                onChange={handleCheckboxChange}
                            />
                            <span className="text-secondary underline">I agree to the Terms Of Service</span>
                        </label>
                    </div>
                    <button
                        type="submit"
                        className={`px-4 py-1 rounded-md text-white ${isButtonActive ? 'bg-green-500' : 'bg-secondary'}`}
                        disabled={isSubmitting}
                        onClick={handleButtonClick}
                    >
                        Submit
                    </button>
                </form>
            </div>

            <TermsOfService isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </Modal>
    );
};

export default KycForm;