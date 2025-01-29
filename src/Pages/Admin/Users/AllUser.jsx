import React, { useCallback, useEffect, useState } from 'react';
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
import { debounce } from 'lodash'; // Make sure to install lodash
import { useSelector } from 'react-redux';

const TABLE_HEADERS = ['Full Name', 'Email', 'Contact', 'Booking', "Balance", "Verification", "", ""];
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
    const [loading, setLoading] = useState(false); // Loading state
    const { admin } = useSelector(state => state.data);
    const userLevel = admin.userlevel;
    const fetchUsers = useCallback(async () => {
        setLoading(true); // Start loading
        let allUsers = [];
        let pageNo = 1;
        let totalPages = 10;

        try {
            while (pageNo <= totalPages) {
                const res = await AuthGeturl(`${Apis.admins.get_provider}?page_no=${pageNo}&no_perpage=${DEFAULT_PER_PAGE}`);
                if (res.status === true) {
                    const fetchedItems = res.data.data;
                    allUsers = [...allUsers, ...fetchedItems];
                    totalPages = res.data.totalpage;
                    pageNo++;
                } else {
                    throw new Error('Failed to fetch users.');
                }
            }
            setItems(allUsers);
            setFilteredItems(allUsers);
            setTotal(allUsers.length);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false); // End loading
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
        setCurrentPage(0); // Reset to the first page when searching
    }, [searchTerm, items]);

    const DeleteItem = (member) => {
        setDel(true);
        setSingles(member);
    };

    const confirmAction = async () => {
        if (!singles.trackid) {
            console.error('No track ID found to delete.');
            return;
        }

        const data = { data_tid: singles.trackid };
        setLoads(true);
        try {
            const res = await AuthPosturl(Apis.admins.delete_providers, data);
            if (res.status) {
                setDel(false);
                setItems(prevItems => prevItems.filter(item => item.trackid !== singles.trackid));
                setFilteredItems(prevItems => prevItems.filter(item => item.trackid !== singles.trackid));
                setTotal(prevTotal => prevTotal - 1);
            } else {
                console.error('Error deleting User:', res.data.text);
            }
        } catch (error) {
            console.error('Network request failed:', error);
        } finally {
            setLoads(false);
        }
    };

    const SingleItem = val => {
        setSingles(val);
        setView(!view);
    };

    const totalItems = filteredItems.length;
    const pageCount = Math.ceil(totalItems / DEFAULT_PER_PAGE);

    const paginatedItems = filteredItems.slice(
        currentPage * DEFAULT_PER_PAGE,
        (currentPage + 1) * DEFAULT_PER_PAGE
    );

    const handlePageChange = (val) => {
        setCurrentPage(val.selected);
    };

    const handleSearch = debounce((e) => {
        setSearchTerm(e.target.value);
    }, 300);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <AdminLayout>
            {del && <ConfirmDeleteUser confirmAction={confirmAction} closeView={() => setDel(false)} isLoading={loads} />}
            {view && <UpdateUser singles={singles} resendSignal={fetchUsers} closeView={() => setView(!view)} />}

            <div className="md:mx-10 mx-2 mb-20">
                <div className="bg-white mt-10 px-5 py-4 w-full">
                    <div className="flex items-center justify-between">
                        <div className="font-medium text-lg">All Users</div>
                        <div className="md:flex hidden items-center gap-5">
                            <label className="border gap-[10px] text-[#9C9C9C] flex items-center py-2.5 px-3 border-primary rounded-md">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="w-[16rem] bg-transparent placeholder:text-[16px] placeholder:text-primary outline-none"
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
                                <TableData>${member.walletbal}</TableData>
                                <TableData>{member.account_verified_text}</TableData>
                                <TableData>
                                    <div className="flex gap-4 text-primary">
                                        {userLevel !== "4" && (

                                            <>
                                                <div className="cursor-pointer" onClick={() => SingleItem(member)}><PiPencilSimpleLine /></div>
                                                <div className="cursor-pointer" onClick={() => DeleteItem(member)}><ImCancelCircle /></div>
                                                <Link to={`/auth/admin/user/single/${member.id}`} className="cursor-pointer">
                                                    <IoEyeSharp />
                                                </Link>
                                            </>
                                        )}

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