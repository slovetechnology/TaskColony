import React, { useCallback, useEffect, useState } from 'react';
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
import ConfirmDeleteTax from './Deletax';
import UpdateTax from './UpdateTax';
import { ToastAlert } from '../../../Components/General/Utils';

const TABLE_HEADERS = ['State', 'Tax', 'Status', 'More'];
const DEFAULT_PER_PAGE = 10;

const AllTaxes = () => {
    const [total, setTotal] = useState(0);
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [del, setDel] = useState(false);
    const [singles, setSingles] = useState({});
    const [loads, setLoads] = useState(false);
    const [view, setView] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const pageCount = Math.ceil(filteredItems.length / DEFAULT_PER_PAGE);

    const DeleteItem = (member) => {
        setDel(true);
        setSingles(member);
    };

    const confirmAction = async () => {
        if (!singles.trackid) {
            console.error('No tax ID found to delete.');
            return;
        }

        const data = { tax_tid: singles.trackid };
        setLoads(true);
        try {
            const res = await AuthPosturl(Apis.admins.delete_admin_taxes, data);
            setLoads(false);
            if (res.status === true) {
                setDel(false);
                ToastAlert('Tax deleted successfully');
                setItems(prevItems => prevItems.filter(item => item.trackid !== singles.trackid));
                setFilteredItems(prevItems => prevItems.filter(item => item.trackid !== singles.trackid));
                setTotal(prevTotal => prevTotal - 1);
            } else {
                console.error('Error deleting tax:', res.data.text);
            }
        } catch (error) {
            console.error('Network request failed:', error);
            setLoads(false);
        }
    };

    const getAllTaxes = useCallback(async () => {
        try {
            const res = await AuthGeturl(Apis.admins.get_admin_taxes);
            if (res.status === true) {
                const fetchedItems = res.data.data;

                if (Array.isArray(fetchedItems)) {
                    setItems(fetchedItems);
                    setFilteredItems(fetchedItems);
                    setTotal(fetchedItems.length);
                } else if (typeof fetchedItems === 'object' && fetchedItems !== null) {
                    setItems([fetchedItems]);
                    setFilteredItems([fetchedItems]);
                    setTotal(1);
                } else {
                    console.error('Unexpected data structure');
                }
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (err) {
            console.error(err.message);
        }
    }, []);

    useEffect(() => {
        getAllTaxes();
    }, [getAllTaxes]);

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

    // Handle search functionality
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        const filtered = items.filter(item =>
            item.name.toLowerCase().includes(value) ||
            item.commission.toString().toLowerCase().includes(value) ||
            (item.status === 1 ? 'active' : 'inactive').includes(value)
        );

        setFilteredItems(filtered);
    };

    return (
        <AdminLayout>
            {del && <ConfirmDeleteTax confirmAction={confirmAction} closeView={() => setDel(false)} isLoading={loads} />}
            {view && <UpdateTax singles={singles} resendSignal={getAllTaxes} closeView={() => setView(!view)} />}

            <div className="md:mx-10 mx-2 mb-10">
                <div className="bg-white mt-10 px-5 py-4 w-full">
                    <div className="flex items-center justify-between">
                        <div className="font-medium text-lg">Taxes</div>
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
                    <Table
                        headers={TABLE_HEADERS}
                        className='mt-10 bg-white'
                    >
                        {paginatedItems.map((member, index) => (
                            <TableRow className='mb-10' key={index}>
                                <TableData>{member.name}</TableData>
                                <TableData>{member.commission}</TableData>
                                <TableData>
                                    <span
                                        className={`font-medium px-3 py-1 rounded-full text-white ${member.status === 1 ? 'bg-green-600' : 'bg-red-600'}`}
                                    >
                                        {member.status === 1 ? 'ACTIVE' : 'INACTIVE'}
                                    </span>
                                </TableData>
                                <TableData>
                                    <div className="flex gap-4 text-primary">
                                        <div className="cursor-pointer" onClick={() => SingleItem(member)}><PiPencilSimpleLine /></div>
                                        <div className="cursor-pointer" onClick={() => DeleteItem(member)}><ImCancelCircle /></div>
                                    </div>
                                </TableData>
                            </TableRow>
                        ))}
                        <div className="mt-10 mx-10">
                            <Link to='/auth/admin/new-tax' className="bg-pink w-fit px-4 py-2 text-white rounded-md">
                                <button>Add Taxes</button>
                            </Link>
                        </div>
                        <PaginationButton
                            pageCount={pageCount}
                            onPageChange={handlePageChange}
                        />
                    </Table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AllTaxes;