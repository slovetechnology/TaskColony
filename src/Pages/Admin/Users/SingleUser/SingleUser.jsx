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

const SingleUser = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('about'); // Added state to manage tabs

    const fetchUser = useCallback(async () => {
        try {
            const res = await AuthGeturl(`${Apis.admins.get_provider}/${userId}`);
            if (res.status === true) {
                setUser(res.data.data[0]);
            }
        } catch (err) {
            console.error('Failed to fetch user data:', err.message);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchUser();
    }, []);

    const renderTabContent = () => {
        if (activeTab === 'about') {
            return (
                <>
                    <div className="text-secondary font-semibold text-xl">About User</div>
                    <div className='mt-3'>
                        <div className="text-secondary font-semibold text-lg">Personal Information</div>
                        <div className='mb-3 mt-3'><span className="font-bold">Name:</span> {user.fname} {user.lname}</div>
                        <div className='mb-3'><span className="font-bold">Username:</span> {user.username}</div>
                        <div className='mb-3'><span className="font-bold">Email:</span> {user.email}</div>
                        <div className='mb-3'><span className="font-bold">Phone Number:</span> {user.phoneno}</div>
                        <div className='mb-3'><span className="font-bold">Location:</span> {user.address}</div>
                    </div>
                    <div className='mt-6'>
                        <div className="text-secondary font-semibold text-lg">Bank Information</div>
                        <div className='mb-3 mt-3'><span className="font-bold">Holder Name:</span> {user.bank_holder_name}</div>
                        <div className='mb-3'><span className="font-bold">Bank Name:</span> {user.bank_name}</div>
                        <div className='mb-3'><span className="font-bold">Routing Number:</span> {user.bank_route_no}</div>
                        <div className='mb-3'><span className="font-bold">Branch Address:</span> {user.bank_address}</div>
                        <div className='mb-3'><span className="font-bold">Account Number:</span> {user.bank_acc_no}</div>
                    </div>
                </>
            );
        }
        if (activeTab === 'my-gigs') {
            return <MyGigs />
        }
        if (activeTab === 'bookings') {
            return <Bookings />
        }
        if (activeTab === 'reviews') {
            return <Reviews />
        }
        if (activeTab === 'document') {
            return <ProviderDocuments />
        }
        if (activeTab === 'payout') {
            return <Payouts />
        }
        if (activeTab === 'providerreview') {
            return <ProviderReviews />
        }
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
                                            <p className="md:text-5xl text-2xl font-medium">{user.totalbookings}</p>
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
                                            <p className="md:text-5xl text-2xl font-medium">{user.total_reveiw}</p>
                                            <div className="bg-white p-3 rounded-full text-xl text-orange-500">
                                                <GoArrowUpRight />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-[13rem] text-white rounded-xl bg-gradient-to-r px-6 py-14 from-[#FFBC0A] to-[#FF3D3D]">
                                    <p className="text-base">Wallet Balance</p>
                                    <div className="flex mt-5 items-center justify-between">
                                        <p className="md:text-5xl text-2xl font-medium">{user.walletbal}</p>
                                        <div className="bg-white p-3 rounded-full text-xl text-orange-500">
                                            <GoArrowUpRight />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10">
                                <div className="bg-white px-6 py-6">
                                    <div className="flex flex-wrap items-center gap-3 text-primary font-medium border-b mb-5 pb-3">
                                        <div className="">
                                            <button onClick={() => setActiveTab('about')} className={activeTab === 'about' ? 'text-secondary border-b px-10 border-secondary font-bold' : ''}>About</button>
                                        </div>
                                        <div className="">
                                            <button onClick={() => setActiveTab('my-gigs')} className={activeTab === 'my-gigs' ? 'text-secondary border-b  border-secondary font-bold' : ''}>My Gigs</button>
                                        </div>
                                        <div className="">
                                            <button onClick={() => setActiveTab('bookings')} className={activeTab === 'bookings' ? 'text-secondary border-b  border-secondary font-bold' : ''}>Bookings</button>
                                        </div>
                                        <div className="">
                                            <button onClick={() => setActiveTab('reviews')} className={activeTab === 'reviews' ? 'text-secondary border-b  border-secondary font-bold' : ''}>My Gigs Reviews</button>
                                        </div>
                                        <div className="">
                                            <button onClick={() => setActiveTab('providerreview')} className={activeTab === 'providerreview' ? 'text-secondary border-b  border-secondary font-bold' : ''}> Reviews</button>
                                        </div>
                                        <div className="">
                                            <button onClick={() => setActiveTab('document')} className={activeTab === 'document' ? 'text-secondary border-b  border-secondary font-bold' : ''}>Document</button>
                                        </div>
                                        <div className="">
                                            <button onClick={() => setActiveTab('payout')} className={activeTab === 'payout' ? 'text-secondary border-b  border-secondary font-bold' : ''}>Payout</button>
                                        </div>
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

export default SingleUser;
