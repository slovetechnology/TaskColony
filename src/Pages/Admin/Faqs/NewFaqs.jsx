import React, { useState } from 'react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import { useForm } from 'react-hook-form';
import { Apis, AuthPosturl } from '../../../Components/General/Api';
import { ErrorAlert, ToastAlert } from '../../../Components/General/Utils';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const NewFaqs = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [details, setDetails] = useState('');

    const onSubmit = async (data) => {
        console.log('Details before submission:', details);

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('details', details); // Save HTML content directly

        setIsSubmitting(true);

        try {
            const res = await AuthPosturl(Apis.admins.create_admin_faqs, formData);

            if (res.status) {
                ToastAlert(res.text);
            } else {
                ErrorAlert(res.text);
            }
        } catch (error) {
            ErrorAlert('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdminLayout>
            <div className="bg-[#5a5a5a] h-[40.8rem] w-full py-5">
                <div className="my-3 mx-9">
                    <Link to='/auth/admin/faqs' className="bg-white py-2 px-5 font-semibold text-lg rounded-lg w-fit">Back</Link>
                </div>
                <div className="bg-white w-[95%] mx-auto text-primary h-[35rem] px-10 pt-10 overflow-hidden">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <div className="col-span-2">
                                <label className="text-xs">Title</label>
                                <input
                                    {...register('title', { required: 'Title is required' })}
                                    className="admininput"
                                    type="text"
                                    placeholder="Enter FAQs Title"
                                />
                                {errors.title && <span className="text-red-500">{errors.title.message}</span>}
                            </div>
                        </div>

                        <div className="bg-white border p-4 shadow-xl rounded-lg my-10">
                            <div className="mb-3">
                                <div className="capitalize font-medium mb-5">Enter Content</div>
                                <ReactQuill
                                    value={details}
                                    onChange={setDetails} // Handle content change
                                    theme="snow"
                                />
                                {errors.details && <span className="text-red-500">{errors.details.message}</span>}
                            </div>
                        </div>

                        <div className="flex items-start justify-start mt-8">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-pink px-10 py-2 text-white rounded-md"
                            >
                                {isSubmitting ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default NewFaqs;