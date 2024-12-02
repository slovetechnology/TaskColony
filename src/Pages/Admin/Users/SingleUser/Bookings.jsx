import React, { useCallback, useEffect, useState } from 'react';
import AdminLayout from '../../../../Components/Admin/AdminLayout';
import { Link, useParams } from 'react-router-dom';
import { Apis, AuthGeturl } from '../../../../Components/General/Api';
import { Table } from '../../../../Components/Admin/Table/Table';
import PaginationButton from '../../../../Components/General/Pagination/PaginationButton';
import { TableRow } from '../../../../Components/Admin/Table/TableRow';
import { TableData } from '../../../../Components/Admin/Table/TableData';
import StatusTag from '../../../../Components/General/status-tag';
import { IoEyeSharp } from 'react-icons/io5';
import GigDetail from './GigDetail';

const TABLE_HEADERS = ['Id', 'Name', 'Service', 'Provider', 'Amount', 'Status', ''];
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

const Bookings = () => {
  const [view, setView] = useState(false);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [selectedGig, setSelectedGig] = useState(null);

  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem('currentPage');
    return savedPage ? parseInt(savedPage, 10) : 0; // Default to page 0 if not found
  });

  const fetchGigs = useCallback(async () => {
    try {
      const res = await AuthGeturl(`${Apis.admins.get_booking}`);
      if (res.status === true) {
        setGigs(res.data.data);
        setTotal(res.data.total || res.data.data.length);
      }
    } catch (err) {
      console.error('Failed to fetch gigs data:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage); // Save current page to localStorage
  }, [currentPage]);

  const pageCount = Math.ceil(total / DEFAULT_PER_PAGE);
  const currentGigs = gigs.slice(currentPage * DEFAULT_PER_PAGE, (currentPage + 1) * DEFAULT_PER_PAGE);

  const handlePageChange = (val) => {
    setCurrentPage(val.selected);
  };

  const showGigDetail = (gig) => {
    setSelectedGig(gig);
    setView(true);
  };

  return (
    <div className="">
      {view && selectedGig && (
        <GigDetail
          gig={selectedGig}
          closeView={() => {
            setView(false);
            setSelectedGig(null); // Reset selected gig on close
          }}
        />
      )}
      {loading ? (
        <div className="text-center flex items-center justify-center w-full h-screen text-lg font-semibold">
          Loading gigs...
        </div>
      ) : currentGigs.length > 0 ? (
        <div className="flex flex-col items-start mb-10 justify-start">
          <Table headers={TABLE_HEADERS} className="bg-white">
            {currentGigs.map((gig) => (
              <TableRow key={gig.id}>
                <TableData>{gig.id}</TableData>
                <TableData>{gig.ufname} {gig.ulname}</TableData>
                <TableData>{gig.service_name}</TableData>
                <TableData>{gig.pfname} {gig.plname}</TableData>
                <TableData>{gig.amt_paid}</TableData>
                <TableData>
                  <StatusTag
                    variant={statusToVariant[gig.status_text.toLowerCase()]}
                    size="small"
                    className="w-full"
                  >
                    {gig.status_text}
                  </StatusTag>
                </TableData>
                <TableData>
                  <div className="flex gap-4 text-primary">
                    <div className="cursor-pointer" onClick={() => showGigDetail(gig)}><IoEyeSharp /></div>
                  </div>
                </TableData>
              </TableRow>
            ))}
          </Table>
          <div className="w-full flex justify-start mt-4">
            <PaginationButton pageCount={pageCount} onPageChange={handlePageChange} />
          </div>
        </div>
      ) : (
        <div className="text-center text-lg font-semibold">
          No gigs found.
        </div>
      )}
    </div>
  );
};

export default Bookings;