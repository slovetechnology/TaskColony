import React, { useCallback, useState, useEffect } from 'react';
import { FaPhoneVolume, FaRegStar, FaStar } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { AiOutlineMessage } from 'react-icons/ai';
import { LuPhoneCall } from 'react-icons/lu';
import img5 from '../../../assets/profile.png';
import tv from '../../../assets/tv.png';
import moment from 'moment';
import ConfirmCancelBooking from './CancelBooking';
import { ToastAlert } from '../../../Components/General/Utils';
import { Apis, AuthGeturl, AuthPosturl } from '../../../Components/General/Api';
import { useNavigate } from 'react-router-dom';

// Function to format time to 12-hour format
const convertTimeTo12HourFormat = (time) => {
  const [hour, minute] = time.split(':');
  const hourIn12 = hour % 12 || 12;
  const ampm = hour < 12 ? 'AM' : 'PM';
  return `${hourIn12}:${minute} ${ampm}`;
};

const ConfirmBooking = ({ bookingData }) => {
  const [del, setDel] = useState(false);
  const [singles, setSingles] = useState({});
  const [loads, setLoads] = useState(false);
  const [items, setItems] = useState([]);
  const [trackid, setTrackid] = useState(null); // State to store trackid of a specific booking
  const navigate = useNavigate()
  // Format date and time (e.g., December 12th, 2024)
  const formattedDate = moment(bookingData.date).format('MMMM Do YYYY');
  const formattedTime = convertTimeTo12HourFormat(bookingData.time); // Convert to 12-hour format with AM/PM

  const DeleteItem = (member) => {
    setDel(true);
    setSingles(member);
  };

  const confirmBooking = () => {
    ToastAlert('Booking Created successfully')
    setTimeout(() => {
      window.location.href = '/booking-list'
    }, 2000);
  }
  // Fetch all bookings
  const fetchAllBookings = useCallback(async () => {
    try {
      const res = await AuthGeturl(Apis.users.get_booking);
      if (res.status === true) {
        setItems(res.data.data);
        if (res.data.data && res.data.data.length > 0) {
          // Select the trackid of the first booking (or you can choose a specific one)
          setTrackid(res.data.data[0].trackid);
        }
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (err) {
      ToastAlert(err.message);
    }
  }, []);

  // Call fetchAllBookings on component mount
  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

  // Confirm action to cancel booking
  const confirmAction = async () => {
    if (!trackid) {
      ToastAlert('No Booking Found.');
      return;
    }

    const data = { trackid }; // Use trackid from the state
    setLoads(true);
    try {
      const res = await AuthPosturl(Apis.users.cancel_bookings, data);
      setLoads(false);
      if (res.status === true) {
        setDel(false);
        fetchAllBookings(); // Re-fetch bookings after confirming action
        navigate('/booking-list')
      } else {
        ToastAlert('Failed to delete booking.');
      }
    } catch (error) {
      setLoads(false);
      ToastAlert('Error deleting booking.');
    }
  };

  // return (
  //   <div className="gap-10 mt-10 mb-40 mx-10 lg:flex">
  //     {del && (
  //       <ConfirmCancelBooking
  //         confirmAction={confirmAction}
  //         closeView={() => setDel(false)}
  //         isLoading={loads}
  //       />
  //     )}
  //     <div className="lg:w-[70%]">
  //       <img
  //         src={bookingData.image}
  //         alt="Service"
  //         className="w-full rounded-3xl object-cover h-[15rem] md:h-[23rem]"
  //       />
  //       <div>
  //         <div className="flex justify-between mt-10 mb-3 font-[500]">
  //           <p className="md:text-3xl">{bookingData.job_title}</p>
  //         </div>
  //         <div>
  //           <p className="text-primary text-xs">
  //             <span className="font-[500] text-sm text-black">Location</span>: {bookingData.address}
  //           </p>
  //           <div className="md:flex gap-10 mt-2">
  //             <p className="text-primary text-xs">
  //               <span className="font-[500] text-sm text-black">Time</span>: {formattedTime}
  //             </p>
  //             <p className="text-primary text-xs">
  //               <span className="font-[500] text-sm text-black">Date</span>: {formattedDate}
  //             </p>
  //           </div>
  //           <div className="mt-6 mb-8">
  //             <span className="font-[500] pb-1 w-full text-sm text-black">Description</span>
  //             <p className="text-primary text-xs">{bookingData.description}</p>
  //           </div>
  //         </div>
  //       </div>
  //     </div>

  //     <div className="bg-gray lg:w-[30%] p-10 rounded-xl">
  //       <div>
  //         <p className="font-[500] text-2xl">Price Detail</p>
  //         <div className="bg-white rounded-xl py-2 mt-2 h-[15rem]">
  //           <div className="h-[28rem] px-6">
  //             <div className="text-xs">
  //               <div className="flex border-b items-center justify-between gap-5 my-5">
  //                 <div className="font-medium text-base">Price</div>
  //                 <div className="">${bookingData.price}</div>
  //               </div>
  //               <div className="flex items-center justify-between gap-5 my-5">
  //                 <div className="font-medium text-base">Total Amount</div>
  //                 <div className="text-secondary">${bookingData.price}</div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>

  //         <div className="flex flex-col font-[500] md:mt-10 mt-5 items-center justify-center">
  //           <div className="bg-secondary w-full text-center text-white rounded-lg py-4">
  //             <button onClick={confirmBooking}>Confirm Booking</button>
  //           </div>
  //           <div onClick={() => DeleteItem(bookingData)} className="mt-3 text-secondary">
  //             <button>Cancel Booking</button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="gap-10 mt-10 mb-40 mx-10 lg:flex">
      {del && (
        <ConfirmCancelBooking
          confirmAction={confirmAction}
          closeView={() => setDel(false)}
          isLoading={loads}
        />
      )}
      <div className="lg:w-[70%]">
        {/* Display the first image */}
        {bookingData.firstImage && (
          <img
            src={bookingData.firstImage}
            alt="Service"
            className="w-full rounded-3xl object-cover h-[15rem] md:h-[23rem]"
          />
        )}
        <div>
          <div className="flex justify-between mt-10 mb-3 font-[500]">
            <p className="md:text-3xl">{bookingData.job_title}</p>
          </div>
          <div>
            <p className="text-primary text-xs">
              <span className="font-[500] text-sm text-black">Location</span>: {bookingData.address}
            </p>
            <div className="md:flex gap-10 mt-2">
              <p className="text-primary text-xs">
                <span className="font-[500] text-sm text-black">Time</span>: {formattedTime}
              </p>
              <p className="text-primary text-xs">
                <span className="font-[500] text-sm text-black">Date</span>: {formattedDate}
              </p>
            </div>
            <div className="mt-6 mb-8">
              <span className="font-[500] pb-1 w-full text-sm text-black">Description</span>
              <p className="text-primary text-xs">{bookingData.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray lg:w-[30%] p-10 rounded-xl">
        <div>
          <p className="font-[500] text-2xl">Price Detail</p>
          <div className="bg-white rounded-xl py-2 mt-2 h-[15rem]">
            <div className="h-[28rem] px-6">
              <div className="text-xs">
                <div className="flex border-b items-center justify-between gap-5 my-5">
                  <div className="font-medium text-base">Price</div>
                  <div className="">${bookingData.price}</div>
                </div>
                <div className="flex items-center justify-between gap-5 my-5">
                  <div className="font-medium text-base">Total Amount</div>
                  <div className="text-secondary">${bookingData.price}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col font-[500] md:mt-10 mt-5 items-center justify-center">
            <div className="bg-secondary w-full text-center text-white rounded-lg py-4">
              <button onClick={confirmBooking}>Confirm Booking</button>
            </div>
            <div onClick={() => DeleteItem(bookingData)} className="mt-3 text-secondary">
              <button>Cancel Booking</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ConfirmBooking;
