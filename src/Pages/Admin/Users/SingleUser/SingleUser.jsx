import React, { useCallback, useEffect, useState } from 'react';
import AdminLayout from '../../../../Components/Admin/AdminLayout';
import { GoArrowUpRight } from 'react-icons/go';
import { Link, useParams } from 'react-router-dom';
import { Apis, AuthGeturl } from '../../../../Components/General/Api';

const SingleUser = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        try {
            const res = await AuthGeturl(`${Apis.admins.get_provider}/${userId}`);
            if (res.status === true) {
                setUser(res.data.data[0]); // Update the user state
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

    return (
        <AdminLayout>
            <div className="m-10">
                {loading ? (
                    <div className="text-center flex items-center justify-center w-full h-screen text-lg font-semibold">Loading user data...</div>
                ) : (
                    user && (
                        <>
                            <div className="grid grid-cols-4 mt-8 gap-5">
                                <div>
                                    <div className="h-[13rem] text-white rounded-xl bg-gradient-to-r px-6 py-14 from-[#4797BD] to-[#63C2AB]">
                                        <p className="text-base">Total Earned</p>
                                        <div className="flex mt-5 items-center justify-between">
                                            <p className="text-5xl font-medium">{user.total_earned}</p>
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
                                            <p className="text-5xl font-medium">{user.totalbookings}</p>
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
                                            <p className="text-5xl font-medium">{user.total_reveiw}</p>
                                            <div className="bg-white p-3 rounded-full text-xl text-orange-500">
                                                <GoArrowUpRight />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-[13rem] text-white rounded-xl bg-gradient-to-r px-6 py-14 from-[#FFBC0A] to-[#FF3D3D]">
                                    <p className="text-base">Wallet Balance</p>
                                    <div className="flex mt-5 items-center justify-between">
                                        <p className="text-5xl font-medium">{user.walletbal}</p>
                                        <div className="bg-white p-3 rounded-full text-xl text-orange-500">
                                            <GoArrowUpRight />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10">
                                <div className="bg-white px-6 py-6">
                                    <div className="flex items-center gap-10 text-primary font-medium border-b mb-5 pb-3">
                                        <Link to='' className=''>About</Link>
                                        <Link to='' className=''>My Gigs</Link>
                                        <Link to='' className=''>Bookings</Link>
                                        <Link to='' className=''>Reviews</Link>
                                        <Link to='' className=''>Document</Link>
                                        <Link to='' className=''>Payout</Link>
                                    </div>
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