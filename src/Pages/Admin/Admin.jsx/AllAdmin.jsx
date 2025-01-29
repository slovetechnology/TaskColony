import React, { useCallback, useState, useEffect } from 'react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import { HiOutlineAdjustments } from 'react-icons/hi';
import { GiCancel } from 'react-icons/gi';
import { Table } from '../../../Components/Admin/Table/Table';
import { TableRow } from '../../../Components/Admin/Table/TableRow';
import { TableData } from '../../../Components/Admin/Table/Index';
import PaginationButton from '../../../Components/General/Pagination/PaginationButton';
import { Apis, AuthGeturl, AuthPosturl } from '../../../Components/General/Api';
import { PiPencilSimpleLine } from 'react-icons/pi';
import { ImCancelCircle } from 'react-icons/im';
import { useSelector } from 'react-redux';
import ConfirmDeleteAdmin from './DeleteAdmin';
import UpdateAdmin from './UpdateAdmin';
import { ErrorAlert } from '../../../Components/General/Utils';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const TABLE_HEADERS = ['Name', 'Email', 'Admin Level', 'Status', ''];
const DEFAULT_PER_PAGE = 10;

const AllAdmin = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [error, setError] = useState(null);
    const [del, setDel] = useState(false);
    const [singles, setSingles] = useState({});
    const [loads, setLoads] = useState(false);
    const [view, setView] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { admin } = useSelector(state => state.data); // Pulling from Redux

    const fetchUsers = useCallback(async () => {
        let allAdmins = [];
        let pageNo = 1;
        const perPage = 15;

        try {
            let totalPages = 1;
            while (pageNo <= totalPages) {
                const res = await AuthGeturl(`${Apis.admins.get_admin}?page_no=${pageNo}&no_perpage=${perPage}`);
                if (res.status === true) {
                    const fetchedItems = res.data.data;
                    totalPages = res.data.totalpage || 1;

                    if (Array.isArray(fetchedItems)) {
                        allAdmins = [...allAdmins, ...fetchedItems];
                    } else if (typeof fetchedItems === 'object' && fetchedItems !== null) {
                        allAdmins.push(fetchedItems);
                    } else {
                        console.error('Unexpected data structure');
                    }
                } else {
                    throw new Error('Failed to fetch data');
                }
                pageNo++;
            }

            setItems(allAdmins);
            setFilteredItems(allAdmins);
        } catch (err) {
            setError(err.message);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const DeleteItem = (member) => {
        setDel(true);
        setSingles(member);
    };

    const SingleItem = (val) => {
        if (admin.userlevel === '1') {
            setSingles(val);
            setView(!view);
        }
    };

    const confirmAction = async () => {
        if (!singles.trackid) {
            console.error('No Admin found to delete.');
            return;
        }

        const data = { data_tid: singles.trackid };
        setLoads(true);
        try {
            const res = await AuthPosturl(Apis.admins.delete_admin, data);
            setLoads(false);
            if (res.status === true) {
                setDel(false);
                setItems(prevItems => prevItems.filter(item => item.trackid !== singles.trackid));
                setFilteredItems(prevItems => prevItems.filter(item => item.trackid !== singles.trackid));
            } else {
                ErrorAlert(res.text);
            }
        } catch (error) {
            setLoads(false);
        }
    };

    const handlePageChange = (val) => {
        setCurrentPage(val.selected);
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase().trim();
        setSearchTerm(value);

        if (value === '') {
            setFilteredItems(items);
            return;
        }

        const filtered = items.filter(item =>
            item.name.toLowerCase().includes(value) ||
            item.email.toLowerCase().includes(value) ||
            (item.username && item.username.toLowerCase().includes(value)) ||
            item.status.toLowerCase().includes(value)
        );

        setFilteredItems(filtered);
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    const totalItems = filteredItems.length;
    const pageCount = Math.ceil(totalItems / DEFAULT_PER_PAGE);

    const paginatedItems = filteredItems.slice(
        currentPage * DEFAULT_PER_PAGE,
        (currentPage + 1) * DEFAULT_PER_PAGE
    );

    const userLevelMapping = {
        1: 'Super Admin',
        3: 'Editor',
        4: 'Viewer',
    };

    return (
        <AdminLayout>
            {del && <ConfirmDeleteAdmin confirmAction={confirmAction} closeView={() => setDel(false)} isLoading={loads} />}
            {view && <UpdateAdmin singles={singles} resendSignal={() => fetchUsers()} closeView={() => setView(!view)} />}
            <div className="md:mx-10 mx-2 mb-20">
                <div className="bg-white mt-10 px-5 py-4 w-full">
                    <div className="flex items-center justify-between">
                        <div className="font-medium text-lg">All Admin</div>
                        <div className="md:flex hidden items-center gap-5">
                            <label className="border gap-[10px] text-[#9C9C9C] flex items-center py-2.5 px-3 border-primary rounded-md">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="w-[16rem] bg-transparent placeholder:text-[16px] placeholder:text-primary outline-none"
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

                <div className="flex items-start mb-10 justify-start w-full">
                    <Table headers={TABLE_HEADERS} className="mt-10 bg-white">
                        {paginatedItems.map((member, index) => (
                            <TableRow className="mb-10" key={index}>
                                <TableData>{member.name}</TableData>
                                <TableData>{member.email}</TableData>
                                <TableData>{userLevelMapping[member.userlevel] || 'Unknown'}</TableData>
                                <TableData>
                                    <span
                                        className={`font-medium px-3 py-1 rounded-full text-white ${member.status === '1' ? 'bg-green-600' : 'bg-red-600'}`}>
                                        {member.status === '1' ? 'ACTIVE' : 'INACTIVE'}
                                    </span>
                                </TableData>
                                <TableData>
                                    <div className="flex gap-4 text-primary">
                                        {admin.userlevel === '1' && (
                                            <>
                                                <div className="cursor-pointer" onClick={() => SingleItem(member)}>
                                                    <PiPencilSimpleLine />
                                                </div>
                                                <div className="cursor-pointer" onClick={() => DeleteItem(member)}>
                                                    <ImCancelCircle />
                                                </div>
                                            </>
                                        )}

                                    </div>
                                </TableData>
                            </TableRow>
                        ))}
                        {admin.userlevel === '1' && (
                            <div className="mt-10 mb-5 mx-10">
                                <Link to='/auth/admin/new-admin' className="bg-pink w-fit px-4 py-2 text-white rounded-md">
                                    <button>Add Admin</button>
                                </Link>
                            </div>
                        )}
                        <div className="w-full flex justify-end items-end mt-4">
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

export default AllAdmin;