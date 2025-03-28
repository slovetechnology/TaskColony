import React, { useCallback, useEffect, useState } from 'react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import { FaSearch } from 'react-icons/fa';
import { GiCancel } from 'react-icons/gi';
import { HiOutlineAdjustments } from 'react-icons/hi';
import profiles from '../../../assets/user.png';
import { Table } from '../../../Components/Admin/Table/Table';
import { TableRow } from '../../../Components/Admin/Table/TableRow';
import { TableData } from '../../../Components/Admin/Table/Index';
import StatusTag from '../../../Components/General/status-tag';
import PaginationButton from '../../../Components/General/Pagination/PaginationButton';
import { Apis, AuthGeturl, AuthPosturl } from '../../../Components/General/Api';
import ConfirmDeleteBooking from './DeleteBooking';
import UpdateBooking from './UpdateBooking';
import { PiPencilSimpleLine } from 'react-icons/pi';
import { ImCancelCircle } from 'react-icons/im';
import { IoSettingsOutline } from 'react-icons/io5';
import { ToastAlert } from '../../../Components/General/Utils';
import AssignBooking from './AssignBooking';
import { formatDate } from '../../../utils/utils';
import { useSelector } from 'react-redux';

const TABLE_HEADERS = ['Name', 'Service', 'Provider', 'Amount', 'Trackid', 'Date', 'Time', 'Status', '', '', ''];
const DEFAULT_PER_PAGE = 10;

const statusToVariant = {
  completed: 'success',
  canceled: 'danger',
  pending: 'warn',
  accepted: 'primary',
  done: 'gold',
  rejected: 'dark',
  ongoing: 'accept',
  hold: 'secondary',
};

