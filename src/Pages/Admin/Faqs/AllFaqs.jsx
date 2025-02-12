import React, { useCallback, useEffect, useState } from 'react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import { FaSearch } from 'react-icons/fa';
import { GiCancel } from 'react-icons/gi';
import { HiOutlineAdjustments } from 'react-icons/hi';
import { Table } from '../../../Components/Admin/Table/Table';
import { TableRow } from '../../../Components/Admin/Table/TableRow';
import { TableData } from '../../../Components/Admin/Table/Index';
import { Link } from 'react-router-dom';
import PaginationButton from '../../../Components/General/Pagination/PaginationButton';
import { Apis, AuthGeturl, AuthPosturl } from '../../../Components/General/Api';
import { PiPencilSimpleLine } from 'react-icons/pi';
import { ImCancelCircle } from 'react-icons/im';
import { ToastAlert } from '../../../Components/General/Utils';
import { useSelector } from 'react-redux';
import UpdateFaqs from './UpdateFaqs';
import ConfirmDeleteFaqs from './DeleteFaqs';

const TABLE_HEADERS = ['Id', 'Title', 'Content', '', ''];
const DEFAULT_PER_PAGE = 10;

const AllFaqs = () => {
  const { admin } = useSelector(state => state.data);
  const [query, setQuery] = useState({ pageNumber: 1 });
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [del, setDel] = useState(false);
  const [singles, setSingles] = useState({});
  const [loads, setLoads] = useState(false);
  const [view, setView] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
    if (!singles.id) {
      console.error('No service ID found to delete.');
      return;
    }

    const data = { id: singles.id };
    setLoads(true);
    try {
      const res = await AuthPosturl(Apis.admins.delete_admin_faqs, data);
      setLoads(false);
      if (res.status) {
        setDel(false);
        setItems(prevItems => prevItems.filter(item => item.id !== singles.id));
        setFilteredItems(prevItems => prevItems.filter(item => item.id !== singles.id));
        ToastAlert('FAQs Deleted Successfully');
      } else {
        console.error('Error deleting FAQs:', res.data.text);
      }
    } catch (error) {
      console.error('Network request failed:', error);
      setLoads(false);
    }
  };

  const fetchFaqs = useCallback(async () => {
    try {
      const res = await AuthGeturl(Apis.admins.get_admin_faqs);
      if (res.status) {
        setItems(res.data.data);
        setFilteredItems(res.data.data);
        setTotal(res.data.total); // Ensure total is set
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (err) {
      console.error(err.message);
    }
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

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


  return (
    <AdminLayout>
      {del && <ConfirmDeleteFaqs confirmAction={confirmAction} closeView={() => setDel(false)} isLoading={loads} />}
      {view && <UpdateFaqs singles={singles} resendSignal={fetchFaqs} closeView={() => setView(!view)} />}
      <div className="md:mx-10 mx-2 mb-20">
        <div className="bg-white mt-10 px-5 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="font-medium text-lg">FAQs</div>
            
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
        <div className="flex items-start mb-10 justify-start ">
          <Table headers={TABLE_HEADERS} className='mt-10 bg-white'>
            {paginatedItems.map((member, index) => (
              <TableRow className='mb-10' key={index}>
                <TableData> {member.id} </TableData>
                <TableData><p className='mb-2.5'>{member.title}</p></TableData>
                <TableData>
                  <div dangerouslySetInnerHTML={{ __html: member.details }} />
                </TableData>
                <TableData>
                  <div className="flex gap-4 text-primary">
                    {admin.userlevel !== "4" && (
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
            <div className="mt-10 mx-5">
              {admin.userlevel !== "4" && (
                <Link to='/auth/admin/new-faq' className="bg-pink w-fit px-4 py-2 text-white rounded-md">
                  <button>Add FAQs</button>
                </Link>
              )}
            </div>
            <div className="w-full flex justify-center mt-4">
              <PaginationButton pageCount={pageCount} onPageChange={handlePageChange} />
            </div>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AllFaqs;