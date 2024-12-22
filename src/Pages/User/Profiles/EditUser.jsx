import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../../Components/General/Modal';
import { Apis, AuthPosturl } from '../../../Components/General/Api';
import { ErrorAlert, ToastAlert } from '../../../Components/General/Utils';

const EditUser = ({ closeView, singles }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    // Populate form with existing user data
    useEffect(() => {
        if (singles) {
            setValue('email', singles.email || '');
            setValue('state', singles.state || '');
            setValue('address', singles.address || '');
            setValue('city', singles.city || '');
            setValue('postalcode', singles.postalcode || '');
            setValue('phoneno', singles.phone || '');
        }
    }, [singles, setValue]);

    const onSubmit = async (data, event) => {
        event.preventDefault();
        setIsSubmitting(true);

        const payload = {
            state_tid: data.state,
            address: data.address,
            city: data.city,
            postalcode: data.postalcode,
            phoneno: data.phoneno,
            trackid: singles.trackid,
        };

        try {
            const response = await AuthPosturl(Apis.users.edit_user_profile, payload,);
            if (response.status === true) {
                ToastAlert(response.text)
            }
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error updating user:', error);
            ErrorAlert(response.text)
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal height="h-[32rem]" closeView={closeView}>
            <div className="text-black">
                <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
                <form onSubmit={handleSubmit(onSubmit)}>


                    <div className="mb-3">
                        <label>State</label>
                        <input
                            {...register('state', { required: 'State is required' })}
                            type="text"
                            className={`input border ${errors.state ? 'border-red-600' : 'border'}`}
                        />
                        {errors.state && <div className="text-red-600">{errors.state.message}</div>}
                    </div>

                    <div className="mb-3">
                        <label>Address</label>
                        <input
                            {...register('address', { required: 'address is required' })}
                            type="text"
                            className={`input border ${errors.address ? 'border-red-600' : 'border'}`}
                        />
                        {errors.address && <div className="text-red-600">{errors.address.message}</div>}
                    </div>
                    <div className="mb-3">
                        <label>City</label>
                        <input
                            {...register('city', { required: 'city is required' })}
                            type="text"
                            className={`input border ${errors.city ? 'border-red-600' : 'border'}`}
                        />
                        {errors.city && <div className="text-red-600">{errors.city.message}</div>}
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
