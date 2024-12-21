import React, { useEffect, useState } from 'react';
import Modal from '../../../Components/General/Modal';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Apis, AuthPosturl } from "../../../Components/General/Api";
import { ToastAlert } from '../../../Components/General/Utils';
import { useSelector } from 'react-redux';

const BankInfo = ({ closeView }) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [isUpdating, setIsUpdating] = useState(false);
    const { user } = useSelector((state) => state.data);

    // Pre-fill form if user data is available
    useEffect(() => {
        if (user) {
            setValue('bank_holder_name', user.bank_holder_name || '');
            setValue('bank_name', user.bank_name || '');
            setValue('bank_route_no', user.bank_route_no || '');
            setValue('bank_address', user.bank_address || '');
            setValue('bank_acc_no', user.bank_acc_no || '');
        }
    }, [user, setValue]);

    const onSubmit = async (data) => {
        if (isUpdating) {
            const datatosend = {
                bank_holder_name: data.bank_holder_name,
                bank_name: data.bank_name,
                bank_route_no: data.bank_route_no,
                bank_address: data.bank_address,
                bank_acc_no: data.bank_acc_no,
            };

            const res = await AuthPosturl(Apis.users.update_bank_info, datatosend);

            if (res.status === true) {
                ToastAlert('Your withdrawal request is being processed');
                closeView(); // Close modal on success
            } else {
                console.error("Error updating bank info:", res.error);
                ToastAlert('Error updating bank info. Please try again.');
            }
        } else {
            ToastAlert('Your request will be processed shortly');
            closeView(); // Close modal without updating
        }
    };

    return (
        <Modal height='' closeView={closeView}>
            <div className="font-semibold text-lg mb-4">Update Bank Information</div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label>Bank Holder Name</label>
                        <input
                            {...register('bank_holder_name', { required: 'Bank holder name is required' })}
                            type="text"
                            className={`input border ${errors.bank_holder_name ? 'border-red-600' : 'border-gray-300'}`}
                        />
                        {errors.bank_holder_name && <div className="text-red-600">{errors.bank_holder_name.message}</div>}
                    </div>

                    <div className="mb-3">
                        <label>Bank Name</label>
                        <input
                            {...register('bank_name', { required: 'Bank name is required' })}
                            type="text"
                            className={`input border ${errors.bank_name ? 'border-red-600' : 'border-gray-300'}`}
                        />
                        {errors.bank_name && <div className="text-red-600">{errors.bank_name.message}</div>}
                    </div>

                    <div className="mb-3">
                        <label>Bank Route Number</label>
                        <input
                            {...register('bank_route_no', { required: 'Bank route number is required' })}
                            type="text"
                            className={`input border ${errors.bank_route_no ? 'border-red-600' : 'border-gray-300'}`}
                        />
                        {errors.bank_route_no && <div className="text-red-600">{errors.bank_route_no.message}</div>}
                    </div>

                    <div className="mb-3">
                        <label>Bank Address</label>
                        <input
                            {...register('bank_address', { required: 'Bank address is required' })}
                            type="text"
                            className={`input border ${errors.bank_address ? 'border-red-600' : 'border-gray-300'}`}
                        />
                        {errors.bank_address && <div className="text-red-600">{errors.bank_address.message}</div>}
                    </div>

                    <div className="mb-3">
                        <label>Bank Account Number</label>
                        <input
                            {...register('bank_acc_no', { required: 'Bank account number is required' })}
                            type="text"
                            className={`input border ${errors.bank_acc_no ? 'border-red-600' : 'border-gray-300'}`}
                        />
                        {errors.bank_acc_no && <div className="text-red-600">{errors.bank_acc_no.message}</div>}
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsUpdating(!isUpdating)}
                        className="bg-secondary text-white py-1 px-2 rounded-md mt-5"
                    >
                        { "Update"}
                    </button>

                    <button
                        type="submit"
                        className="bg-secondary text-white py-1 px-2 ml-6 rounded-md mt-5"
                    >
                        {"Confirm"}
                    </button>
                </form>
            </div>
        </Modal>
    );
};

export default BankInfo;