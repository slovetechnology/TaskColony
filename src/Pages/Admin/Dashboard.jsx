
import React, { useCallback, useEffect, useState } from 'react';
import AdminLayout from '../../Components/Admin/AdminLayout';
import { GoArrowUpRight } from 'react-icons/go';
import { Apis, AuthGeturl } from '../../Components/General/Api';
import { Table } from '../../Components/Admin/Table/Table';
import { TableRow } from '../../Components/Admin/Table/TableRow';
import { TableData } from '../../Components/Admin/Table/TableData';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const TABLE_HEADERS = ['id', 'Name', 'Email', 'Trackid', 'Username', 'Balance'];

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const Dashboard = () => {
    const [items, setItems] = useState(null);
    const [filteredItems, setFilteredItems] = useState([]); // ✅ Added state for filteredItems
    const [error, setError] = useState(null);
    const [lastMonthSum, setLastMonthSum] = useState(0);
    const [allProfit, setAllProfit] = useState(0);
    const [presentMonth, setPresentMonth] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchEarnings = useCallback(async () => {
        try {
            const res = await AuthGeturl(Apis.admins.get_admin_earning);
            if (res.status === true) {
                setItems(res.data.data);
                setFilteredItems(res.data.data); // ✅ Set filteredItems after fetching earnings
                setLastMonthSum(res.data.lastmonth_sum);
                setPresentMonth(res.data.currentmonth_sum);
                setAllProfit(res.data.all_time_sum);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (err) {
            console.error('Fetch Error:', err.message);
            setError(err.message);
        }
    }, []);

    useEffect(() => {
        fetchEarnings();
    }, [fetchEarnings]);

    const getDashboard = useCallback(async () => {
        try {
            const res = await AuthGeturl(Apis.admins.get_admin_dashboard);
            if (res.status === true) {
                setItems(res.data);
            } else {
                throw new Error('Failed to fetch dashboard data');
            }
        } catch (err) {
            console.error('Dashboard Fetch Error:', err.message);
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
                        {[
                            { title: 'Total Bookings', value: items?.total_gigs, from: '#FF3D3D', to: '#FFBC0A' },
                            { title: 'Pending Bookings', value: items?.pending_bookings, from: '#4797BD', to: '#63C2AB' },
                            { title: 'Ongoing Services', value: items?.ongoing_bookings, from: '#3626E3', to: '#72FF13' },
                            { title: 'Total Services', value: items?.total_services, from: '#FF3D3D', to: '#FFBC0A' },
                            { title: 'Unassigned Gigs', value: items?.unassigned_gigs, from: '#4797BD', to: '#63C2AB' },
                            { title: 'Completed Bookings', value: items?.completed_bookings, from: '#3626E3', to: '#72FF13' },
                        ].map((card, i) => (
                            <div key={i} className={`h-[13rem] text-white rounded-xl w-full bg-gradient-to-r px-6 py-14 from-[${card.from}] to-[${card.to}]`}>
                                <p className="text-base">{card.title}</p>
                                <div className="flex mt-5 items-center justify-between">
                                    <p className="text-5xl font-medium">{card.value}</p>
                                    <div className="bg-white p-3 rounded-full text-xl text-orange-500">
                                        <GoArrowUpRight />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>  </>
                )}           

                {/* Earnings Overview Chart */}
                <div className="bg-white p-6 rounded-lg mt-10 shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Earnings Overview</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={filteredItems} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tickFormatter={formatDate} />
                            <YAxis />
                            <Tooltip labelFormatter={(value) => `Date: ${formatDate(value)}`} />
                            <Legend />
                            <Line type="monotone" dataKey="total_profit" stroke="#4797BD" name="Profit" strokeWidth={2} />
                            <Line type="monotone" dataKey="total_services" stroke="#FF3D3D" name="Services" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Users Table */}
                <div className="mt-10">
                    <p className="text-xl font-semibold mb-5">Recent Users</p>
                    <div className="flex items-start justify-start w-full">
                        <Table headers={TABLE_HEADERS} className="bg-white">
                            {(items?.recent_users ?? []).map((member, index) => (
                                <TableRow key={index}>
                                    <TableData>{member.id}</TableData>
                                    <TableData>{member.fname} {member.lname}</TableData>
                                    <TableData>{member.email}</TableData>
                                    <TableData>{member.trackid}</TableData>
                                    <TableData>{member.username}</TableData>
                                    <TableData>${member.walletbal}</TableData>
                                </TableRow>
                            ))}
                        </Table>
                    </div>
                </div>

                {/* Recent Bookings Table */}
                <div className="mt-10">
                    <p className="text-xl font-semibold mb-5">Recent Bookings</p>
                    <div className="flex items-start justify-start w-full">
                        <Table headers={["Track ID", "Amount Paid", "Service", "Provider", "Status"]} className="bg-white">
                            {(items?.recent_bookings ?? []).map((booking, index) => (
                                <TableRow key={index}>
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
