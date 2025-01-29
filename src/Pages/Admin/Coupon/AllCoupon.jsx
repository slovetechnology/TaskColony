import React, { useCallback, useEffect, useState } from 'react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import { Table } from '../../../Components/Admin/Table/Table';
import { TableRow } from '../../../Components/Admin/Table/TableRow';
import { TableData } from '../../../Components/Admin/Table/Index';
import { FaSearch } from 'react-icons/fa';
import { HiOutlineAdjustments } from 'react-icons/hi';
import { GiCancel } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import PaginationButton from '../../../Components/General/Pagination/PaginationButton';
import { Apis, AuthGeturl, AuthPosturl } from '../../../Components/General/Api';
import { PiPencilSimpleLine } from 'react-icons/pi';
import { ImCancelCircle } from 'react-icons/im';
import UpateCoupon from './UpdateCoupon';
import ConfirmDeleteCoupon from './DeleteCoupon';
import { useSelector } from 'react-redux';
import { formatDate } from '../../../utils/utils';

const TABLE_HEADERS = ['Code', 'Discount', 'Discount Type', 'Expiry Date', 'Status', ''];
const DEFAULT_PER_PAGE = 10;

const AllCoupon = () => {
    const [query, setQuery] = useState({ pageNumber: 1 });
    const [total, setTotal] = useState(0);
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const { admin } = useSelector(state => state.data);
    const [del, setDel] = useState(false);
    const [singles, setSingles] = useState({});
    const [loads, setLoads] = useState(false);
    const [view, setView] = useState(false);
    const totalItems = filteredItems.length;
    const pageCount = Math.ceil(totalItems / DEFAULT_PER_PAGE);

    const SingleItem = val => {
        setSingles(val);
        setView(!view);
    };

    const DeleteItem = (member) => {
        setDel(true);
        setSingles(member);
    };

    const confirmAction = async () => {
        if (!singles.trackid) {
            console.error('No tax ID found to delete.');
            return;
        }

        const data = { coupon_tid: singles.trackid };
        setLoads(true);
        try {
            const res = await AuthPosturl(Apis.admins.delete_admin_coupon, data);
            setLoads(false);
            if (res.status === true) {
                setDel(false);
                setItems(prevItems => prevItems.filter(item => item.trackid !== singles.trackid));
                setFilteredItems(prevItems => prevItems.filter(item => item.trackid !== singles.trackid));
                setTotal(prevTotal => prevTotal - 1);
            } else {
                console.error('Error deleting tax:', res.text);
            }
        } catch (error) {
            console.error('Network request failed:', error);
            setLoads(false);
        }
    };

    const handlePageChange = (val) => {
        setCurrentPage(val.selected);
    };

    const getSelectedPage = (val) => {
        const pageNumber = val?.selected + 1;
        setQuery({ ...query, pageNumber });
    };

    const onClose = () => setIsOpen(false);

    const getAllCoupon = useCallback(async () => {
        const res = await AuthGeturl(Apis.admins.get_admin_coupon);
        if (res.status === true) {
            setItems(res.data.data);
            setFilteredItems(res.data.data); // Initialize with all items
        }
    }, []);

    // Handle search functionality
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase(); // Convert search term to lowercase
        setSearchTerm(value);

        const filtered = items.filter(item =>
            item.trackid.toLowerCase().includes(value) || // Convert and match trackid
            item.typetext.toLowerCase().includes(value) || // Convert and match typetext
            item.coupon_value.toString().toLowerCase().includes(value) || // Convert and match coupon value
            item.expiredate.toLowerCase().includes(value) // Convert and match expire date
        );

        setFilteredItems(filtered); // Update filtered items
    };

    useEffect(() => {
        getAllCoupon();
    }, [getAllCoupon]);

    return (
        <AdminLayout>
            {del && <ConfirmDeleteCoupon confirmAction={confirmAction} closeView={() => setDel(false)} isLoading={loads} />}
            {view && <UpateCoupon singles={singles} resendSignal={() => getAllCoupon()} closeView={() => setView(!view)} />}
            <div className="md:mx-10 mx-2">
                <div className="bg-white mt-10 px-5 py-4 w-full">
                    <div className="flex items-center justify-between">
                        <div className="font-medium text-lg">Coupon</div>
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
                <div className=" mb-10">
                    <div className="flex items-start mb-10 justify-start">
                        <Table
                            headers={TABLE_HEADERS}
                            className='mt-10 bg-white'
                            onPageChange={getSelectedPage}
                            pageCount={Math.ceil(total / DEFAULT_PER_PAGE)}
                        >
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center text-gray-500 py-4">Data not found</td>
                                </tr>
                            ) : (
                                filteredItems.slice(currentPage * DEFAULT_PER_PAGE, (currentPage + 1) * DEFAULT_PER_PAGE).map((member, index) => (
                                    <TableRow className=' mb-10' key={index}>
                                        <TableData className='flex gap-2 items-center'>
                                            {member.coupoun_code}
                                        </TableData>
                                        <TableData>${member.coupon_value}</TableData>
                                        <TableData>{member.typetext}</TableData>
                                        <TableData>{formatDate(member.expiredate)}</TableData>
                                        <TableData>
                                            <span
                                                className={`font-medium px-3 py-1 rounded-full text-white ${member.status === 1 ? 'bg-green-600' : 'bg-red-600'}`}
                                            >
                                                {member.status === 1 ? 'ACTIVE' : 'INACTIVE'}
                                            </span>
                                        </TableData>
                                        <TableData>
                                            <div className="flex gap-4  text-primary">
                                                {admin.userlevel !== "4" && (
                                                    <>
                                                        <div className="cursor-pointer" onClick={() => SingleItem(coupon)}>
                                                            <PiPencilSimpleLine />
                                                        </div>
                                                        <div className="cursor-pointer" onClick={() => DeleteItem(coupon)}>
                                                            <ImCancelCircle />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </TableData>
                                    </TableRow>
                                ))
                            )}
                            <div className="mt-10 mx-5">
                                {admin.userlevel !== "4" && (
                                    <Link to='/auth/admin/new-coupon' className="bg-pink w-fit px-4 py-2 text-white rounded-md">
                                        <button>Add Coupon</button>
                                    </Link>
                                )}
                            </div>
                            <PaginationButton
                                pageCount={pageCount}
                                onPageChange={handlePageChange}
                            />
                        </Table>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
};

export default AllCoupon;
