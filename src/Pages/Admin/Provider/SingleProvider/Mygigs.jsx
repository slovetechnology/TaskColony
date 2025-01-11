import { useCallback, useEffect, useState } from "react";
import { ToastAlert } from "../../../../Components/General/Utils";
import AdminLayout from "../../../../Components/Admin/AdminLayout";
import { Table } from "../../../../Components/Admin/Table/Table";
import { TableRow } from "../../../../Components/Admin/Table/TableRow";
import { TableData } from "../../../../Components/Admin/Table/TableData";
import StatusTag from "../../../../Components/General/status-tag";
import PaginationButton from "../../../../Components/General/Pagination/PaginationButton";
import { Apis, AuthGeturl } from "../../../../Components/General/Api";
import { useParams } from "react-router-dom";

const TABLE_HEADERS = ['Name', 'Service', 'Provider', 'Amount', 'Status', '', '', ''];
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

const Mygigs = ({trackid}) => {
  // const { trackid } = useParams(); // Destructure trackid
  const [query, setQuery] = useState({ pageNumber: 1 });
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
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
        const res = await AuthGeturl(`${Apis.admins.get_booking}?page_no=${pageNo}&no_perpage=${perPage}&provider_tid=${trackid}`); // Use provider_tid here

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
  }, [trackid]); // Add trackid to dependencies

  useEffect(() => {
    getAllBooking();
  }, [getAllBooking]);

  return (
    <div className=" mb-10">
      <div className="flex items-start mb-10 justify-start">
        <Table
          headers={TABLE_HEADERS}
          className="mt-1 bg-white"
          onPageChange={getSelectedPage}
          pageCount={pageCount}
        >
          {(Array.isArray(paginatedItems) ? paginatedItems : Object.values(paginatedItems)).map(
            (member, index) => (
              <TableRow className="mb-10" key={index}>
                <TableData className="flex gap-2 items-center">
                
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
              </TableRow>
            )
          )}
          <div className="w-full flex justify-center mt-4">
            <PaginationButton pageCount={pageCount} onPageChange={handlePageChange} />
          </div>
        </Table>
      </div>
    </div>
  );
};

export default Mygigs;