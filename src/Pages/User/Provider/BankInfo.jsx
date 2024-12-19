import React from 'react'
import Modal from '../../../Components/General/Modal'
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Apis, AuthPosturl } from "../../../Components/General/Api";

const BankInfo = ({ closeView }) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [buttonText, setButtonText] = useState("Update Detail");
    const onSubmit = async (data) => {
        const datatosend = {
            bank_holder_name: data.bank_holder_name,
            bank_name: data.bank_name,
            bank_route_no: data.bank_route_no,
            bank_address: data.bank_address,
            bank_acc_no: data.bank_acc_no,
        };
        setButtonText("Updating...");

        const res = await AuthPosturl(Apis.users.update_bank_info, datatosend);

        if (res.status === true) {

        } else {
            console.error("Error funding wallet:", res.error);
            setButtonText("Try Again");
        }
    };
    return (
        <Modal closeView={closeView}>
            <div className="font-semibold text-lg mb-4">Update Bank Information</div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label>Bank Holder Name</label>
                        <input
                            {...register('bank_holder_name', { required: 'bank holder name is required' })}
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
                        type="submit"
                        className="bg-secondary text-white py-1 px-2 rounded-md mt-5"
                    >
                        {buttonText}
                    </button>
                </form>
            </div>
        </Modal>
    )
}

export default BankInfo