const AllBookings = () => {
  const [query, setQuery] = useState({ pageNumber: 1 });
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [del, setDel] = useState(false);
  const [singles, setSingles] = useState({});
  const [single, setSingle] = useState({});
  const [loads, setLoads] = useState(false);
  const [view, setView] = useState(false);
  const [views, setViews] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // New state for status filter
  const { admin } = useSelector(state => state.data);

  const pageCount = Math.ceil(total / DEFAULT_PER_PAGE);

  const paginatedItems = filteredItems.slice(
    currentPage * DEFAULT_PER_PAGE,
    (currentPage + 1) * DEFAULT_PER_PAGE
  );

  const handlePageChange = (val) => {
    setCurrentPage(val.selected);
  };

  const getSelectedPage = (val) => {
    const pageNumber = val?.selected + 1;
    setQuery({ ...query, pageNumber });
  };

  const getAllBooking = useCallback(async () => {
    let allBookings = [];
    let pageNo = 1;
    const perPage = 15;

    try {
      while (true) {
        const res = await AuthGeturl(`${Apis.admins.get_booking}?page_no=${pageNo}&no_perpage=${perPage}`);

        if (res.status && Array.isArray(res.data.data)) {
          allBookings = [...allBookings, ...res.data.data];
          if (pageNo >= res.data.totalpage) break;
        } else {
          throw new Error('Failed to fetch bookings.');
        }

        pageNo++;
      }

      setItems(allBookings);
      setFilteredItems(allBookings);
      setTotal(allBookings.length);
    } catch (err) {
      console.error(err.message);
      ToastAlert('Error fetching bookings.');
    }
  }, []);

  useEffect(() => {
    getAllBooking();
  }, [getAllBooking]);

  const DeleteItem = (member) => {
    setDel(true);
    setSingles(member);
  };

  const confirmAction = async () => {
    if (!singles.trackid) {
      ToastAlert('No Booking Found.');
      return;
    }

    const data = { data_tid: singles.trackid };
    setLoads(true);
    try {
      const res = await AuthPosturl(Apis.admins.delete_bookings, data);
      setLoads(false);
      if (res.status) {
        setDel(false);
        setItems((prevItems) => prevItems.filter(item => item.trackid !== singles.trackid));
        setFilteredItems((prevFilteredItems) => prevFilteredItems.filter(item => item.trackid !== singles.trackid));
        ToastAlert('Booking deleted successfully.');
      } else {
        ToastAlert('Failed to delete booking.');
      }
    } catch (error) {
      setLoads(false);
      ToastAlert('Error deleting booking.');
    }
  };

  const toggleView = (setter) => () => setter(prev => !prev);
  const SingleItem = (val) => {
    setSingles(val);
    setView(!view);
  };
  const SingleItems = (val) => {
    setSingle(val);
    setViews(!views);
  };
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    let filtered = items.filter((item) =>
      (item.ufname && item.ufname.toLowerCase().includes(value)) ||
      (item.pfname && item.pfname.toLowerCase().includes(value)) ||
      (item.uemail && item.uemail.toString().toLowerCase().includes(value)) ||
      (item.service_name && item.service_name.toLowerCase().includes(value))
    );

    if (statusFilter !== '') {
      filtered = filtered.filter(item => item.status_text.toLowerCase() === statusFilter);
    }

    setFilteredItems(filtered);
  };

  const handleStatusFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    setStatusFilter(value);

    let filtered = items.filter((item) =>
      (item.ufname && item.ufname.toLowerCase().includes(searchTerm)) ||
      (item.pfname && item.pfname.toLowerCase().includes(searchTerm)) ||
      (item.uemail && item.uemail.toString().toLowerCase().includes(searchTerm)) ||
      (item.service_name && item.service_name.toLowerCase().includes(searchTerm))
    );

    if (value !== '') {
      filtered = filtered.filter(item => item.status_text.toLowerCase() === value);
    }

    setFilteredItems(filtered);
  };

  return (
    <AdminLayout>
      {del && (
        <ConfirmDeleteBooking
          confirmAction={confirmAction}
          closeView={() => setDel(false)}
          isLoading={loads}
        />
      )}
      {view && (
        <UpdateBooking
          singles={singles}
          resendSignal={getAllBooking}
          closeView={toggleView(setView)}
        />
      )}
      {views && (
        <AssignBooking
          singles={single}
          resendSignal={getAllBooking}
          closeView={toggleView(setViews)}
        />
      )}

      <div className="lg:mx-10 mx-2 mb-10">
        <div className="bg-white mt-10 px-5 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="font-medium text-lg">All Requested Gigs</div>
            <div className="md:flex items-center hidden gap-5">
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
              <select
                className="border gap-[10px] text-[#9C9C9C] flex items-center py-2.5 px-3 border-primary rounded-md"
                value={statusFilter}
                onChange={handleStatusFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="done">Done</option>
                <option value="rejected">Rejected</option>
                <option value="ongoing">Ongoing</option>
                <option value="hold">Hold</option>
              </select>
             
              <span className="text-primary text-2xl">
                <GiCancel />
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-start mb-10 justify-start">
          <Table
            headers={TABLE_HEADERS}
            className="mt-10 bg-white"
            onPageChange={getSelectedPage}
            pageCount={pageCount}
          >
            {paginatedItems.map((member, index) => (
              <TableRow className="mb-10" key={index}>
                <TableData className="flex gap-2 items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img className="w-full h-full object-cover" src={profiles} alt={member.ufname} />
                  </div>
                  <div>
                    <p className="mb-2.5">{member.ufname}</p>
                    <p className="text-sm font-light text-secondary-500">{member.uemail}</p>
                  </div>
                </TableData>
                <TableData>{member.service_name}</TableData>
                <TableData>
                  <p className="text-sm font-light text-secondary-500">{member.pfname} {member.plname}</p>
                </TableData>
                <TableData>
                  <p className="text-sm font-light text-secondary-500">${member.amt_paid}</p>
                </TableData>
                <TableData>
                  <p className="text-sm font-light text-secondary-500">{member.provider_tid}</p>
                </TableData>
                <TableData>{formatDate(member.created_date)}</TableData>
                <TableData>{member.created_time}</TableData>
                <TableData>
                  <StatusTag
                    variant={statusToVariant[member.status_text.toLowerCase()]}
                    size="small"
                    className="w-full"
                  >
                    {member.status_text}
                  </StatusTag>
                </TableData>
                <TableData>
                  <div className="flex gap-4 text-lg text-primary">
                    {admin.userlevel !== "4" && (
                      <>
                        <div className="cursor-pointer" onClick={() => SingleItem(member)}>
                          <PiPencilSimpleLine />
                        </div>

                        {/* <div className="cursor-pointer" onClick={() => DeleteItem(member)}>
                          <ImCancelCircle />
                        </div> */}
                        {member.status_text.toLowerCase() === 'pending' && (
                          <div className="cursor-pointer" onClick={() => SingleItems(member)}>
                            <IoSettingsOutline />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </TableData>
              </TableRow>
            ))}
            <div className="ml-10">
              <PaginationButton pageCount={pageCount} onPageChange={handlePageChange} />
            </div>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AllBookings;