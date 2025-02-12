import React, { useEffect, useState } from 'react';
import ModalLayout from '../../../Components/Admin/ModalLayout';
import { Apis, AuthPosturl } from '../../../Components/General/Api';
import { useForm } from 'react-hook-form';
import { ToastAlert } from '../../../Components/General/Utils';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the Quill stylesheet

const UpdateFaqs = ({ singles, closeView, resendSignal }) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [content, setContent] = useState('');

    useEffect(() => {
        if (singles) {
            setValue('title', singles.title || ''); // Prepopulate title
            setContent(singles.details || ''); // Assuming 'details' contains the initial content to edit
        }
    }, [singles, setValue]);

    const onSubmit = async (data, event) => {
        event.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('id', singles.id);
        formData.append('details', getPlainText(content)); // Save as plain text

        try {
            const res = await AuthPosturl(Apis.admins.update_admin_faqs, formData);

            if (res.status === true) {
                ToastAlert(res.text);
                resendSignal();
                closeView();
            } else {
                ToastAlert(res.text);
            }
        } catch (error) {
            ToastAlert('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Function to extract plain text from HTML
    const getPlainText = (html) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.innerText || tempDiv.textContent || '';
    };

    return (
        <ModalLayout closeView={closeView}>
            <div className="bg-white w-[95%] mx-auto text-primary h-auto px-scroll pt-10 overflow-auto">
                <div className="text-slate-600 text-xl rounded-lg shadow-xl mb-5 bg-blue-50 p-3">Update Faq</div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <div className="col-span-2">
                            <label className="text-xs">Title</label>
                            <input
                                name="title"
                                className="admininput"
                                type="text"
                                placeholder="Enter Faq Title"
                                {...register('title', { required: 'Title is required' })}
                            />
                            {errors.title && <span className="text-red-500">{errors.title.message}</span>}
                        </div>
                    </div>

                    <div className="border bg-white p-4 shadow-xl rounded-lg my-10">
                        <div className="mb-3">
                            <div className="capitalize font-medium mb-5">Enter Content</div>
                            <ReactQuill
                                value={content}
                                onChange={setContent} // Handle content change
                                theme="snow"
                            />
                            {errors.content && <span className="text-red-500">{errors.content.message}</span>}
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
        </ModalLayout>
    );
};

export default UpdateFaqs;
