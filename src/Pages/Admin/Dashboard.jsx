import React, { useCallback, useEffect, useState } from 'react';
import AdminLayout from '../../Components/Admin/AdminLayout';
import { GoArrowUpRight } from 'react-icons/go';
import Chart from '../../Components/Admin/Chart';
import { Apis, AuthGeturl } from '../../Components/General/Api';
import { Table } from '../../Components/Admin/Table/Table';
import { TableRow } from '../../Components/Admin/Table/TableRow';
import { TableData } from '../../Components/Admin/Table/TableData';

const TABLE_HEADERS = [
    'id', 'Name', 'Email', 'Username', 'Balance'
];

const Dashboard = () => {
    const [items, setItems] = useState(null);
    const [error, setError] = useState(null);

    const getDashboard = useCallback(async () => {
        try {
            const res = await AuthGeturl(Apis.admins.get_admin_dashboard);
            if (res.status === true) {
                setItems(res.data);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (err) {
            setError(err.message);
        }
    }, []);

    useEffect(() => {
        getDashboard();
    }, [getDashboard]);

    return (
        <AdminLayout>
            <div className="w-[90%] mb-10 mx-auto">
                {items ? (
                    <div className="grid lg:grid-cols-3 mt-8 gap-5">
                        <div>
                            <div className="h-[13rem] text-white rounded-xl w-full bg-gradient-to-r px-6 py-14 from-[#FF3D3D] to-[#FFBC0A]">
                                <p className="text-base">Total Bookings</p>
                                <div className="flex mt-5 items-center justify-between">
                                    <p className="text-5xl font-medium ">{items?.total_gigs}</p>
                                    <div className="bg-white p-3 rounded-full text-xl text-orange-500">
                                        <GoArrowUpRight />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="h-[13rem] text-white rounded-xl w-full bg-gradient-to-r px-6 py-14 from-[#4797BD] to-[#63C2AB]">
                                <p className="text-base">Pending Bookings</p>
                                <div className="flex mt-5 items-center justify-between">
                                    <p className="text-5xl font-medium ">{items?.pending_bookings}</p>
                                    <div className="bg-white p-3 rounded-full text-xl text-orange-500">
                                        <GoArrowUpRight />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="h-[13rem] text-white rounded-xl w-full bg-gradient-to-r px-6 py-14 from-[#3626E3] to-[#72FF13]">
                                <p className="text-base">Ongoing Services</p>
                                <div className="flex mt-5 items-center justify-between">
                                    <p className="text-5xl font-medium ">{items?.ongoing_bookings}</p>
                                    <div className="bg-white p-3 rounded-full text-xl text-orange-500">
                                        <GoArrowUpRight />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="h-[13rem] text-white rounded-xl w-full bg-gradient-to-r px-6 py-14 from-[#FF3D3D] to-[#FFBC0A]">
                                <p className="text-base">Total Services</p>
                                <div className="flex mt-5 items-center justify-between">
                                    <p className="text-5xl font-medium ">{items?.total_services}</p>
                                    <div className="bg-white p-3 rounded-full text-xl text-orange-500">
                                        <GoArrowUpRight />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="h-[13rem] text-white rounded-xl w-full bg-gradient-to-r px-6 py-14 from-[#4797BD] to-[#63C2AB]">
                                <p className="text-base">Unassigned Gigs</p>
                                <div className="flex mt-5 items-center justify-between">
                                    <p className="text-5xl font-medium ">{items?.unassigned_gigs}</p>
                                    <div className="bg-white p-3 rounded-full text-xl text-orange-500">
                                        <GoArrowUpRight />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="h-[13rem] text-white rounded-xl w-full bg-gradient-to-r px-6 py-14 from-[#3626E3] to-[#72FF13]">
                                <p className="text-base">Completed Bookings</p>
                                <div className="flex mt-5 items-center justify-between">
                                    <p className="text-5xl font-medium ">{items?.completed_bookings}</p>
                                    <div className="bg-white p-3 rounded-full text-xl text-orange-500">
                                        <GoArrowUpRight />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p></p>
                )}

                <div className="lg:flex mt-6 items-stretch">
                    <div className="bg-white lg:w-[25rem] p-5 shadow-2xl rounded-xl flex-shrink-0 h-full">
                        <p className="font-medium text-xl">Revenue</p>
                        <Chart />
                    </div>
                    <div className="flex-grow lg:ml-6 mt-4 lg:mt-0 flex flex-col justify-between">
                        <div className="mb-5">
                            <div>
                                <div className="h-[7rem] text-white rounded-xl bg-gradient-to-r px-6 py-2 from-[#3626E3] to-[#72FF13]">
                                    <p className="md:text-base text-xs">Active Users</p>
                                    <div className="flex mt-5 items-center justify-between">
                                        <p className="text-5xl font-medium ">{items?.active_users}</p>
                                        <div className="bg-white p-3 rounded-full text-xl text-orange-500">
                                            <GoArrowUpRight />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-5">
                            <div>
                                <div className="h-[7rem] text-white rounded-xl bg-gradient-to-r px-6 py-2 from-[#FF3D3D] to-[#FFBC0A]">
                                    <p className="md:text-base text-xs">Verified Providers</p>
                                    <div className="flex mt-5 items-center justify-between">
                                        <p className="text-5xl font-medium ">{items?.verified_providers}</p>
                                        <div className="bg-white p-3 rounded-full text-xl text-orange-500">
                                            <GoArrowUpRight />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-5">
                            <div>
                                <div className="h-[7rem] text-white rounded-xl bg-gradient-to-r px-6 py-2 from-[#4797BD] to-[#63C2AB]">
                                    <p className="md:text-base text-xs">Unverified Providers</p>
                                    <div className="flex mt-5 items-center justify-between">
                                        <p className="text-5xl font-medium ">{items?.unverified_providers}</p>
                                        <div className="bg-white p-3 rounded-full text-xl text-orange-500">
                                            <GoArrowUpRight />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="">
                    <p className="text-xl mt-10 font-semibold mb-5">Recent Users</p>

                    <div className="flex items-start mb-10 justify-start w-full">
                        <Table headers={TABLE_HEADERS} className=" bg-white">
                            {(items?.recent_users ?? []).map((member, index) => (
                                <TableRow key={index} className="mb-10">
                                    <TableData>{member.id}</TableData>

                                    <TableData className="flex gap-2 items-center">
                                        <p className="mb-2.5">{member.fname} {member.lname}</p>
                                    </TableData>
                                    <TableData>{member.email}</TableData>
                                    <TableData>{member.username}</TableData>
                                    <TableData>${member.walletbal}</TableData>
                                </TableRow>
                            ))}
                        </Table>
                    </div>
                </div>

                <div className="">
                    <p className="text-xl font-semibold mb-5">Recent Bookings</p>
                    <div className="flex items-start mb-10 justify-start w-full">
                        <Table headers={['Track ID', 'Amount Paid', "Service", 'Provider', 'Status']} className="mt- bg-white">
                            {(items?.recent_bookings ?? []).map((booking, index) => (
                                <TableRow key={index} className="mb-10">
                                    <TableData>{booking.trackid}</TableData>
                                    <TableData>${booking.amt_paid}</TableData>
                                    <TableData>{booking.service_name}</TableData>
                                    <TableData>{booking.pfname}</TableData>
                                    <TableData>{booking.status_text}</TableData>
                                </TableRow>
                            ))}
                        </Table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
