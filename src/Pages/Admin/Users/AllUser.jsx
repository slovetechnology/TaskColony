import React, { useCallback, useState, useEffect } from 'react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import { FaSearch } from 'react-icons/fa';
import { GiCancel } from 'react-icons/gi';
import { HiOutlineAdjustments } from 'react-icons/hi';
import { Table } from '../../../Components/Admin/Table/Table';
import { TableRow } from '../../../Components/Admin/Table/TableRow';
import { TableData } from '../../../Components/Admin/Table/Index';
import PaginationButton from '../../../Components/General/Pagination/PaginationButton';
import { Apis, AuthGeturl, AuthPosturl } from '../../../Components/General/Api';
import UpdateUser from './UpdateUser';
import ConfirmDeleteUser from './DeleteUser';
import { PiPencilSimpleLine } from 'react-icons/pi';
import { ImCancelCircle } from 'react-icons/im';
import { IoEyeSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const TABLE_HEADERS = ['Full Name', 'Email', 'Contact', 'Booking', "Balance", "Verification", 'User Type', "", ""];
const DEFAULT_PER_PAGE = 10;

const AllUser = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [error, setError] = useState(null);
    const [del, setDel] = useState(false);
    const [singles, setSingles] = useState({});
    const [loads, setLoads] = useState(false);
    const [view, setView] = useState(false);
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const DeleteItem = (member) => {
        setDel(true);
        setSingles(member);
    };

    const confirmAction = async () => {
        if (!singles.trackid) {
            console.error('No tax ID found to delete.');
            return;
        }

        const data = { data_tid: singles.trackid };
        setLoads(true);
        try {
            const res = await AuthPosturl(Apis.admins.delete_providers, data);
            setLoads(false);
            if (res.status === true) {
                setDel(false);
                setItems(prevItems => prevItems.filter(item => item.trackid !== singles.trackid));
                setFilteredItems(prevItems => prevItems.filter(item => item.trackid !== singles.trackid));
                setTotal(prevTotal => prevTotal - 1);
            } else {
                console.error('Error deleting User:', res.data.text);
            }
        } catch (error) {
            console.error('Network request failed:', error);
            setLoads(false);
        }
    };

    const SingleItem = val => {
        setSingles(val);
        setView(!view);
    };

    const fetchUsers = useCallback(async () => {
        try {
            const res = await AuthGeturl(Apis.admins.get_provider);
            if (res.status === true) {
                setItems(res.data.data);
                setFilteredItems(res.data.data);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (err) {
            setError(err.message);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        const filtered = items.filter(item =>
            item.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.lname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.phoneno.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredItems(filtered);
    }, [searchTerm, items]);

    const totalItems = filteredItems.length;
    const pageCount = Math.ceil(totalItems / DEFAULT_PER_PAGE);

    const paginatedItems = filteredItems.slice(
        currentPage * DEFAULT_PER_PAGE,
        (currentPage + 1) * DEFAULT_PER_PAGE
    );

    const handlePageChange = (val) => {
        setCurrentPage(val.selected);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <AdminLayout>
            {del && <ConfirmDeleteUser confirmAction={confirmAction} closeView={() => setDel(false)} isLoading={loads} />}
            {view && <UpdateUser singles={singles} resendSignal={fetchUsers} closeView={() => setView(!view)} />}

            <div className="mx-10 mb-20">
                <div className="bg-white mt-10 px-5 py-4 w-full">
                    <div className="flex items-center justify-between">
                        <div className="font-medium text-lg">All Users</div>
                        <div className="flex items-center gap-5">
                            <label className='border gap-[10px] text-[#9C9C9C] flex items-center py-2.5 px-3 border-[#F5F5F5] rounded-md'>
                                <input
                                    type="text"
                                    placeholder='Search'
                                    className='w-[16rem] placeholder:text-[16px] placeholder:text-primary outline-none'
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                                <FaSearch size={16} />
                            </label>
                            <span className="text-primary text-2xl"><HiOutlineAdjustments /></span>
                            <span className="text-primary text-2xl"><GiCancel /></span>
                        </div>
                    </div>
                </div>

                <div className="flex overflow-auto scrollsdown items-start mb-10 justify-start w-full">
                    <Table headers={TABLE_HEADERS} className="mt-10 bg-white">
                        {paginatedItems.map((member, index) => (
                            <TableRow className="mb-10" key={index}>
                                <TableData>
                                    {member.fname} {member.lname}
                                </TableData>
                                <TableData>{member.email}</TableData>
                                <TableData>{member.phoneno}</TableData>
                                <TableData>{member.bookings}</TableData>
                                <TableData>{member.walletbal}</TableData>
                                <TableData>{member.account_verified_text}</TableData>
                                <TableData>{member.usertype}</TableData>
                                <TableData>
                                    <div className="flex gap-4 text-primary">
                                        <div className="cursor-pointer" onClick={() => SingleItem(member)}><PiPencilSimpleLine /></div>
                                        <div className="cursor-pointer" onClick={() => DeleteItem(member)}><ImCancelCircle /></div>
                                        <Link
                                            to={`/auth/admin/user/single/${member.id}`}
                                            className="cursor-pointer"
                                        >
                                            <IoEyeSharp />
                                        </Link>
                                    </div>
                                </TableData>
                            </TableRow>
                        ))}

                        <div className="w-full flex justify-end items-end mx-10 mt-4">
                            <PaginationButton
                                pageCount={pageCount}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </Table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AllUser;