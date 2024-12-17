import React, { useCallback, useEffect, useState } from 'react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import { FaSearch } from 'react-icons/fa';
import { GiCancel } from 'react-icons/gi';
import { HiOutlineAdjustments } from 'react-icons/hi';
import profiles from '../../../assets/profile.png';
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
import { SlMagnifier } from 'react-icons/sl';

const TABLE_HEADERS = ['Name', 'Service', 'Provider', 'Amount', 'Status', '', '', ''];
const DEFAULT_PER_PAGE = 10;

const statusToVariant = {
  completed: 'success',
  cancle: 'danger',
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
    const perPage = 15; // Match backend page size
    let totalPages = 1; 

    try {
      while (pageNo <= totalPages) {
        const res = await AuthGeturl(`${Apis.admins.get_booking}?page_no=${pageNo}&no_perpage=${perPage}`);

        if (res.status === true) {
          const fetchedItems = res.data.data;
          totalPages = res.data.totalpage; 

          // Combine results into `allBookings`
          if (Array.isArray(fetchedItems)) {
            allBookings = [...allBookings, ...fetchedItems];
          } else if (typeof fetchedItems === 'object' && fetchedItems !== null) {
            allBookings.push(fetchedItems);
          } else {
            console.error('Unexpected data structure');
          }
        } else {
          throw new Error('Failed to fetch bookings.');
        }

        pageNo++;
      }

      // Set combined data to state
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
      if (res.status === true) {
        setDel(false);
        getAllBooking();
      } else {
        ToastAlert('Failed to delete booking.');
      }
    } catch (error) {
      setLoads(false);
      ToastAlert('Error deleting booking.');
    }
  };

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

    const filtered = items.filter((item) =>
      (item.ufname && item.ufname.toLowerCase().includes(value)) ||
      (item.pfname && item.pfname.toLowerCase().includes(value)) ||
      (item.uemail && item.uemail.toString().toLowerCase().includes(value)) ||
      (item.service_name && item.service_name.toLowerCase().includes(value))
    );

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
          resendSignal={() => getAllBooking()}
          closeView={() => setView(!view)}
        />
      )}
      {views && (
        <AssignBooking
          singles={single}
          resendSignal={() => getAllBooking()}
          closeView={() => {
            console.log('Close view called'); // Debugging log
            setViews(false);
          }}
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
              <span className="text-primary text-2xl">
                <HiOutlineAdjustments />
              </span>
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
            {(Array.isArray(paginatedItems) ? paginatedItems : Object.values(paginatedItems)).map(
              (member, index) => (
                <TableRow className="mb-10" key={index}>
                  <TableData className="flex gap-2 items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        className="w-full h-full object-cover"
                        src={member.profiles || profiles}
                        alt={member.ufname}
                      />
                    </div>
                    <div>
                      <p className="mb-2.5">{member.ufname}</p>
                      <p className="text-sm font-light text-secondary-500">{member.uemail}</p>
                    </div>
                  </TableData>
                  <TableData>{member.service_name}</TableData>
                  <TableData>
                    <p className="text-sm font-light text-secondary-500">{member.pfname}</p>
                  </TableData>
                  <TableData>
                    <p className="text-sm font-light text-secondary-500">{member.amt_paid}</p>
                  </TableData>
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
                      <div className="cursor-pointer" onClick={() => SingleItem(member)}>
                        <PiPencilSimpleLine />
                      </div>
                      <div className="cursor-pointer" onClick={() => DeleteItem(member)}>
                        <ImCancelCircle />
                      </div>
                      {member.status_text.toLowerCase() === 'pending' && (
                        <div className="cursor-pointer" onClick={() => SingleItems(member)}>
                          <IoSettingsOutline />
                        </div>
                      )}
                    </div>
                  </TableData>
                </TableRow>
              )
            )}
            <div className=" w-full flex justify-center mt-4">
              <PaginationButton pageCount={pageCount} onPageChange={handlePageChange} />
            </div>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AllBookings;