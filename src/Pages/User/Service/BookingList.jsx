import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaSearch } from 'react-icons/fa';
import { SlArrowLeft } from 'react-icons/sl';
import Layout from '../../../Components/User/Layout';
import { Apis, AuthGeturl, AuthPosturl } from '../../../Components/General/Api';
import EditBooking from './EditBooking';
import notfound from '../../../assets/404.png';
import { ToastAlert } from '../../../Components/General/Utils';

const BookingList = () => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editbookings, setEditBooking] = useState(false);
  const [singles, setSingles] = useState({}); // Store the selected single booking
  const [loads, setLoads] = useState(false);


  // Fetch all bookings from the API
  const fetchAllBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await AuthGeturl(Apis.users.get_booking);
      if (res.status === true) {
        setItems(res.data.data);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);
  const BookingCompleted = async (bookingId) => {
    if (!bookingId) {
      ToastAlert('No Booking found.');
      return;
    }

    const data = { booking_id: bookingId };
    setLoads(true);
    try {
      const res = await AuthPosturl(Apis.users.complete_gig, data);
      setLoads(false);
      if (res.status === true) {
        // Update the booking state to reflect the change
        setItems(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Completed' } : b));
        ToastAlert('Task updated successfully.');
      } else {
        ToastAlert(res.text);
      }
    } catch (error) {
      setLoads(false);
      ToastAlert('Error updating task');
    }
  };
  // Close the EditBooking modal
  const handleCloseEdit = () => {
    setEditBooking(false);
  };


  const SingleItem = (val) => {
    setSingles(val);
    setEditBooking(true);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter: Status checkbox
  const statusHandleCheckboxChange = (status) => {
    setSelectedStatus(selectedStatus === status ? null : status);
  };

  // Handle filter: Payment status checkbox
  const handleCheckboxChange = (status) => {
    setSelectedPayment((prev) => (prev === status ? null : status));
  };

  // Filter items based on search term, status, and payment status
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus ? item.status === selectedStatus : true;
    const matchesPayment = selectedPayment
      ? item.paid_with?.toLowerCase() === selectedPayment.toLowerCase()
      : true;

    return matchesSearch && matchesStatus && matchesPayment;
  });


  return (
    <Layout>
      {editbookings && (
        <EditBooking
          singles={singles}
          closeView={handleCloseEdit}
        />
      )}

      <div className="bg-gray w-full xl:h-[10rem]">
        <div className="text-center py-10 pt-10">
          <p className="font-[500] text-4xl mb-3">Booking List</p>
          <span className="flex items-center gap-4 font-[500] justify-center">
            <p className="text-primary">Home</p>
            <span className="bg-[#6C757D] w-3 py-0.5"></span>
            <p className="text-secondary">Booking List</p>
          </span>
        </div>
      </div>

      <div className="w-[90%] mx-auto">
        <div className="flex w-full items-center justify-end">
          <div className="font-[500] flex items-center my-7 gap-1">
            <Link className="bg-secondary py-2 md:px-4 px-2 rounded-md text-white" to="/new-booking">
              New Booking
            </Link>
          </div>
          <div>
          </div>
        </div>

        <div className="gap-10 md:flex">
          <div className="mb-10 overflow-y-auto scrollsdown w-full h-[35rem]">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, i) => (
                <div key={i} className="w-full xl:flex flex-grow mb-4 gap-5 p-3 border xl:h-[19rem] rounded-xl">
                  <div className="w-full xl:w-[20rem]">
                    <img
                      src={item.imageslink?.[0] || notfound}
                      alt={item.title}
                      className="w-full h-[14rem] xl:h-[14rem] mb-3 xl:mb-0 rounded-xl object-cover"
                    />
                  </div>
                  <div className="w-full">
                    <div className="flex items-start w-full justify-between">
                      <p className="text-lg font-[500]">{item.service_name}</p>
                      {/* Conditional rendering for Edit Booking */}
                      {item.status === 'Pending' && (
                        <div
                          onClick={() => SingleItem(item)}
                          className="flex items-center text-xs font-[500] cursor-pointer gap-2 text-secondary"
                        >
                          Edit Booking <span className="text-primary"><FaEdit /></span>
                        </div>
                      )}
                    </div>
                    <div className="border-b pt-5 md:pb-10 pb-3">
                      <p className="text-primary text-xs">
                        <span className="font-[500] text-sm text-black">Location</span>: {item.address}
                      </p>
                      <div className="md:grid md:grid-cols-2 text-primary text-xs mt-2 gap-2">
                        <p className='mb-2 md:mb-0'>
                          <span className="font-[500] text-sm text-black">Date</span>: {item.the_date}
                        </p>
                        <p className='mb-2 md:mb-0'>
                          <span className="font-[500] text-sm text-black">Time</span>: {item.the_time}
                        </p>
                        <p className='mb-2 md:mb-0'>
                          <span className="font-[500] text-sm text-black">Payment Status</span>: {item.paid_with}
                        </p>
                        <p className='mb-2 md:mb-0'>
                          <span className="font-[500] text-sm text-black">Service Status</span>: {item.status}
                        </p>
                        <p className='mb-2 md:mb-0'>
                          <span className="font-[500] text-sm text-black">Provider</span>: {item.pfname} {item.plname}
                        </p>
                        <p className='mb-2 md:mb-0'>
                          <span className="font-[500] text-sm text-black">Coupon</span>: ${item.couponvalue}
                        </p>

                      </div>
                    </div>
                    <div className="flex font-[500] pt-8 gap-3">
                      <div className="bg-secondary py-1 px-4 rounded-md text-white">
                        <Link className="" to={`/booking-detail/${item.id}`}>
                          View
                        </Link>
                      </div>
                      {/* Show "Mark as Completed" only if the status is "Done" */}
                      {item.status === 'Done' && (
                        <div className="bg-secondary py-1 cursor-pointer px-4 rounded-md text-white" onClick={() => BookingCompleted(item.id)}>
                          Mark as Completed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='flex items-center justify-center'>
                {/* <img src={notfound} alt="Not Found" className="h-[30rem] object-contain w-full" /> */}
                <div className="text-center text-xl font-semibold">You have no Bookings</div>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="bg-gray h-[37rem] xl:w-[40%] rounded-xl overflow-y-auto flex flex-col mb-10 justify-between">
            <form className="w-full h-full px-6 py-5">
              <div className="my-5 font-[500] text-xl">Filter By</div>

              <div className="mb-5">
                <label className="bg-white gap-[10px] text-white flex items-center border-primary rounded-md w-full">
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full bg-transparent placeholder:text-xs pl-3 text-black placeholder:text-primary outline-none"
                  />
                  <FaSearch className="bg-secondary p-2 w-12 h-10 rounded-tr-md rounded-br-md" />
                </label>
              </div>

              <div className="mt-5">
                <div className="border-t border-[#EBEBEB] font-[500] text-lg">Status</div>
                <div className="flex flex-col text-base text-primary gap-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedStatus === 'Pending'}
                      onChange={() => statusHandleCheckboxChange('Pending')}
                      className="mr-2 my-2"
                    />
                    Pending
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedStatus === 'Ongoing'}
                      onChange={() => statusHandleCheckboxChange('Ongoing')}
                      className="mr-2 my-2"
                    />
                    Ongoing
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedStatus === 'Completed'}
                      onChange={() => statusHandleCheckboxChange('Completed')}
                      className="mr-2 my-2"
                    />
                    Completed
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedStatus === 'Accepted'}
                      onChange={() => statusHandleCheckboxChange('Accepted')}
                      className="mr-2 my-2"
                    />
                    Accepted
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedStatus === 'Done'}
                      onChange={() => statusHandleCheckboxChange('Done')}
                      className="mr-2 my-2"
                    />
                    Done
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedStatus === 'Canceled'}
                      onChange={() => statusHandleCheckboxChange('Canceled')}
                      className="mr-2 my-2"
                    />
                    Canceled
                  </label>
                </div>
              </div>

              <div className="mt-5">
                <div className="border-t border-[#EBEBEB] py-3 font-[500] text-lg">Payment Status</div>
                <div className="flex flex-col text-base text-primary gap-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedPayment === 'wallet'}
                      onChange={() => handleCheckboxChange('wallet')}
                      className="mr-2 my-2"
                    />
                    wallet
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedPayment === 'card'}
                      onChange={() => handleCheckboxChange('card')}
                      className="mr-2 my-2"
                    />
                    Card
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedPayment === 'not paid'}
                      onChange={() => handleCheckboxChange('not paid')}
                      className="mr-2 my-2"
                    />
                    Not Paid
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingList;