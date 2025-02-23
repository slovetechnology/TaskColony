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
import { formatDate } from '../../../utils/utils';

// ✅ FIX: Install recharts if not installed:
// Run this in your terminal: npm install recharts

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const TABLE_HEADERS = ['Date', 'Total Services', 'Profits', 'Tax Fee'];
const DEFAULT_PER_PAGE = 10;

const AllEarning = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
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
      console.error('Fetch Error:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = items.filter((item) =>
      item.date.toLowerCase().includes(value) ||
      item.total_services.toString().includes(value) ||
      item.total_profit.toString().includes(value) ||
      item.total_tax_paid.toString().includes(value)
    );

    setFilteredItems(filtered);
  };

  const totalItems = filteredItems.length;
  const pageCount = Math.ceil(totalItems / DEFAULT_PER_PAGE);

  const paginatedItems = filteredItems.slice(
    currentPage * DEFAULT_PER_PAGE,
    (currentPage + 1) * DEFAULT_PER_PAGE
  );

  const handlePageChange = (val) => setCurrentPage(val.selected);

  return (
    <AdminLayout>
      <div className="md:mx-10 mx-2 mb-20">
        {/* Search Bar */}
        <div className="bg-white mt-10 px-5 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="font-medium text-lg">Daily Earning</div>
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
              <span className="text-primary text-2xl cursor-pointer" onClick={() => setSearchTerm('')}><GiCancel /></span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="md:grid md:grid-cols-3 mt-8 gap-5">
          {[
            { title: 'All Time Profit', value: allProfit, from: '#4797BD', to: '#63C2AB' },
            { title: 'Last Month', value: lastMonthSum, from: '#3626E3', to: '#72FF13' },
            { title: 'Present Month', value: presentMonth, from: '#FF3D3D', to: '#FFBC0A' },
          ].map((card, i) => (
            <div key={i} className={`h-[13rem] text-white rounded-xl xl:w-[20rem] bg-gradient-to-r px-6 py-14 mb-2 from-[${card.from}] to-[${card.to}]`}>
              <p className="text-base">{card.title}</p>
              <div className="flex mt-5 items-center justify-between">
                <p className="text-5xl font-medium">{card.value}</p>
                <div className="bg-white p-3 rounded-full text-xl text-orange-500">
                  <GoArrowUpRight />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Earnings Chart */}
        <div className="bg-white p-6 rounded-lg mt-10 shadow-md">
          <h2 className="text-lg font-semibold mb-4">Earnings Overview</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={filteredItems}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis />
              <Tooltip labelFormatter={(value) => `Date: ${formatDate(value)}`} />
              <Legend />
              <Line type="monotone" dataKey="total_profit" stroke="#4797BD" name="Profit" strokeWidth={2} />
              <Line type="monotone" dataKey="total_services" stroke="#FF3D3D" name="Services" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Earnings Table */}
        <div className="flex items-start mb-10 justify-start w-full">
          <Table headers={TABLE_HEADERS} className="mt-10 bg-white">
            {paginatedItems.map((member, index) => (
              <TableRow key={index} className="mb-10">
                <TableData>{formatDate(member.date)}</TableData>
                <TableData>{member.total_services}</TableData>
                <TableData>{member.total_profit}</TableData>
                <TableData>{member.total_tax_paid}</TableData>
              </TableRow>
            ))}
            <div className="w-full flex justify-end items-end mt-4">
              <PaginationButton pageCount={pageCount} onPageChange={handlePageChange} />
            </div>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AllEarning;
