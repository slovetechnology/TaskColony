import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import { Table } from '../../../Components/Admin/Table/Table';
import { TableRow } from '../../../Components/Admin/Table/TableRow';
import { TableData } from '../../../Components/Admin/Table/Index';
import { FaSearch } from 'react-icons/fa';
import { ImCancelCircle } from 'react-icons/im';
import { PiPencilSimpleLine } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import { GiCancel } from 'react-icons/gi';
import { HiOutlineAdjustments } from 'react-icons/hi';
import PaginationButton from '../../../Components/General/Pagination/PaginationButton';
import { Apis, AuthGeturl, AuthPosturl } from '../../../Components/General/Api';
import ConfirmDeleteServices from './DeleteServices';
import UpdateService from './UpdateServices';

const TABLE_HEADERS = ['Name', 'Category', 'Commission', 'Minimum Duration', 'Status', ''];
const DEFAULT_PER_PAGE = 20;

const AllServices = () => {
    const { admin } = useSelector(state => state.data);
    const userLevel = admin.userlevel;

    const [query, setQuery] = useState({ pageNumber: 1 });
    const [total, setTotal] = useState(0);
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [categories, setCategories] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [del, setDel] = useState(false);
    const [singles, setSingles] = useState({});
    const [loads, setLoads] = useState(false);
    const [view, setView] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const pageCount = Math.ceil(total / DEFAULT_PER_PAGE);

    const DeleteItem = (member) => {
        setDel(true);
        setSingles(member);
    };

    const confirmAction = async () => {
        if (!singles.trackid) {
            console.error('No service ID found to delete.');
            return;
        }

        const data = { data_tid: singles.trackid };
        setLoads(true);
        try {
            const res = await AuthPosturl(Apis.admins.delete_admin_services, data);
            setLoads(false);
            if (res.status === true) {
                setDel(false);
                setItems(prevItems => prevItems.filter(item => item.trackid !== singles.trackid));
                setFilteredItems(prevItems => prevItems.filter(item => item.trackid !== singles.trackid));
                setTotal(prevTotal => prevTotal - 1);
            } else {
                console.error('Error deleting service:', res.data.text);
            }
        } catch (error) {
            setLoads(false);
        }
    };

    const GetAllCat = async () => {
        try {
            const res = await AuthGeturl(Apis.admins.get_categories);
            if (res.status === true) {
                const categoryLookup = res.data.data.reduce((acc, category) => {
                    acc[category.trackid] = category.name;
                    return acc;
                }, {});
                setCategories(categoryLookup);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const getAllServices = useCallback(async () => {
        let allServices = [];
        let pageNo = 1;
        const perPage = 15; // Match backend's page size
        let totalPage = 1;

        try {
            while (pageNo <= totalPage) {
                const res = await AuthGeturl(`${Apis.admins.get_admin_services}?page_no=${pageNo}&no_perpage=${perPage}`);
                if (res.status === true) {
                    const fetchedItems = res.data.data;
                    totalPage = res.data.totalpage;

                    if (Array.isArray(fetchedItems)) {
                        allServices = [...allServices, ...fetchedItems];
                    } else if (typeof fetchedItems === 'object' && fetchedItems !== null) {
                        allServices.push(fetchedItems);
                    } else {
                        console.error('Unexpected data structure');
                    }
                } else {
                    throw new Error('Failed to fetch data');
                }

                pageNo++;
            }

            setItems(allServices);
            setFilteredItems(allServices);
            setTotal(allServices.length);
        } catch (err) {
            console.error(err.message);
        }
    }, []);

    useEffect(() => {
        GetAllCat();
        getAllServices();
    }, [getAllServices]);

    const SingleItem = val => {
        setSingles(val);
        setView(!view);
    };

    const paginatedItems = filteredItems.slice(
        currentPage * DEFAULT_PER_PAGE,
        (currentPage + 1) * DEFAULT_PER_PAGE
    );

    const handlePageChange = (val) => {
        setCurrentPage(val.selected);
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        const filtered = items.filter(item =>
            item.name.toLowerCase().includes(value) ||
            item.commission.toString().toLowerCase().includes(value) ||
            item.min_duration.toString().toLowerCase().includes(value)
        );

        setFilteredItems(filtered);
        setTotal(filtered.length);
    };

    return (
        <AdminLayout>
            {del && <ConfirmDeleteServices confirmAction={confirmAction} closeView={() => setDel(false)} isLoading={loads} />}
            {view && <UpdateService singles={singles} resendSignal={getAllServices} closeView={() => setView(!view)} />}

            <div className="md:mx-10 mx-2 mb-10">
                <div className="bg-white mt-10 px-5 py-4 w-full">
                    <div className="flex items-center justify-between">
                        <div className="font-medium text-lg">Services</div>
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
                <div className="flex items-start mb-10 justify-start">
                    <Table headers={TABLE_HEADERS} className='mt-10 bg-white'>
                        {paginatedItems.map((member, index) => (
                            <TableRow className='mb-10' key={index}>
                                <TableData>{member.name}</TableData>
                                <TableData>{categories[member.cat_tid] || 'N/A'}</TableData>
                                <TableData>{member.commission}</TableData>
                                <TableData>{member.min_duration}</TableData>
                                <TableData>
                                    <span className={`font-medium px-3 py-1 rounded-full text-white ${member.status === 1 ? 'bg-green-600' : 'bg-red-600'}`}>
                                        {member.status === 1 ? 'ACTIVE' : 'INACTIVE'}
                                    </span>
                                </TableData>
                                <TableData>
                                    <div className="flex gap-4 text-primary">
                                        {userLevel !== "4" && (
                                            <>
                                                <div className="cursor-pointer" onClick={() => SingleItem(member)}><PiPencilSimpleLine /></div>
                                                <div className="cursor-pointer" onClick={() => DeleteItem(member)}><ImCancelCircle /></div>
                                            </>
                                        )}
                                    </div>
                                </TableData>
                            </TableRow>
                        ))}
                        <div className="mt-10 mb-5 mx-10">
                            {userLevel !== "4" && (
                                <Link to='/auth/admin/new-service' className="bg-pink w-fit px-4 py-2 text-white rounded-md">
                                    <button>Add Services</button>
                                </Link>
                            )}
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

export default AllServices;