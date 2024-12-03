import React, { useState, useCallback, useEffect } from 'react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import { FaSearch } from 'react-icons/fa';
import { GiCancel } from 'react-icons/gi';
import { HiOutlineAdjustments } from 'react-icons/hi';
import { Table } from '../../../Components/Admin/Table/Table';
import { TableRow } from '../../../Components/Admin/Table/TableRow';
import { TableData } from '../../../Components/Admin/Table/Index';
import ToggleButton from '../../../Components/General/toggle-button';
import { Link } from 'react-router-dom';
import PaginationButton from '../../../Components/General/Pagination/PaginationButton';
import { Apis, AuthGeturl, AuthPosturl } from '../../../Components/General/Api';
import { PiPencilSimpleLine } from 'react-icons/pi';
import { ImCancelCircle } from 'react-icons/im';
import ConfirmDeleteCategory from './DeleteCategory';
import { ToastAlert } from '../../../Components/General/Utils';
import UpdateCategory from './UpdateCategory';

const TABLE_HEADERS = ['Icon', 'Name', 'Status', '', ''];
const DEFAULT_PER_PAGE = 10;

const AllCategories = () => {
  const [query, setQuery] = useState({ pageNumber: 1 });
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const [del, setDel] = useState(false);
  const [singles, setSingles] = useState({});
  const [loads, setLoads] = useState(false);
  const [view, setView] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle search functionality
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(value) || 
      item.status.toString().toLowerCase().includes(value)
    );

    setFilteredItems(filtered);
  };

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
      const res = await AuthPosturl(Apis.admins.delete_categories, data);
      setLoads(false);
      if (res.status === true) {
        setDel(false);
        setItems(prevItems => prevItems.filter(item => item.trackid !== singles.trackid));
        setFilteredItems(prevItems => prevItems.filter(item => item.trackid !== singles.trackid));
        setTotal(prevTotal => prevTotal - 1);
        ToastAlert('Category Deleted Successfully');
      } else {
        console.error('Error deleting service:', res.data.text);
      }
    } catch (error) {
      console.error('Network request failed:', error);
      setLoads(false);
    }
  };

  const fetchCategories = useCallback(async () => {
    try {
      const res = await AuthGeturl(Apis.admins.get_categories);
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
    fetchCategories();
  }, [fetchCategories]);

  const totalItems = filteredItems.length;
  const pageCount = Math.ceil(totalItems / DEFAULT_PER_PAGE);

  const paginatedItems = filteredItems.slice(
    currentPage * DEFAULT_PER_PAGE,
    (currentPage + 1) * DEFAULT_PER_PAGE
  );

  const handlePageChange = (val) => {
    setCurrentPage(val.selected);
  };

  const SingleItem = val => {
    setSingles(val);
    setView(!view);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <AdminLayout>
      {del && <ConfirmDeleteCategory confirmAction={confirmAction} closeView={() => setDel(false)} isLoading={loads} />}
      {view && <UpdateCategory singles={singles} resendSignal={fetchCategories} closeView={() => setView(!view)} />}
      <div className="md:mx-10 mx-2 mb-20">
        <div className="bg-white mt-10 px-5 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="font-medium text-lg">Categories</div>
            <div className="md:flex hidden items-center gap-5">
              <label className='border gap-[10px] text-[#9C9C9C] items-center flex py-2.5 px-3 border-[#F5F5F5] rounded-md'>
                <input
                  type="text"
                  placeholder='Search'
                  className='w-[16rem] placeholder:text-[16px] placeholder:text-primary outline-none'
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </label>
              <span className="text-primary text-2xl"><HiOutlineAdjustments /></span>
              <span className="text-primary text-2xl"><GiCancel /></span>
            </div>
          </div>
        </div>
        <div className="flex items-start mb-10 justify-start ">
          <Table
            headers={TABLE_HEADERS}
            className='mt-10 bg-white'
          >
            {paginatedItems.map((member, index) => (
              <TableRow className='mb-10' key={index}>
                <TableData className='flex gap-2 items-center'>
                  <div className='w-16 h-16 bg-secondary p-4 rounded-full overflow-hidden'>
                    <img
                      className='w-full h-full object-cover'
                      src={member.icon_image}
                      alt={member.name}
                    />
                  </div>
                  <div>
                  </div>
                </TableData>
                <TableData><p className='mb-2.5'>{member.name}</p></TableData>
                <TableData>
                  <span
                    className={`font-medium px-3 py-1 rounded-full text-white ${member.status === 1 ? 'bg-green-600' : 'bg-red-600'
                      }`}
                  >
                    {member.status === 1 ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </TableData>
                <TableData>
                  <div className="flex gap-4 text-primary">
                    <div className="cursor-pointer" onClick={() => SingleItem(member)}><PiPencilSimpleLine /></div>
                    <div className="cursor-pointer" onClick={() => DeleteItem(member)}> <ImCancelCircle /></div>
                  </div>
                </TableData>
              </TableRow>
            ))}
            <div className="mt-10 mx-5">
              <Link to='/auth/admin/new-category' className="bg-pink w-fit px-4 py-2 text-white rounded-md">
                <button>Add Category</button>
              </Link>
            </div>
            <div className="w-full flex justify-center mt-4">
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

export default AllCategories;