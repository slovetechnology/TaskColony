import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../../Components/General/Modal';
import { Apis, AuthPosturl } from '../../../Components/General/Api';
import { ErrorAlert, ToastAlert } from '../../../Components/General/Utils';
import { FaRegStar, FaStar } from 'react-icons/fa';

const StarRating = ({ rating, setRating }) => {
    return (
        <div className="flex text-secondary">
            {Array.from({ length: 5 }, (_, index) => (
                <span
                    key={index}
                    onClick={() => setRating(index + 1)}
                    className="cursor-pointer"
                >
                    {index < rating ? <FaStar className="text-yellow-500" /> : <FaRegStar className="text-yellow-500" />}
                </span>
            ))}
        </div>
    );
};

const EditReview = ({ closeView, reviewData, singles, onUpdateReview }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, setValue } = useForm();
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');

    useEffect(() => {
        if (reviewData) {
            setValue('review', reviewData.review);
            setValue('data_tid', singles.trackid);
            setRating(reviewData.rating);
            setReviewText(reviewData.review);
        }
    }, [reviewData, singles.trackid, setValue]);

    const onSubmit = async () => {
        setIsSubmitting(true);

        const payload = {
            data_tid: singles.trackid,
            review: reviewText,
            rating: rating,
        };

        try {
            const response = await AuthPosturl(Apis.users.update_review, payload);
            if (response.status === true) {
                ToastAlert('Review updated successfully!');
                onUpdateReview({ ...payload, id: reviewData.id }); // Pass updated review back
                closeView();
            } else {
                ToastAlert(response.text || 'Failed to update review');
            }
        } catch (error) {
            console.error('Error updating review:', error);
            ErrorAlert('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal height="h-[29rem]" closeView={closeView}>
            <div className="text-black">
                <h2 className="text-xl font-bold mb-4">Edit Review</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="bg-gray flex h-20 rounded-xl px-5 items-center gap-2">
                        <p className="text-primary">Give Rate:</p>
                        <StarRating rating={rating} setRating={setRating} />
                    </div>
                    <div className="mt-5">
                        <textarea
                            className="w-full h-44 bg-gray rounded-xl outline-none p-5"
                            placeholder="Enter your review here"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                        />
                    </div>
                    <div className="bg-secondary w-fit px-8 py-3 text-white font-medium rounded-xl mt-4">
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default EditReview;