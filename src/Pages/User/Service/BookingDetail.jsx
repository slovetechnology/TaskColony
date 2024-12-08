import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../../../Components/User/Layout';
import { FaRegStar, FaStar } from 'react-icons/fa';
import img5 from '../../../assets/profile.png';
import { useParams } from 'react-router-dom';
import { Apis, AuthGeturl, AuthPosturl } from '../../../Components/General/Api';
import { ToastAlert } from '../../../Components/General/Utils';

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
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const onSubmit = async () => {
        if (rating === 0) {
            ToastAlert('Please select a star rating before submitting.');
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
                setRating(0);
                setReviewText(''); 
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

    return (
        <Layout>
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
                            <div className="gap-10 mt-10 md:w-[80%] mb-40 mx-auto xl:flex">
                                <div className="px-5">
                                    <img src={item.imageslink?.[0]} alt="" className="w-full h-[15rem] rounded-3xl object-cover md:h-[23rem]" />
                                    <div>
                                        <div className="flex justify-between mt-10 mb-3 font-[500]">
                                            <p className="md:text-3xl">{item.service_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-primary text-xs">
                                                <span className="font-[500] text-sm text-black">Location</span>: {item.address}
                                            </p>
                                            <div className="md:flex gap-10 mt-2">
                                                <p className="text-primary text-xs mb-4 md:mb-0">
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
                                    </div>

                                    <div className="gap-10 mt-10 md:w-full mb-40 mx-auto xl:flex">
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
                                    </div>
                                </div>
                            </div>

                            {booking.length > 0 && (
                                <div className="bg-gray h-[15rem] p-2 mx-4 mt-5 md:w-[40%] rounded-xl">
                                    <div>
                                        <p className="font-[500] text-2xl">Payment Summary</p>
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
                                                    <div className="text-secondary font-medium pt-5">$255.12</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
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