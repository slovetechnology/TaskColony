import React, { useCallback, useEffect, useState } from 'react';
import AdminLayout from '../../../../Components/Admin/AdminLayout';
import { Link, useParams } from 'react-router-dom';
import { Apis, AuthGeturl } from '../../../../Components/General/Api';
import { Table } from '../../../../Components/Admin/Table/Table';
import PaginationButton from '../../../../Components/General/Pagination/PaginationButton';
import { TableRow } from '../../../../Components/Admin/Table/TableRow';
import { TableData } from '../../../../Components/Admin/Table/TableData';
const TABLE_HEADERS = ['Name', 'Service', 'Provider', 'Amount', 'Status', '', '', ''];
const DEFAULT_PER_PAGE = 10;

const Reviews = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchUser = useCallback(async () => {
    try {
      const res = await AuthGeturl(`${Apis.admins.get_provider}/${userId}`);
      if (res.status === true) {
        setUser(res.data.data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, []);
  const pageCount = Math.ceil(total / DEFAULT_PER_PAGE);
  const handlePageChange = (val) => {
    setCurrentPage(val.selected);
  };


  return (
    <div className="">
      <div className="flex items-start mb-10 justify-start">
        <Table
          headers={TABLE_HEADERS}
          className=" bg-white"
          pageCount={pageCount}
        >
          <TableRow>

          </TableRow>
          <TableData>l</TableData>
          <div className=" w-full flex justify-center mt-4">
            <PaginationButton pageCount={pageCount} onPageChange={handlePageChange} />
          </div>
        </Table>
      </div>
    </div>
  );
};

export default Reviews;