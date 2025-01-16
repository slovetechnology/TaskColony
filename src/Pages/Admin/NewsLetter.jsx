import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from "../../Components/Admin/AdminLayout";
import { TableData } from "../../Components/Admin/Table/TableData";
import { TableRow } from "../../Components/Admin/Table/TableRow";
import { Apis, AuthGeturl } from "../../Components/General/Api";
import { ToastAlert } from "../../Components/General/Utils";
import { FaSearch } from 'react-icons/fa';
import { HiOutlineAdjustments } from 'react-icons/hi';
import { GiCancel } from 'react-icons/gi';
import PaginationButton from '../../Components/General/Pagination/PaginationButton';
import { Table } from '../../Components/Admin/Table/Table';
import * as XLSX from 'xlsx';

const TABLE_HEADERS = ['Id', 'Email', ''];
const DEFAULT_PER_PAGE = 10;

const NewsLetter = () => {
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const pageCount = Math.ceil(total / DEFAULT_PER_PAGE);

  const paginatedItems = filteredItems.slice(
    currentPage * DEFAULT_PER_PAGE,
    (currentPage + 1) * DEFAULT_PER_PAGE
  );

  const handlePageChange = (val) => {
    setCurrentPage(val.selected);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = items.filter(item =>
      item.email.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredItems(filtered);
    setCurrentPage(0); // Reset to first page on search
  };

  const getAllNewsLetterUsers = useCallback(async () => {
    let allUsers = [];
    let pageNo = 1;
    const perPage = 15; // Match backend page size
    let totalPages = 1;

    try {
      while (pageNo <= totalPages) {
        const res = await AuthGeturl(`${Apis.admins.get_newsletter_users}?page_no=${pageNo}&no_perpage=${perPage}`);

        if (res.status === true) {
          const fetchedItems = res.data.data;
          totalPages = res.data.totalpage;

          if (Array.isArray(fetchedItems)) {
            allUsers = [...allUsers, ...fetchedItems];
          }
        } else {
          throw new Error('Failed to fetch users.');
        }

        pageNo++;
      }

      setItems(allUsers);
      setFilteredItems(allUsers);
      setTotal(allUsers.length);
    } catch (err) {
      console.error(err.message);
      ToastAlert('Error fetching newsletter users.');
    }
  }, []);

  useEffect(() => {
    getAllNewsLetterUsers();
  }, [getAllNewsLetterUsers]);

  const downloadFile = (format) => {
    // Use 'items' instead of 'filteredItems' to download all data
    let dataToDownload = items.map((item) => ({
      Id: item.id,
      Email: item.email,
    }));

    if (format === 'csv') {
      const csvContent = `data:text/csv;charset=utf-8,${dataToDownload.map(e => `${e.Id},${e.Email}`).join('\n')}`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "newsletter_users.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'txt') {
      const txtContent = dataToDownload.map(e => `Id: ${e.Id}, Email: ${e.Email}`).join('\n');
      const blob = new Blob([txtContent], { type: 'text/plain' });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = 'newsletter_users.txt';
      link.click();
    } else if (format === 'xlsx') {
      const ws = XLSX.utils.json_to_sheet(dataToDownload);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Newsletter Users");
      XLSX.writeFile(wb, "newsletter_users.xlsx");
    }
  };

  return (
    <AdminLayout>
      <div className="lg:mx-10 mx-2 mb-10">
        <div className="bg-white mt-10 px-5 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="font-medium text-lg">All Newsletter Users</div>
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
        <div className="mt-5">
          <div className="flex gap-2">
            <button onClick={() => downloadFile('csv')} className="text-white py-2 px-3 bg-secondary">Download CSV</button>
            <button onClick={() => downloadFile('txt')} className="text-white py-2 px-3 bg-secondary">Download TXT</button>
            <button onClick={() => downloadFile('xlsx')} className="text-white py-2 px-3 bg-secondary">Download XLSX</button>
          </div>
        </div>
        <div className="flex items-start mb-10 justify-start">
          <Table headers={TABLE_HEADERS} className="mt-10 bg-white">
            {paginatedItems.map((member, index) => (
              <TableRow className="mb-10" key={index}>
                <TableData>{member.id}</TableData>
                <TableData>{member.email}</TableData>
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

export default NewsLetter;