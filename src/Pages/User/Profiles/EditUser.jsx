import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../../Components/General/Modal';
import { Apis, AuthPosturl, Geturl } from '../../../Components/General/Api';
import { ErrorAlert, ToastAlert } from '../../../Components/General/Utils';

const EditUser = ({ closeView, singles }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [image, setImage] = useState({
        main: null,
        preview: singles.passport || null, // Use existing passport image as preview if available
    });

    const [selectedState, setSelectedState] = useState(''); // State for selected state
    const [states, setStates] = useState([]);
    const [loading, setLoading] = useState(false);

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
        if (singles) {
            setValue('firstname', singles.firstname || '');
            setValue('lastname', singles.lastname || '');
            setValue('email', singles.email || '');
            setValue('state', singles.state || '');
            setValue('address', singles.address1 || '');
            setValue('city', singles.cityname || '');
            setValue('postalcode', singles.postalcode || '');
            setValue('phoneno', singles.phone || ''); // Auto-populate phone number
        }
    }, [singles, setValue]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const onImageChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            setImage({
                main: file,
                preview: reader.result, // Set the preview to the uploaded image
            });
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data, event) => {
        event.preventDefault();
        setIsSubmitting(true);

        const payload = new FormData();
        payload.append('state_tid', data.state);
        payload.append('phoneno', data.phoneno);
        payload.append('address', data.address);
        payload.append('city', selectedState);
        payload.append('postalcode', data.postalcode);
        payload.append('trackid', singles.trackid);
        if (image.main) {
            payload.append('image', image.main);
        }

        try {
            const response = await AuthPosturl(Apis.users.edit_user_profile, payload);
            if (response.status === true) {
                ToastAlert(response.text);
                closeView();
                window.location.reload();
            }
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error updating user:', error);
            ErrorAlert(error.text);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal height="h-[32rem]" closeView={closeView}>
            <div className="text-black">
                <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-5">
                        <label className="text-xs font-semibold">First Name</label>
                        <input
                            {...register('firstname')}
                            type="text"
                            placeholder=""
                            className={`inputs border ${errors.firstname ? 'border-red-600' : 'border'}`}
                            readOnly // Make the field read-only
                        />
                    </div>

                    <div className="mb-5">
                        <label className="text-xs font-semibold">Last Name</label>
                        <input
                            {...register('lastname')}
                            type="text"
                            placeholder=""
                            className={`inputs border ${errors.lastname ? 'border-red-600' : 'border'}`}
                            readOnly // Make the field read-only
                        />
                    </div>

                    <div className="mb-5">
                        <label className="text-xs font-semibold">Select State</label>
                        <select
                            className={`inputs border ${errors.state ? 'border-red-600' : 'border'}`}
                            {...register('state', { required: 'State is required' })}
                            onChange={(e) => {
                                const selectedStateId = e.target.value;
                                const state = states.find(state => state.trackid === selectedStateId);
                                setSelectedState(state ? state.name : ''); // Set selected state name
                                setValue('state', selectedStateId); // Set the state ID in the form
                            }}
                        >
                            <option value="">Select State</option>
                            {states.length > 0 ? (
                                states.map((state) => (
                                    <option key={state.trackid} value={state.trackid}>
                                        {state.name}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No states available</option>
                            )}
                        </select>
                        {errors.state && (
                            <div className="text-red-600">{errors.state.message}</div>
                        )}
                    </div>

                    <div className="mb-5">
                        <label className="text-xs font-semibold">City</label>
                        <input
                            {...register('city')}
                            type="text"
                            placeholder="City"
                            className={`inputs border ${errors.city ? 'border-red-600' : 'border'}`}
                            value={selectedState} // Display selected state name
                            onChange={(e) => setSelectedState(e.target.value)} // Allow user to edit
                        />
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

                    <div className="mb-3">
                        <label>Zip Code</label>
                        <input
                            {...register('postalcode', { required: 'Zip code is required' })}
                            type="text"
                            className={`input border ${errors.postalcode ? 'border-red-600' : 'border'}`}
                        />
                        {errors.postalcode && <div className="text-red-600">{errors.postalcode.message}</div>}
                    </div>

                    <div className="mb-3">
                        <label>Contact Number</label>
                        <input
                            {...register('phoneno', {
                                required: 'Phone number is required',
                                minLength: { value: 10, message: 'Phone number must be at least 10 digits' },
                                maxLength: { value: 11, message: 'Phone number must not exceed 11 digits' },
                                pattern: { value: /^[0-9]*$/, message: 'Only numbers are allowed' },
                            })}
                            type="text"
                            className={`input border ${errors.phoneno ? 'border-red-600' : 'border'}`}
                        />
                        {errors.phoneno && <div className="text-red-600">{errors.phoneno.message}</div>}
                    </div>

                    <div className="mb-3">
                        <label>Upload Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onImageChange}
                            className="input border"
                        />
                    </div>

                    {image.preview && (
                        <div className="mb-3">
                            <img
                                src={image.preview}
                                alt="Preview"
                                className="w-full h-32 border object-cover"
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
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

export default EditUser;