import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../../../Components/User/Layout';
import { FaRegStar, FaStar, FaUserCircle } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { Apis, AuthGeturl, AuthPosturl } from '../../../Components/General/Api';
import { ToastAlert } from '../../../Components/General/Utils';
import EditReview from './EditReview';

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

const BookingDetail = () => {
    const [loading, setLoading] = useState(false);
    const { bookingid } = useParams();
    const [booking, setBooking] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editReview, setEditReview] = useState(false);
    const [singles, setSingles] = useState({});
    const [view, setView] = useState(false);

    const fetchBooking = useCallback(async () => {
        setLoading(true);
        try {
            const res = await AuthGeturl(`${Apis.users.get_booking}/${bookingid}`);
            if (res?.status === true && Array.isArray(res.data?.data)) {
                const filteredService = res.data.data.find(item => String(item.id) === String(bookingid));
                setBooking(filteredService ? [filteredService] : []);
            } else {
                setBooking([]);
            }
        } catch (err) {
            console.error('Error fetching service details:', err);
            setBooking([]);
        } finally {
            setLoading(false);
        }
    }, [bookingid]);

    useEffect(() => {
        fetchBooking();
    }, [fetchBooking]);

    const fetchAllReviews = useCallback(async () => {
        setLoading(true);
        try {
            const res = await AuthGeturl(Apis.users.get_review);
            if (res.status === true) {
                setReviews(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching reviews:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllReviews();
    }, [fetchAllReviews]);

    const onSubmit = async () => {
        if (rating === 0) {
            ToastAlert('Please select a star rating before submitting.');
            return;
        }
        const wordCount = reviewText.trim().split(/\s+/).length;
        if (wordCount <= 20) {
            ToastAlert('Your review must contain more than 20 words.');
            return;
        }

        const datatosend = {
            service_tid: booking[0]?.service_tid || "",
            provider_tid: booking[0]?.ptid || "",
            review: reviewText,
            rating: rating,
        };

        setIsSubmitting(true);

        try {
            const res = await AuthPosturl(Apis.users.new_review, datatosend);
            if (res.status === true) {
                ToastAlert('Review submitted successfully!');
                setReviews(prev => [...prev, { ...datatosend, id: res.data.id }]); // Add new review to state
                setRating(0); // Reset rating
                setReviewText(''); // Reset review text
            } else {
                ToastAlert(res.text || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Submission error:', error);
            ToastAlert('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseEdit = () => {
        setEditReview(false);
    };

    const SingleItem = (review) => {
        setSingles(review);
        setEditReview(true);
    };

    const handleUpdateReview = (updatedReview) => {
        setReviews(prev => 
            prev.map(review => review.id === updatedReview.id ? updatedReview : review)
        );
        setEditReview(false);
    };

    return (
        <Layout>
            {editReview && (
                <EditReview 
                    singles={singles} 
                    closeView={handleCloseEdit} 
                    reviewData={singles} 
                    onUpdateReview={handleUpdateReview} 
                />
            )}

            <div>
                {loading ? (
                    <p className='flex items-center justify-center h-[10rem] w-full'>Loading...</p>
                ) : booking.length > 0 ? (
                    booking.map((item, i) => (
                        <div key={i}>
                            <div className="bg-gray w-full xl:h-[20rem]">
                                <div className="text-center py-10 xl:pt-24">
                                    <p className="font-[500] text-4xl mb-3">{item.service_name}</p>
                                    <span className="flex items-center gap-4 font-[500] justify-center">
                                        <p className="text-primary">Home</p>
                                        <span className="bg-[#6C757D] w-3 py-0.5"></span>
                                        <p className="text-secondary">Service Detail</p>
                                    </span>
                                </div>
                            </div>
                            <div className="lg:flex mt-5 mb-10 mx-2 lg:mx-10">
                                <div className="lg:w-[90%]">
                                    <div className="px-5">
                                        <img src={item.imageslink?.[0]} alt="" className="w-full h-[15rem] rounded-3xl object-cover lg:h-[23rem]" />
                                        <div>
                                            <div className="flex justify-between mt-10 mb-3 font-[500]">
                                                <p className="lg:text-3xl">{item.service_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-primary text-xs">
                                                    <span className="font-[500] text-sm text-black">Location</span>: {item.address}
                                                </p>
                                                <div className="lg:flex gap-10 mt-2">
                                                    <p className="text-primary text-xs mb-4 lg:mb-0">
                                                        <span className="font-[500] text-sm text-black">Provider</span>: {item.pfname} {item.plname}
                                                    </p>
                                                    <p className="text-primary text-xs">
                                                        <span className="font-[500] text-sm text-black">Duration</span>: {item.timetaken}
                                                    </p>
                                                </div>
                                                <div className="mt-6 mb-8">
                                                    <span className="font-[500] pb-1 w-full text-sm text-black">Description</span>
                                                    <p className="text-primary text-xs">{item.description}</p>
                                                </div>
                                            </div>
                                            <div className="">
                                                <div className="px-5">
                                                    <p className="font-[500] py-5 text-2xl">Add Review</p>
                                                    <div>
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
                                                            <button onClick={onSubmit} disabled={isSubmitting}>
                                                                {isSubmitting ? 'Submitting...' : 'Submit'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-10">
                                                    <p className="font-[500] py-5 border-b text-2xl">Reviews</p>
                                                    <div className="">
                                                        {reviews.map((item, i) => (
                                                            <div className="" key={i}>
                                                                <div className="my-5">
                                                                    <div key={item.id} className="border-b py-4">
                                                                        <div className="flex gap-4 ">
                                                                            <div className="">
                                                                                <FaUserCircle className='text-5xl' />
                                                                            </div>
                                                                            <div>
                                                                                <div className="flex items-start w-full justify-between">
                                                                                    <div className="">
                                                                                        <div className="flex gap-4">
                                                                                            <p className="font-[500]">
                                                                                                {item.ufname} {item.ulname}
                                                                                            </p>
                                                                                            <p className="text-primary text-xs">{item.created_at}</p>
                                                                                        </div>
                                                                                        <div className="flex">
                                                                                            <div className="flex items-center text-star gap-2">
                                                                                                {[...Array(5)].map((_, starIndex) => (
                                                                                                    <FaStar
                                                                                                        key={starIndex}
                                                                                                        color={starIndex < item.rating ? '#FFD700' : '#ddd'}
                                                                                                    />
                                                                                                ))}
                                                                                            </div>
                                                                                            <div className=""> {item.rating} </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div onClick={() => SingleItem(item)} className="text-secondary cursor-pointer text-sm">Edit</div>
                                                                                </div>
                                                                                
                                                                            </div>
                                                                            <div className="mt-5 text-sm text-primary">
                                                                                    {item.review}
                                                                                </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {booking.length > 0 && (
                                    <div className="bg-gray h-[18rem] lg:w-[30%] p-4">
                                        <div>
                                            <p className="font-[500] text-xl">Payment Summary</p>
                                            <div className="h-[28rem] px-6">
                                                <div className="text-xs">
                                                    <div className="flex items-center justify-between gap-5 my-5">
                                                        <div className="text-sm text-primary">Payment Status</div>
                                                        <div className="font-medium">{item.status}</div>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-5 my-5">
                                                        <div className="text-sm text-primary">Payment Method</div>
                                                        <div className="font-medium">{item.paid_with}</div>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-5 my-5">
                                                        <div className="text-sm text-primary">Discount</div>
                                                        <div className="font-medium">10%</div>
                                                    </div>
                                                    <div className="flex items-center border-t justify-between gap-5 my-5">
                                                        <div>Total Amount</div>
                                                        <div className="text-secondary font-medium ">${new Intl.NumberFormat().format(item.amt_paid)}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No booking found.</p>
                )}
            </div>
        </Layout>
    );
};

export default BookingDetail;