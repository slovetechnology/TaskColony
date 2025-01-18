import React, { useEffect, useState } from 'react';
import ModalLayout from '../../../../Components/Admin/ModalLayout';
import { Apis, AuthPosturl } from '../../../../Components/General/Api';
import { useForm } from 'react-hook-form';
import { ToastAlert } from '../../../../Components/General/Utils';

const statusToVariant = {
    approved: 'success',
    pending: 'warn',
    rejected: 'dark',
    processing: 'accept',
};

// Status options for dropdown display
const statusOptions = Object.keys(statusToVariant).map(status => ({
    value: status,
    label: status.charAt(0).toUpperCase() + status.slice(1)
}));

// Numeric mapping for API
const statusToNumber = {
    approved: 1,
    pending: 0,
    rejected: 2,
    processing: 3,
};

// Textual representation for status
const statusTextMapping = {
    0: 'Pending',
    1: 'Approved',
    2: 'Rejected',
    3: 'Processing',
};

const UpdateDocument = ({ closeView, singles, resendSignal, trackid }) => {
    const { register, setValue, handleSubmit } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (singles.status_text) {
            setValue('status', singles.status_text.toLowerCase());
        }
    }, [singles, setValue]);

    const onSubmit = async (data) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const dataToSend = {
                status: statusToNumber[data.status],
                data_tid: trackid, // Include trackid in the payload
            };

            const res = await AuthPosturl(Apis.admins.update_provider_docs, dataToSend);
            if (res.status) {
                ToastAlert(res.text);
                resendSignal();
                closeView();
            } else {
                ToastAlert(res.text || 'Update failed');
            }
        } catch (error) {
            console.error('Error:', error);
            ToastAlert('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ModalLayout closeView={closeView}>
            <div className="bg-white w-[95%] mx-auto text-primary h-[27rem] pt-10 overflow-hidden scrollsdown">
                <div className="text-slate-600 text-xl rounded-lg shadow-xl mb-5 bg-blue-50 p-3">Update Document</div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mt-5">
                        <div className="mb-10">
                            <label className="text-xs">Status</label>
                            <select className="admininput" {...register('status')}>
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className={`bg-pink px-10 py-2 text-white rounded-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </ModalLayout>
    );
};

export default UpdateDocument;