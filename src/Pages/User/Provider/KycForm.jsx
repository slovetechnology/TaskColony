import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../../Components/General/Modal';
import { Apis, AuthPosturl } from '../../../Components/General/Api';
import { FaPlus } from 'react-icons/fa';

const KycForm = ({ closeView, isOpen }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
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
                    main: file, // Store the actual file for binary upload
                    preview: reader.result, // Display the image preview
                });
            };
        }
    };

    const onSubmit = async (data, event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            // Prepare the form data for binary upload
            const formData = new FormData();
            formData.append('firstname', data.firstname);
            formData.append('lastname', data.lastname);
            formData.append('middlename', data.middlename);
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
            if (image.main) {
                formData.append('images[]', image.main); // Append the binary file
            }

            const response = await AuthPosturl(Apis.users.kyc_form, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error submitting KYC form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal closeView={closeView}>

            <div className="text-black">
                <h2 className="text-xl font-bold mb-4">KYC Form</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="mb-3">
                            <label>First Name</label>
                            <input
                                {...register('firstname', { required: 'First name is required' })}
                                type="text"
                                className={`input border ${errors.firstname ? 'border-red-600' : 'border'}`}
                            />
                            {errors.firstname && <div className="text-red-600">{errors.firstname.message}</div>}
                        </div>
                        <div className="mb-3">
                            <label>Last Name</label>
                            <input
                                {...register('lastname', { required: 'Last name is required' })}
                                type="text"
                                className={`input border ${errors.lastname ? 'border-red-600' : 'border'}`}
                            />
                            {errors.lastname && <div className="text-red-600">{errors.lastname.message}</div>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="mb-3">
                            <label>Middle Name</label>
                            <input
                                {...register('middlename', { required: 'Middle name is required' })}
                                type="text"
                                className={`input border ${errors.middlename ? 'border-red-600' : 'border'}`}
                            />
                            {errors.middlename && <div className="text-red-600">{errors.middlename.message}</div>}
                        </div>
                        <div className="mb-3">
                            <label>Email</label>
                            <input
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                        message: 'Enter a valid email',
                                    },
                                })}
                                type="email"
                                className={`input border ${errors.email ? 'border-red-600' : 'border'}`}
                            />
                            {errors.email && <div className="text-red-600">{errors.email.message}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="mb-3">
                            <label>Phone Number</label>
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
                                className={`input border ${errors.phone ? 'border-red-600' : 'border'}`}
                            />
                            {errors.phone && <div className="text-red-600">{errors.phone.message}</div>}
                        </div>
                        <div className="mb-3">
                            <label>State</label>
                            <input
                                {...register('state_tid', { required: 'State is required' })}
                                type="text"
                                className={`input border ${errors.state_tid ? 'border-red-600' : 'border'}`}
                            />
                            {errors.state_tid && <div className="text-red-600">{errors.state_tid.message}</div>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="mb-3">
                            <label>Company Name</label>
                            <input
                                {...register('companyname', { required: 'Company name is required' })}
                                type="text"
                                className={`input border ${errors.companyname ? 'border-red-600' : 'border'}`}
                            />
                            {errors.companyname && <div className="text-red-600">{errors.companyname.message}</div>}
                        </div>
                        <div className="mb-3">
                            <label>Identity Type</label>
                            <select
                                {...register('identitytype', { required: 'Identity type is required' })}
                                className={`input border ${errors.identitytype ? 'border-red-600' : 'border'}`}
                            >
                                <option value="">Select</option>
                                <option value="Individual">Individual</option>
                                <option value="Company">Company</option>
                            </select>
                            {errors.identitytype && <div className="text-red-600">{errors.identitytype.message}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="mb-3">
                            <label>Security Number</label>
                            <input
                                {...register('security_number', { required: 'Security number is required' })}
                                type="text"
                                className={`input border ${errors.security_number ? 'border-red-600' : 'border'}`}
                            />
                            {errors.security_number && <div className="text-red-600">{errors.security_number.message}</div>}
                        </div>
                        <div className="mb-3">
                            <label>Security Number Type</label>
                            <input
                                {...register('sostype', { required: 'Security number type is required' })}
                                type="text"
                                placeholder="SSN/ITIN/EIN"
                                className={`input border ${errors.sostype ? 'border-red-600' : 'border'}`}
                            />
                            {errors.sostype && <div className="text-red-600">{errors.sostype.message}</div>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="mb-3">
                            <label>Date of Birth</label>
                            <input
                                {...register('dob', { required: 'Date of Birth is required' })}
                                type="date"
                                className={`input border ${errors.dob ? 'border-red-600' : 'border'}`}
                            />
                            {errors.dob && <div className="text-red-600">{errors.dob.message}</div>}
                        </div>
                        <div className="mb-3">
                            <label>Gender</label>
                            <select
                                {...register('gender', { required: 'Gender is required' })}
                                className={`input border ${errors.gender ? 'border-red-600' : 'border'}`}
                            >
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.gender && <div className="text-red-600">{errors.gender.message}</div>}
                        </div>
                    </div>
                    <div className="mb-3">
                        <label>Address</label>
                        <input
                            {...register('address', { required: 'Address is required' })}
                            type="text"
                            className={`input border ${errors.address ? 'border-red-600' : 'border'}`}
                        />
                        {errors.address && <div className="text-red-600">{errors.address.message}</div>}
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
                    <div className="flex mt-10 justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeView}
                            className="px-4 py-2 bg-gray-200 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`px-4 py-2 bg-blue-500 text-white rounded ${isSubmitting ? 'opacity-50' : ''}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>

    );
};

export default KycForm;
