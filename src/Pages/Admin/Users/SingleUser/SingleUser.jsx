import React, { useCallback, useEffect, useState } from 'react';
import AdminLayout from '../../../../Components/Admin/AdminLayout';
import { GoArrowUpRight } from 'react-icons/go';
import { useParams } from 'react-router-dom';
import { Apis, AuthGeturl } from '../../../../Components/General/Api';
import Bookings from './Bookings';
import Reviews from './Reviews';
import { formatDate } from '../../../../utils/utils';

const SingleUser = () => {
    const { userid } = useParams();
    const [user, setUser] = useState(null); // Change to null for single user
    const [trackid, setTrackid] = useState(null); // Change to null for single user
    const [wallet, setWallet] = useState(null); // Change to null for single user
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('about');

    const fetchUser = useCallback(async () => {
        try {
            const res = await AuthGeturl(`${Apis.admins.get_provider_detail}?userid=${userid}`);
            if (res.status === true) {
                setUser(res.data);
                setTrackid(res.data.trackid);
                setWallet(res.data.user_wallets[0].walletbal);
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
                        <div className='mb-3'><span className="font-bold">Created At:</span> {formatDate(user.created_at)}</div>
                    </div>

                </div>
            );
        }
        if (activeTab === 'bookings') return <Bookings trackid={trackid} />;
        if (activeTab === 'reviews') return <Reviews trackid={trackid} />;
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

                                <div className="h-[13rem] text-white rounded-xl bg-gradient-to-r px-6 py-14 from-[#FFBC0A] to-[#FF3D3D]">
                                    <p className="text-base">Wallet Balance</p>
                                    <div className="flex mt-5 items-center justify-between">
                                        <p className="md:text-5xl text-2xl font-medium">${wallet}</p>
                                        <div className="bg-white p-3 rounded-full text-xl text-orange-500">
                                            <GoArrowUpRight />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10">
                                <div className="bg-white px-6 py-6">
                                    <div className="flex flex-wrap items-center gap-3 text-primary font-medium border-b mb-5 pb-3">
                                        {['about', 'bookings', 'reviews',].map(tab => (
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

export default SingleUser;