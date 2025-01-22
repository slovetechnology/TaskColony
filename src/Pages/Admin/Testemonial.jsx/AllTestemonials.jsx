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
import { ToastAlert } from '../../../Components/General/Utils';
import { PiPencilSimpleLine } from 'react-icons/pi';
import { ImCancelCircle } from 'react-icons/im';
import UpdateTestemonials from './UpdateTestemonials';
import ConfirmDeleteTestemonial from './DeleteTestemonial';
import { useSelector } from 'react-redux';

const TABLE_HEADERS = ['Trackid', 'Name', 'Review', '', ''];
const DEFAULT_PER_PAGE = 10;

const AllTestemonials = () => {
  const [query, setQuery] = useState({ pageNumber: 1 });
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [loads, setLoads] = useState(false);
  const [del, setDel] = useState(false);
  const [singles, setSingles] = useState({});
  const [view, setView] = useState(false);
  const { admin } = useSelector(state => state.data);
  const userLevel = admin.userlevel;
  const pageCount = Math.ceil(total / DEFAULT_PER_PAGE);

  const paginatedItems = filteredItems.slice(
    currentPage * DEFAULT_PER_PAGE,
    (currentPage + 1) * DEFAULT_PER_PAGE
  );

  const handlePageChange = (val) => {
    setCurrentPage(val.selected);
  };

  const getAllTestemonials = useCallback(async () => {
    let allTestemonials = [];
    let pageNo = 1;
    const perPage = 20; // Match backend page size
    let totalPages = 1;

    try {
      while (pageNo <= totalPages) {
        const res = await AuthGeturl(`${Apis.admins.get_testemonials}?page_no=${pageNo}&no_perpage=${perPage}`);

        if (res.status === true) {
          const fetchedItems = res.data.data;
          totalPages = res.data.totalpage;

          if (Array.isArray(fetchedItems)) {
            allTestemonials = [...allTestemonials, ...fetchedItems];
          } else if (typeof fetchedItems === 'object' && fetchedItems !== null) {
            allTestemonials.push(fetchedItems);
          }
        } else {
          throw new Error('Failed to fetch testimonials.');
        }

        pageNo++;
      }

      setItems(allTestemonials);
      setFilteredItems(allTestemonials);
      setTotal(allTestemonials.length);
    } catch (err) {
      console.error(err.message);
      ToastAlert('Error fetching testimonials.');
    }
  }, []);

  useEffect(() => {
    getAllTestemonials();
  }, [getAllTestemonials]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = items.filter((item) => {
      const trackId = item.trackid ? item.trackid.toLowerCase() : '';
      const lastName = item.ulname ? item.ulname.toLowerCase() : '';

      return trackId.includes(value) || lastName.includes(value);
    });

    setFilteredItems(filtered);
  };

  const truncateText = (text, limit) => {
    if (text.length > limit) {
      return { truncated: true, text: text.slice(0, limit) + '...' };
    }
    return { truncated: false, text };
  };

  const ReviewWithReadMore = ({ review, characterLimit = 100 }) => {
    const [expanded, setExpanded] = useState(false);

    const { truncated, text } = truncateText(review, characterLimit);

    return (
      <div>
        <p className='w-[20rem]'>
          {expanded ? review : text}{' '}
          {truncated && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-primary underline"
            >
              {expanded ? 'Read Less' : 'Read More'}
            </button>
          )}
        </p>
      </div>
    );
  };

  const confirmAction = async () => {
    if (!singles.trackid) {
      ToastAlert('No Booking Found.');
      return;
    }

    const data = { data_tid: singles.trackid };
    setLoads(true);
    try {
      const res = await AuthPosturl(Apis.admins.delete_testemonials, data);
      setLoads(false);
      if (res.status === true) {
        setDel(false);

        // Remove the deleted item from items and filteredItems
        setItems((prevItems) => prevItems.filter(item => item.trackid !== singles.trackid));
        setFilteredItems((prevFilteredItems) => prevFilteredItems.filter(item => item.trackid !== singles.trackid));

        ToastAlert('testemoniala deleted successfully.');
      } else {
        ToastAlert('Failed to delete testemoniala.');
      }
    } catch (error) {
      setLoads(false);
      ToastAlert('Error deleting testemoniala.');
    }
  };
  const DeleteItem = (member) => {
    setDel(true);
    setSingles(member);
  };
  const SingleItem = (val) => {
    setSingles(val);
    setView(!view);
  };
  return (
    <AdminLayout>
      {del && (
        <ConfirmDeleteTestemonial
          confirmAction={confirmAction}
          closeView={() => setDel(false)}
          isLoading={loads}
        />
      )}
      {view && (
        <UpdateTestemonials
          singles={singles}
          resendSignal={() => getAllBooking()}
          closeView={() => setView(!view)}
        />
      )}
      <div className="lg:mx-10 mx-2 mb-10">
        <div className="bg-white mt-10 px-5 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="font-medium text-lg">All Testimonials</div>
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
            onPageChange={handlePageChange}
            pageCount={pageCount}
          >
            {paginatedItems.map((member, index) => (
              <TableRow className="mb-10" key={index}>
                <TableData>{member.trackid}</TableData>
                <TableData>{member.ulname}</TableData>
                <TableData>
                  <ReviewWithReadMore review={member.review || ''} />
                </TableData>
                {userLevel !== "3" && (

                  <TableData>
                    <div className="flex gap-4 text-lg text-primary">
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
            <div className="w-full flex justify-center mt-4">
              <PaginationButton pageCount={pageCount} onPageChange={handlePageChange} />
            </div>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AllTestemonials;