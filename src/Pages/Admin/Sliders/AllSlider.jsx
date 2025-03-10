import React, { useEffect, useState, useMemo } from 'react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import { Table } from '../../../Components/Admin/Table/Table';
import { TableRow } from '../../../Components/Admin/Table/TableRow';
import { TableData } from '../../../Components/Admin/Table/Index';
import { ImCancelCircle } from 'react-icons/im';
import { PiPencilSimpleLine } from 'react-icons/pi';
import { FaSearch } from 'react-icons/fa';
import { HiOutlineAdjustments } from 'react-icons/hi';
import { GiCancel } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import PaginationButton from '../../../Components/General/Pagination/PaginationButton';
import { Apis, AuthGeturl, AuthPosturl } from '../../../Components/General/Api';
import ConfirmDeleteSlider from './DeleteSlider';
import UpdateSlider from './UpdateSlider';
import { ToastAlert } from '../../../Components/General/Utils';
import { useSelector } from 'react-redux';

const TABLE_HEADERS = ['Title', 'Location', 'Status', '', ''];
const DEFAULT_PER_PAGE = 10;

const AllSlider = () => {
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [del, setDel] = useState(false);
    const [singles, setSingles] = useState({});
    const [view, setView] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { admin } = useSelector(state => state.data);
    const userLevel = admin.userlevel;

    const GetAllSlider = async () => {
        try {
            const res = await AuthGeturl(Apis.admins.get_admin_slider);
            if (res.status) {
                setItems(res.data.data);
            } else {
                console.error('Error fetching sliders:', res.data.text);
            }
        } catch (error) {
            console.error('Failed to fetch sliders:', error);
        }
    };

    useEffect(() => {
        GetAllSlider();
    }, []);

    const filteredItems = useMemo(() => {
        const value = searchTerm.toLowerCase();
        return items.filter(item => {
            return (
                item.title?.toLowerCase().includes(value) ||
                item.location?.toLowerCase().includes(value) ||
                (item.status === 1 ? 'active' : 'inactive').includes(value)
            );
        });
    }, [items, searchTerm]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handlePageChange = (val) => {
        setCurrentPage(val.selected);
    };

    const DeleteItem = (member) => {
        setDel(true);
        setSingles(member);
    };

    const confirmAction = async () => {
        if (!singles.id) return console.error('No slider ID found to delete.');

        try {
            const res = await AuthPosturl(Apis.admins.delete_admin_slider, { slider_id: singles.id });
            if (res.status) {
                ToastAlert('Slider deleted successfully');
                setItems(prev => prev.filter(item => item.id !== singles.id));
                setDel(false);
            } else {
                console.error('Error deleting slider:', res.data.text);
            }
        } catch (error) {
            console.error('Network request failed:', error);
        }
    };

    const SingleItem = (val) => {
        setSingles(val);
        setView(true);
    };

    const updateItem = (updatedSlider) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === updatedSlider.id ? { ...item, ...updatedSlider } : item
            )
        );
    };

    return (
        <AdminLayout>
            {del && <ConfirmDeleteSlider confirmAction={confirmAction} closeView={() => setDel(false)} />}
            {view && <UpdateSlider singles={singles} closeView={() => setView(false)} resendSignal={updateItem} />}

            <div className="md:mx-10 mx-2">
                <div className="bg-white mt-10 px-5 py-4 w-full">
                    <div className="flex items-center justify-between">
                        <div className="font-medium text-lg">Slider</div>
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
//                            <span className="text-primary text-2xl cursor-pointer" onClick={() => setSearchTerm('')}><GiCancel /></span>
                        </div>
                    </div>
                </div>

                <div className="mb-10">
                    <div className="flex items-start mb-10 justify-start">
                        <Table headers={TABLE_HEADERS} className="mt-10 bg-white">
                            {filteredItems.slice(currentPage * DEFAULT_PER_PAGE, (currentPage + 1) * DEFAULT_PER_PAGE).map((member, index) => (
                                <TableRow className="mb-10" key={member.id || index}>
                                    <TableData className="flex gap-2 items-center">{member.title}</TableData>
                                    <TableData>{member.location}</TableData>
                                    <TableData>
                                        <span className={`font-medium px-3 py-1 rounded-full text-white ${member.status === 1 ? 'bg-green-600' : 'bg-red-600'}`}>
                                            {member.status === 1 ? 'ACTIVE' : 'INACTIVE'}
                                        </span>
                                    </TableData>
                                    {userLevel !== "4" && (
                                        <TableData>
                                            <div className="flex gap-4 text-primary">
                                                <div className="cursor-pointer" onClick={() => SingleItem(member)}>
                                                    <PiPencilSimpleLine />
                                                </div>
                                                <div className="cursor-pointer" onClick={() => DeleteItem(member)}>
                                                    <ImCancelCircle />
                                                </div>
                                            </div>
                                        </TableData>
                                    )}
                                </TableRow>
                            ))}

                            {userLevel !== "4" && (
                                <div className="mt-10 mx-5">
                                    <Link to="/auth/admin/new-slider" className="bg-pink w-fit px-4 py-2 text-white rounded-md">
                                        <button>Add Slider</button>
                                    </Link>
                                </div>
                            )}

                            <PaginationButton
                                pageCount={Math.ceil(filteredItems.length / DEFAULT_PER_PAGE)}
                                onPageChange={handlePageChange}
                            />
                        </Table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AllSlider;
