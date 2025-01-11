import React, { useCallback, useEffect, useState } from 'react';
import AdminLayout from '../../../../Components/Admin/AdminLayout';
import { GoArrowUpRight } from 'react-icons/go';
import { useParams } from 'react-router-dom';
import { Apis, AuthGeturl } from '../../../../Components/General/Api';
import MyGigs from './Mygigs';
import Bookings from './Bookings';
import Reviews from './Reviews';
import Payouts from './Payout';
import ProviderDocuments from './Document';
import ProviderReviews from './ProviderReview';

const SingleProvider = () => {
    const { userid } = useParams();
    const [user, setUser] = useState(null); // Change to null for single user
    const [trackid, setTrackid] = useState(null); // Change to null for single user
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('about');

    const fetchUser = useCallback(async () => {
        try {
            const res = await AuthGeturl(`${Apis.admins.get_provider_detail}?userid=${userid}`); 
            if (res.status === true) {
                setUser(res.data); 
                setTrackid(res.data.trackid); 
            }
        } catch (err) {
            console.error('Failed to fetch user data:', err.message);
        } finally {
            setLoading(false);
        }
    }, [userid]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const renderTabContent = () => {
        if (activeTab === 'about' && user) {
            return (
                <div>
                    <div className="text-secondary font-semibold text-xl">About User</div>
                    <div className='mt-3'>
                        <div className="text-secondary font-semibold text-lg">Personal Information</div>
                        <div className='mb-3 mt-3'><span className="font-bold">Name:</span> {user.firstname} {user.lastname}</div>
                        <div className='mb-3'><span className="font-bold">Username:</span> {user.username}</div>
                        <div className='mb-3'><span className="font-bold">Email:</span> {user.email}</div>
                        <div className='mb-3'><span className="font-bold">Phone Number:</span> {user.phone}</div>
                        <div className='mb-3'><span className="font-bold">Phone Number:</span> {trackid}</div>
                    </div>
                    <div className='mt-6'>
                        <div className="text-secondary font-semibold text-lg">Bank Information</div>
                        <div className='mb-3 mt-3'><span className="font-bold">Holder Name:</span> {user.bank_holder_name}</div>
                        <div className='mb-3'><span className="font-bold">Bank Name:</span> {user.bank_name}</div>
                        <div className='mb-3'><span className="font-bold">Routing Number:</span> {user.bank_route_no}</div>
                        <div className='mb-3'><span className="font-bold">Branch Address:</span> {user.bank_address}</div>
                        <div className='mb-3'><span className="font-bold">Account Number:</span> {user.bank_acc_no}</div>
                    </div>
                </div>
            );
        }
        if (activeTab === 'my-gigs') return <MyGigs trackid={trackid}  />;
        if (activeTab === 'bookings') return <Bookings trackid={trackid}  />;
        if (activeTab === 'reviews') return <Reviews trackid={trackid}  />;
        if (activeTab === 'document') return <ProviderDocuments trackid={trackid}  />;
        if (activeTab === 'payout') return <Payouts trackid={trackid}  />;
        if (activeTab === 'providerreview') return <ProviderReviews trackid={trackid}  />;
    };

    return (
        <AdminLayout>
            <div className="m-10">
                {loading ? (
                    <div className="text-center flex items-center justify-center w-full h-screen text-lg font-semibold">Loading user data...</div>
                ) : (
                    user && (
                        <>
                            <div className="grid lg:grid-cols-2 mt-8 gap-5">
                                <div>
                                    <div className="h-[13rem] text-white rounded-xl bg-gradient-to-r px-6 py-14 from-[#4797BD] to-[#63C2AB]">
                                        <p className="text-base">Total Earned</p>
                                        <div className="flex mt-5 items-center justify-between">
                                            <p className="md:text-5xl text-2xl font-medium">{user.total_earned}</p>
                                            <div className="bg-white p-3 rounded-full text-xl text-orange-500">
                                                <GoArrowUpRight />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="h-[13rem] text-white rounded-xl bg-gradient-to-r px-6 py-14 from-[#3626E3] to-[#72FF13]">
                                        <p className="text-base">Total Bookings</p>
                                        <div className="flex mt-5 items-center justify-between">
                                            <p className="md:text-5xl text-2xl font-medium">{user.total_bookings}</p>
                                            <div className="bg-white p-3 rounded-full text-xl text-orange-500">
                                                <GoArrowUpRight />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="h-[13rem] text-white rounded-xl bg-gradient-to-r px-6 py-14 from-[#FF3D3D] to-[#FFBC0A]">
                                        <p className="text-base">Total Reviews</p>
                                        <div className="flex mt-5 items-center justify-between">
                                            <p className="md:text-5xl text-2xl font-medium">{user.total_review}</p>
                                            <div className="bg-white p-3 rounded-full text-xl text-orange-500">
                                                <GoArrowUpRight />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-[13rem] text-white rounded-xl bg-gradient-to-r px-6 py-14 from-[#FFBC0A] to-[#FF3D3D]">
                                    <p className="text-base">Wallet Balance</p>
                                    <div className="flex mt-5 items-center justify-between">
                                        <p className="md:text-5xl text-2xl font-medium">${user.user_wallets[0].walletbal}</p>
                                        <div className="bg-white p-3 rounded-full text-xl text-orange-500">
                                            <GoArrowUpRight />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10">
                                <div className="bg-white px-6 py-6">
                                    <div className="flex flex-wrap items-center gap-3 text-primary font-medium border-b mb-5 pb-3">
                                        {['about', 'my-gigs', 'bookings', 'reviews', 'providerReview', 'document', 'payout'].map(tab => (
                                            <button key={tab} onClick={() => setActiveTab(tab)} className={activeTab === tab ? 'text-secondary border-b px-10 border-secondary font-bold' : ''}>
                                                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                    <div>{renderTabContent()}</div>
                                </div>
                            </div>
                        </>
                    )
                )}
            </div>
        </AdminLayout>
    );
};

export default SingleProvider;