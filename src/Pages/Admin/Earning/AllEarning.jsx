import React, { useCallback, useState, useEffect } from 'react';
import AdminLayout from '../../../Components/Admin/AdminLayout';
import { FaSearch } from 'react-icons/fa';
import { GiCancel } from 'react-icons/gi';
import { HiOutlineAdjustments } from 'react-icons/hi';
import { Table } from '../../../Components/Admin/Table/Table';
import { TableRow } from '../../../Components/Admin/Table/TableRow';
import { TableData } from '../../../Components/Admin/Table/Index';
import PaginationButton from '../../../Components/General/Pagination/PaginationButton';
import { Apis, AuthGeturl } from '../../../Components/General/Api';
import { GoArrowUpRight } from 'react-icons/go';

const TABLE_HEADERS = ['Date', 'Total Services', 'Profits', 'Tax Fee'];
const DEFAULT_PER_PAGE = 10;

const AllEarning = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState(null);
  const [lastMonthSum, setLastMonthSum] = useState(0); 
  const [allProfit, setAllProfit] = useState(0); 
  const [presentMonth, setPresentMonth] = useState(0); 
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEarnings = useCallback(async () => {
    try {
      const res = await AuthGeturl(Apis.admins.get_admin_earning);
      if (res.status === true) {
        setItems(res.data.data);
        setFilteredItems(res.data.data);
        setLastMonthSum(res.data.lastmonth_sum);
        setPresentMonth(res.data.currentmonth_sum);
        setAllProfit(res.data.all_time_sum);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = items.filter(item =>
      item.date.toLowerCase().includes(value) ||
      item.total_services.toString().toLowerCase().includes(value) ||
      item.total_profit.toString().toLowerCase().includes(value) ||
      item.total_tax_paid.toString().toLowerCase().includes(value)
    );

    setFilteredItems(filtered);
  };

  const totalItems = filteredItems.length;
  const pageCount = Math.ceil(totalItems / DEFAULT_PER_PAGE);

  const paginatedItems = filteredItems.slice(
    currentPage * DEFAULT_PER_PAGE,
    (currentPage + 1) * DEFAULT_PER_PAGE
  );

  const handlePageChange = (val) => {
    setCurrentPage(val.selected);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <AdminLayout>
      <div className="mx-10 mb-20">
        <div className="bg-white mt-10 px-5 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="font-medium text-lg">Daily Earning</div>
            <div className="flex items-center gap-5">
              <label className='border gap-[10px] text-[#9C9C9C] items-center py-2.5 px-3 border-[#F5F5F5] rounded-md'>
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
        <div className="grid grid-cols-3 mt-8 gap-5">
          <div>
            <div className="h-[13rem] text-white rounded-xl xl:w-[20rem] bg-gradient-to-r px-6 py-14 from-[#4797BD] to-[#63C2AB]">
              <p className="text-base">All Time Profit</p>
              <div className="flex mt-5 items-center justify-between">
                <p className="text-5xl font-medium ">{allProfit}</p>
                <div className="bg-white p-3 rounded-full text-xl text-orange-500">
                  <GoArrowUpRight />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="h-[13rem] text-white rounded-xl xl:w-[20rem] bg-gradient-to-r px-6 py-14 from-[#3626E3] to-[#72FF13]">
              <p className="text-base">Last Month</p>
              <div className="flex mt-5 items-center justify-between">
                <p className="text-5xl font-medium ">{lastMonthSum}</p>
                <div className="bg-white p-3 rounded-full text-xl text-orange-500">
                  <GoArrowUpRight />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="h-[13rem] text-white rounded-xl xl:w-[20rem] bg-gradient-to-r px-6 py-14 from-[#FF3D3D] to-[#FFBC0A]">
              <p className="text-base">Present Month</p>
              <div className="flex mt-5 items-center justify-between">
                <p className="text-5xl font-medium ">{presentMonth}</p>
                <div className="bg-white p-3 rounded-full text-xl text-orange-500">
                  <GoArrowUpRight />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-start mb-10 justify-start w-full">
          <Table headers={TABLE_HEADERS} className="mt-10 bg-white">
            {paginatedItems.map((member, index) => (
              <TableRow className="mb-10" key={index}>
                <TableData>{member.date}</TableData>
                <TableData>{member.total_services}</TableData>
                <TableData>{member.total_profit}</TableData>
                <TableData>{member.total_tax_paid}</TableData>
              </TableRow>
            ))}
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

export default AllEarning;