import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaSearch } from 'react-icons/fa';
import { SlArrowLeft } from 'react-icons/sl';
import Layout from '../../../Components/User/Layout';
import { Apis, AuthGeturl } from '../../../Components/General/Api';
import EditBooking from './EditBooking';
import notfound from '../../../assets/404.png';
import ConfirmCancelBooking from './CancelBooking';

const BookingList = () => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editbookings, setEditBooking] = useState(false);
  const [singles, setSingles] = useState({}); // Store the selected single booking

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
    setSelectedPayment(selectedPayment === status ? null : status);
  };

  // Filter items based on search term, status, and payment status
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus ? item.status === selectedStatus : true;
    const matchesPayment = selectedPayment ? item.paymentStatus === selectedPayment : true;

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

      <div className="bg-gray w-full xl:h-[20rem]">
        <div className="text-center py-10 xl:pt-24">
          <p className="font-[500] text-4xl mb-3">Booking List</p>
          <span className="flex items-center gap-4 font-[500] justify-center">
            <p className="text-primary">Home</p>
            <span className="bg-[#6C757D] w-3 py-0.5"></span>
            <p className="text-secondary">Booking List</p>
          </span>
        </div>
      </div>

      <div className="w-[90%] mx-auto">
        <div className="flex w-full items-center justify-between">
          <div className="font-[500] flex items-center my-7 md:text-xl gap-1">
            <SlArrowLeft size={10} /> Booking List
          </div>
          <div>
            <Link className="bg-secondary py-2 md:px-4 px-2 md:text-xl rounded-md text-white" to="/new-booking">
              New Booking
            </Link>
          </div>
        </div>

        <div className="gap-10 xl:flex">
          {/* Booking List */}
          <div className="mb-10 overflow-y-auto scrollsdown w-full h-[35rem]">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, i) => (
                <div key={i} className="w-full md:flex mb-4 gap-5 p-3 border xl:h-[19rem] rounded-xl flex-grow">
                  <div className="w-full xl:w-[20rem]">
                    <img
                      src={item.imageslink?.[0] || notfound} // Show an image or fallback to notfound
                      alt={item.title}
                      className="w-full h-[14rem] xl:h-[14rem] mb-3 xl:mb-0 rounded-xl object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-start w-full justify-between">
                      <p className="text-lg font-[500]">{item.title}</p>
                      <div
                        onClick={() => SingleItem(item)} // Pass the selected booking to SingleItem
                        className="flex items-center text-xs font-[500] cursor-pointer gap-2 text-secondary"
                      >
                        Edit Booking <span className="text-primary"><FaEdit /></span>
                      </div>
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
                          <span className="font-[500] text-sm text-black">Rating </span>: {item.status}
                        </p>
                      </div>
                    </div>
                    <div className="flex font-[500] pt-8 gap-3">
                      <Link className="bg-secondary py-1 px-4 rounded-md text-white" to={`/booking-detail/${item.id}`}>
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>
                <img src={notfound} alt="Not Found" className="h-[30rem] object-contain w-full" />
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="bg-gray h-[35rem] xl:w-[40%] rounded-xl overflow-y-auto flex flex-col mb-10 justify-between">
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
                <div className="border-t border-[#EBEBEB] py-3 font-[500] text-lg">Status</div>
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
                      checked={selectedStatus === 'In Process'}
                      onChange={() => statusHandleCheckboxChange('In Process')}
                      className="mr-2 my-2"
                    />
                    In Progress
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedStatus === 'Done'}
                      onChange={() => statusHandleCheckboxChange('Done')}
                      className="mr-2 my-2"
                    />
                    Complete
                  </label>
                </div>
              </div>

              <div className="mt-5">
                <div className="border-t border-[#EBEBEB] py-3 font-[500] text-lg">Payment Status</div>
                <div className="flex flex-col text-base text-primary gap-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedPayment === 'Pending'}
                      onChange={() => handleCheckboxChange('Pending')}
                      className="mr-2 my-2"
                    />
                    Pending
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedPayment === 'In Process'}
                      onChange={() => handleCheckboxChange('In Process')}
                      className="mr-2 my-2"
                    />
                    In Progress
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedPayment === 'Done'}
                      onChange={() => handleCheckboxChange('Done')}
                      className="mr-2 my-2"
                    />
                    Complete
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