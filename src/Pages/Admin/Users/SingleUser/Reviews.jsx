import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Apis, AuthGeturl, AuthPosturl } from '../../../../Components/General/Api';
import { Table } from '../../../../Components/Admin/Table/Table';
import PaginationButton from '../../../../Components/General/Pagination/PaginationButton';
import { TableRow } from '../../../../Components/Admin/Table/TableRow';
import { TableData } from '../../../../Components/Admin/Table/TableData';
import { ImCancelCircle } from 'react-icons/im';
import ConfirmDeleteReview from './DeleteReview';
import { ToastAlert } from '../../../../Components/General/Utils';

const TABLE_HEADERS = ['Id', 'Provider', 'Service', 'Review', ''];
const DEFAULT_PER_PAGE = 10;

const Reviews = ({ trackid }) => {
  const { userId } = useParams();
  const [reviews, setReviews] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [del, setDel] = useState(false);
  const [loads, setLoads] = useState(false);
  const [singles, setSingles] = useState({});

  const DeleteItem = (member) => {
    setDel(true);
    setSingles(member);
  };

  const fetchUser = useCallback(async () => {
    try {
      const res = await AuthGeturl(`${Apis.admins.get_admin_reviews}?&provider_tid=${trackid}`);
      if (res.status === true) {
        setReviews(res.data.data);
        setTotal(res.data.total || res.data.data.length); // Set total if available
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

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

  const pageCount = Math.ceil(total / DEFAULT_PER_PAGE);
  const handlePageChange = (val) => {
    setCurrentPage(val.selected);
  };

  const currentReviews = reviews.slice(currentPage * DEFAULT_PER_PAGE, (currentPage + 1) * DEFAULT_PER_PAGE);

  const confirmAction = async () => {
    if (!singles.trackid) {
      ToastAlert('No Review Found.');
      return;
    }

    const data = { data_tid: singles.trackid };
    setLoads(true);
    try {
      const res = await AuthPosturl(Apis.admins.delete_admin_reviews, data);
      setLoads(false);
      if (res.status === true) {
        // Filter out the deleted review from the state
        setReviews((prevReviews) => prevReviews.filter((review) => review.trackid !== singles.trackid));
        setTotal((prevTotal) => prevTotal - 1); // Decrement total count
        setDel(false); // Close delete confirmation modal
      } else {
        ToastAlert('Failed to delete review.');
      }
    } catch (error) {
      setLoads(false);
      ToastAlert('Error deleting review.');
    }
  };

  return (
    <div className="">
      {del && (
        <ConfirmDeleteReview
          confirmAction={confirmAction}
          closeView={() => setDel(false)}
          isLoading={loads}
        />
      )}
      <div className="flex items-start mb-1 justify-start">
        {reviews.length === 0 ? (
          <div className="text-center fle items-center justify-center text-lg font-semibold">
            No Review found.
          </div>
        ) : (
          <Table headers={TABLE_HEADERS} className="bg-white">
            {currentReviews.map((item, i) => (
              <TableRow key={i}>
                <TableData>{item.trackid}</TableData>
                <TableData>{item.pfname}</TableData>
                <TableData>{item.service_name}</TableData>
                <TableData>
                  <ReviewWithReadMore review={item.review || ''} />
                </TableData>
                <TableData>
                  <div className="text-lg text-primary">
                    <div className="cursor-pointer" onClick={() => DeleteItem(item)}>
                      <ImCancelCircle />
                    </div>
                  </div>
                </TableData>
              </TableRow>
            ))}
          </Table>
        )}
      </div>
      <div className="w-full flex justify-start">
        {total > 0 && <PaginationButton pageCount={pageCount} onPageChange={handlePageChange} />}
      </div>
    </div>
  );
};

export default Reviews;
