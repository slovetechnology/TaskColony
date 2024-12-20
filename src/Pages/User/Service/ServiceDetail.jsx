// import React, { useCallback, useEffect, useState } from 'react';
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import { FaPlus, FaStar, FaUserCircle } from 'react-icons/fa';
// import Layout from '../../../Components/User/Layout';
// import { Apis, AuthGeturl, AuthPosturl, Geturl } from '../../../Components/General/Api';
// import { LazyLoadImage } from 'react-lazy-load-image-component';
// import { useForm } from 'react-hook-form';
// import CalendarDays from '../../../Components/General/CalendarDays';
// import { useSelector } from 'react-redux';
// import { ErrorAlert } from '../../../Components/General/Utils';
// import ConfirmBooking from './ConfirmBooking';
// import moment from 'moment';
// import Popups from '../../../Components/General/Popups';
// const ServiceDetail = () => {
//   const { userid } = useParams();
//   const [service, setService] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [services, setServices] = useState([]);
//   const [cartegory, setCategory] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { userloggedin, user } = useSelector(state => state.data); // Pulling from Redux
//   const [states, setStates] = useState([]);
//   const [selectedDateTime, setSelectedDateTime] = useState({ date: null, time: null });
//   const [view, setView] = useState(1); // 1 = Booking Form, 2 = Confirm Booking
//   const [bookingData, setBookingData] = useState(null);

//   const [images, setImages] = useState([]);
//   const [location, setLocation] = useState({
//     address: '',
//     latitude: null,
//     longitude: null,
//   });
//   const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
//   const navigate = useNavigate();

//   const fetchService = useCallback(async () => {
//     try {
//       const res = await Geturl(`${Apis.users.get_system}/${userid}`);
//       if (res.status === true && res.data.all_services?.length > 0) {
//         const filteredService = res.data.all_services.find((item) => String(item.id) === String(userid));
//         if (filteredService) {
//           setService(filteredService);
//           // Set default image
//           setImage({
//             main: null, // No uploaded file yet
//             preview: null, // Start with no preview
//           });
//         } else {
//           setError('Service not found for this user.');
//         }
//       } else {
//         setError('No services available.');
//       }
//     } catch (err) {
//       console.error('Error fetching service details:', err);
//       setError('Failed to fetch service details.');
//     } finally {
//       setLoading(false);
//     }
//   }, [userid]);

//   useEffect(() => {
//     fetchService();
//   }, [fetchService]);

//   const fetchAllHome = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await Geturl(Apis.users.get_system);
//       if (res.status === true) {
//         setServices(res.data.random_services);
//         setCategory(res.data.categories);
//         setCities(res.data.cities);
//       } else {
//         console.log(error);
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchAllHome();
//   }, [fetchAllHome]);

//   const { register, handleSubmit, formState: { errors }, setValue } = useForm({
//     defaultValues: {
//       job_title: service?.name || '',
//       description: service?.description || '',
//     },
//   });

//   // Pre-fill the form fields when the service data is fetched
//   useEffect(() => {
//     if (service) {
//       setValue('job_title', service.name);
//       setValue('description', service.description);
//     }
//   }, [service, setValue]);

//   const fetchAllData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const categoryResponse = await Geturl(Apis.users.get_system);
//       if (categoryResponse.status === true) {
//         setCategories(categoryResponse.data.categories);
//       }

//       const stateResponse = await Geturl(Apis.users.get_system);
//       if (stateResponse.status === true) {
//         setStates(stateResponse.data.cities);
//       }

//       const serviceResponse = await Geturl(Apis.users.get_system);
//       if (serviceResponse.status === true) {
//         setServices(serviceResponse.data.all_services);
//       }
//     } catch (err) {
//       console.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const getUserGeoAddress = async () => {
//     if (!navigator.geolocation) {
//       ErrorAlert('Geolocation is not supported by your browser.');
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;
//         const apiKey = "AIzaSyAWrGaFeWRxxtjxUCZGG7naNmHtg0RK88o"; // Replace with your API key
//         try {
//           const response = await fetch(
//             `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
//           );
//           const data = await response.json();
//           if (data.status === "OK" && data.results.length > 0) {
//             setLocation({
//               address: data.results[0].formatted_address,
//               latitude,
//               longitude,
//             });
//           } else {
//           }
//         } catch (error) {

//         }
//       },
//       (error) => {
//         ErrorAlert(`Error fetching location: ${error.message}`);
//       }
//     );
//   };
//   useEffect(() => {
//     fetchAllData();
//   }, [fetchAllData]);

//   const convertTimeTo12HourFormat = (time) => {
//     const [hour, minute] = time.split(':');
//     const hourIn12 = hour % 12 || 12;
//     const ampm = hour < 12 ? 'AM' : 'PM';
//     return `${hourIn12}:${minute} ${ampm}`;
//   };

//   const onSubmit = async (data) => {
//     if (!userloggedin) {
//       // If the user is not logged in, show an error and redirect
//       ErrorAlert('You must be logged in to complete the booking.');
//       setTimeout(() => {
//         navigate('/login'); // Redirect to login page
//       }, 2000); // Redirect after 2 seconds
//       return;
//     }

//     const formData = new FormData();
//     formData.append('job_title', data.job_title);
//     formData.append('service_tid', data.service_tid);
//     formData.append('state_tid', data.state_tid);
//     formData.append('description', data.description);
//     formData.append('address', data.address);
//     formData.append('location_long', 6.11223322);
//     formData.append('location_lat', 6.11223322);
//     formData.append('time', convertTimeTo12HourFormat(data.time));
//     formData.append('price', data.price);
//     formData.append(
//       'date',
//       selectedDateTime.date ? moment(selectedDateTime.date).format('YYYY-MM-DD') : data.date
//     );

//     if (image.main) {
//       formData.append('images[]', image.main, image.main.name);
//     }

//     formData.append('zipcode', data.zipcode);
//     formData.append('urgent', 0);

//     setIsSubmitting(true);

//     try {
//       const res = await AuthPosturl(Apis.users.create_bookings, formData);

//       if (res.status === true && res.data[0].paid === true) {
//         setBookingData({
//           ...data,
//           price: data.price,
//           image: image.preview,
//         });

//         setView(2);
//       } else {
//         ErrorAlert('you do not have enough fund to complete this request, you will be redirect to pay');
//         setTimeout(() => {
//           if (res.data[0].paid === false) {
//             window.location.href = res.text;
//           }
//         }, 2000);
//       }
//     } catch (error) {
//       ErrorAlert('An unexpected error occurred. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDateSelect = useCallback((selectedDate) => {
//     setSelectedDateTime((prev) => ({
//       date: selectedDate,
//       time: prev.time,
//     }));
//   }, []);


//   const handleUpload = (e) => {
//     const files = Array.from(e.target.files);
//     const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];

//     const newImages = files.filter(file => {
//       if (!validTypes.includes(file.type)) {
//         alert('Please upload valid images (JPEG/PNG).');
//         return false;
//       }
//       if (file.size > 2 * 1024 * 1024) {
//         alert('File size should not exceed 2MB.');
//         return false;
//       }
//       return true;
//     });

//     setImages(prevImages => [...prevImages, ...newImages]);
//   };

//   return (
//     <Layout>
//       <div className="bg-gray w-full xl:h-[20rem]">
//         <div className="text-center py-10 xl:pt-24">
//           <p className="font-[500] text-4xl mb-3">
//             {service ? service.name : 'Loading Service...'}
//           </p>
//           <span className="flex items-center gap-4 font-[500] justify-center">
//             <p className="text-primary">Home</p>
//             <span className="bg-[#6C757D] w-3 py-0.5"></span>
//             <p className="text-secondary">Service Detail</p>
//           </span>
//         </div>
//       </div>

//       {view === 1 && (
//         <div className="">
//           <div className="lg:flex gap-10 mx-10 mt-5 items-start justify-center">
//             <div className="w-full">
//               {loading ? (
//                 <div className="text-center">Loading...</div>
//               ) : error ? (
//                 <div className="text-center text-red-500">{error}</div>
//               ) : service ? (
//                 <>
//                   <LazyLoadImage
//                     effect="blur"
//                     className="w-screen object-center object-cover h-[20rem]"
//                     src={service.banner_image?.[0]}
//                   />
//                   <div className="mt-4">
//                     <div className="flex justify-between mb-3 font-[500]">
//                       <p className="lg:text-3xl text-xl">{service.name}</p>
//                     </div>

//                     <div className="mt-6 mb-8">
//                       <span className="font-[500] pb-1 text-sm text-black">Description</span>
//                       <p className="text-primary text-xs">{service.description}</p>
//                     </div>
//                     <div className="bg-cart w-full mb-10 rounded-lg lg:px-7 px-3 h-[12rem]">
//                       <div className="flex justify-between">
//                         <div className="font-[500] text-base py-3">Gallery</div>
//                       </div>


//                       <div className="flex overflow-x-auto items-center space-x-3">
//                         {service.gallery?.map((image, index) => (
//                           <div key={index} className="flex-shrink-0">
//                             <img
//                               src={image}
//                               alt={`Gallery image ${index + 1}`}
//                               className="w-24 h-28 object-cover rounded-lg"
//                             />
//                           </div>
//                         ))}
//                       </div>

//                     </div>
//                     <div className="mt-10 mb-20">
//                       <h3 className="font-[500] text-xl">Reviews</h3>
//                       {service.reviews?.length > 0 ? (
//                         service.reviews.map((review) => (
//                           <div key={review.id} className="border-b py-4">
//                             <div className="flex gap-4 font-medium">
//                               <div className="">
//                                 <FaUserCircle className='text-5xl' />
//                               </div>
//                               <div>
//                                 <div className="flex gap-4">
//                                   <p className="font-[500]">
//                                     {review.ufname} {review.ulname}
//                                   </p>
//                                   <p className="text-primary text-xs">{review.created_at}</p>
//                                 </div>
//                                 <div className="flex text-star gap-2">
//                                   {[...Array(5)].map((_, starIndex) => (
//                                     <FaStar
//                                       key={starIndex}
//                                       color={starIndex < review.rating ? '#FFD700' : '#ddd'}
//                                     />
//                                   ))}
//                                 </div>

//                                 <div className="mt-4">{review.review}</div>
//                               </div>
//                             </div>
//                           </div>
//                         ))
//                       ) : (
//                         <p className="text-gray-500">No reviews yet.</p>
//                       )}
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <div className="text-center">No service details available.</div>
//               )}
//             </div>

//             <div className="">
//               <div className="h-auto py-5 lg:w-[24rem]  px-5 rounded-xl bg-[#e2e2e2]">
//                 <div className="text-xl pt-5 pb-3 font-semibold">Booking Information</div>
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                   <div className="text-sm text-[#374151]">
//                     <div className="mb-5">
//                       <label className="text-xs font-semibold">Job Title</label>
//                       <input
//                         {...register('job_title', { required: 'Job title is required' })}
//                         type="text"
//                         placeholder="Job Title"
//                         className={`inputs border ${errors.job_title ? 'border-red-600' : 'border'}`}
//                       />
//                       {errors.job_title && (
//                         <div className="text-red-600">{errors.job_title.message}</div>
//                       )}
//                     </div>

//                     <div className="mb-5">
//                       <label className="text-xs font-semibold">Job Description</label>
//                       <input
//                         {...register('description', { required: 'Job description is required' })}
//                         type="text"
//                         placeholder="Job Description"
//                         className={`inputs border ${errors.description ? 'border-red-600' : 'border'}`}
//                       />
//                       {errors.description && (
//                         <div className="text-red-600">{errors.description.message}</div>
//                       )}
//                     </div>

//                     <div className="mb-5">
//                       <label className="text-xs font-semibold">Select Service</label>
//                       <select
//                         className={`inputs border ${errors.service_tid ? 'border-red-600' : 'border'}`}
//                         {...register('service_tid', { required: 'Service is required' })}
//                       >
//                         <option value="">Select Service</option>
//                         {services.map((service) => (
//                           <option key={service.trackid} value={service.trackid}>
//                             {service.name}
//                           </option>
//                         ))}
//                       </select>
//                       {errors.service_tid && (
//                         <div className="text-red-600">{errors.service_tid.message}</div>
//                       )}
//                     </div>

//                     <div className="mb-5">
//                       <label className="text-xs font-semibold">Select State</label>
//                       <select
//                         className={`inputs border ${errors.state_tid ? 'border-red-600' : 'border'}`}
//                         {...register('state_tid', { required: 'State is required' })}
//                       >
//                         <option value="">Select State</option>
//                         {states.map((state) => (
//                           <option key={state.trackid} value={state.trackid}>
//                             {state.name}
//                           </option>
//                         ))}
//                       </select>
//                       {errors.state_tid && (
//                         <div className="text-red-600">{errors.state_tid.message}</div>
//                       )}
//                     </div>



//                     <div className="mb-5 mt-5">
//                       <label className="text-xs font-semibold">Date Required</label>
//                       <div className="overflow-x-auto scrollsdown mb-4">
//                         <div className="flex space-x-2">
//                           <CalendarDays onSelectDate={handleDateSelect} />
//                         </div>
//                       </div>
//                     </div>

//                     <div className="mb-5">
//                       <label className="text-xs font-semibold">Time Service</label>
//                       <input
//                         {...register('time', { required: 'Time is required' })}
//                         type="time"
//                         className={`inputs border ${errors.time ? 'border-red-600' : 'border'}`}
//                         onChange={(e) =>
//                           setSelectedDateTime((prev) => ({ ...prev, time: e.target.value }))
//                         }
//                       />
//                       {errors.time && (
//                         <div className="text-red-600">{errors.time.message}</div>
//                       )}
//                     </div>
//                     <div className="mb-5">
//                       <div className="flex justify-between">
//                         <label className="text-xs font-semibold">Address</label>
//                         <button className="text-xs text-secondary font-semibold" type="button" onClick={getUserGeoAddress}>Get Location</button>
//                       </div>
//                       <input
//                         {...register('address', { required: 'Address is required' })}
//                         type="text"
//                         placeholder="Enter Address"
//                         className={`inputs border ${errors.address ? 'border-red-600' : 'border'}`}
//                         value={location.address}
//                         onChange={(e) => setLocation({ ...location, address: e.target.value })}
//                       />
//                       {errors.address && (
//                         <div className="text-red-600">{errors.address.message}</div>
//                       )}
//                     </div>
//                     <div className="mb-5">
//                       <label className="text-xs font-semibold">Price Offering</label>
//                       <input
//                         {...register('price', { required: 'Price is required' })}
//                         type="text"
//                         placeholder="Price"
//                         className={`inputs border ${errors.price ? 'border-red-600' : 'border'}`}
//                       />
//                       {errors.price && (
//                         <div className="text-red-600">{errors.price.message}</div>
//                       )}
//                     </div>

//                     <div className="mb-5">
//                       <label className="text-xs font-semibold">Zip Code</label>
//                       <input
//                         {...register('zipcode', { required: 'Zip Code is required' })}
//                         type="text"
//                         placeholder="Zip Code"
//                         className={`inputs border ${errors.zipcode ? 'border-red-600' : 'border'}`}
//                       />
//                       {errors.zipcode && (
//                         <div className="text-red-600">{errors.zipcode.message}</div>
//                       )}
//                     </div>

//                     <div className="my-4 w-full overflow-x-auto">
//                       <div className="flex gap-2">
//                         {images.map((image, index) => (
//                           <img
//                             key={index}
//                             src={URL.createObjectURL(image)}
//                             alt={`Preview ${index}`}
//                             className="w-20 h-20 border rounded-md object-cover"
//                           />
//                         ))}
//                         <label className="w-20 h-20 bg-slate-200 cursor-pointer flex items-center justify-center rounded-md flex-shrink-0">
//                           <FaPlus className="text-slate-600" />
//                           <input
//                             onChange={handleUpload}
//                             type="file"
//                             multiple
//                             hidden
//                           />
//                         </label>
//                       </div>
//                     </div>
//                     <div className="mt-6 mb-3">
//                       <button
//                         type="submit"
//                         className="bg-secondary w-full py-3 rounded-full text-white"
//                       >
//                         {isSubmitting ? 'Processing...' : 'Post'}
//                       </button>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>


//           <div className="mx-10 mt-10 mb-20">
//             <div className="w-full">
//               <div className="bg-[#e2e2e2] px-4 py-5">
//                 <div className="flex items-center text-sm justify-between">
//                   <div className="font-semibold">Related Search</div>
//                   <Link className='text-primary hover:text-secondary' to='/service'>View All</Link>
//                 </div>
//                 <div className="flex gap-5 w-full scrollsdown my-4 overflow-x-auto">
//                   {services.map((item, index) => (
//                     <div key={item.id || index}>
//                       <LazyLoadImage
//                         effect="blur"
//                         src={item.banner_image[0]}
//                         className="h-[16rem] md:w-[30rem] object-cover object-top"
//                       />
//                       <div className="py-4 px-5 md:w-[25rem] w-[15rem] h-[] bg-white rounded-b-3xl shadow-xl -mt-3">
//                         <div className="font-medium text-sm">{item.name}</div>
//                         <div className="text-xs capitalize text-slate-500 mt-1">{item.description}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>)}
//       {view === 2 && bookingData && (
//         <ConfirmBooking bookingData={bookingData} />
//       )}
//       <Popups isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Commission Fee">
//         <p>Task Colony will take a 10% commission on any payment made.</p>
//       </Popups>
//     </Layout>
//   );
// };

// export default ServiceDetail;

import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaPlus, FaStar, FaTimes, FaUserCircle } from 'react-icons/fa';
import Layout from '../../../Components/User/Layout';
import { Apis, AuthGeturl, AuthPosturl, Geturl } from '../../../Components/General/Api';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useForm } from 'react-hook-form';
import CalendarDays from '../../../Components/General/CalendarDays';
import { useSelector } from 'react-redux';
import { ErrorAlert } from '../../../Components/General/Utils';
import ConfirmBooking from './ConfirmBooking';
import moment from 'moment';
import Popups from '../../../Components/General/Popups';
import toast from 'react-hot-toast';

const ServiceDetail = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const { userid } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userloggedin, user } = useSelector(state => state.data);
  const [states, setStates] = useState([]);
  const [selectedDateTime, setSelectedDateTime] = useState({ date: null, time: null });
  const [view, setView] = useState(1); // 1 = Booking Form, 2 = Confirm Booking
  const [bookingData, setBookingData] = useState(null);

  const [images, setImages] = useState([]);
  const [location, setLocation] = useState({
    address: '',
    latitude: null,
    longitude: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [image, setImage] = useState({
    main: null,
    preview: null,
  });

  const fetchService = useCallback(async () => {
    try {
      const res = await Geturl(`${Apis.users.get_system}/${userid}`);
      if (res.status === true && res.data.all_services?.length > 0) {
        const filteredService = res.data.all_services.find((item) => String(item.id) === String(userid));
        if (filteredService) {
          setService(filteredService);
          setImage({
            main: null,
            preview: null,
          });
        } else {
          setError('Service not found for this user.');
        }
      } else {
        setError('No services available.');
      }
    } catch (err) {
      console.error('Error fetching service details:', err);
      setError('Failed to fetch service details.');
    } finally {
      setLoading(false);
    }
  }, [userid]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  const fetchAllHome = useCallback(async () => {
    setLoading(true);
    try {
      const res = await Geturl(Apis.users.get_system);
      if (res.status === true) {
        setServices(res.data.random_services);
        setCategories(res.data.categories);
        setCities(res.data.cities);
      } else {
        console.log(error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllHome();
  }, [fetchAllHome]);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      job_title: service?.name || '',
      description: service?.description || '',
    },
  });

  useEffect(() => {
    if (service) {
      setValue('job_title', service.name);
      setValue('description', service.description);
    }
  }, [service, setValue]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const categoryResponse = await Geturl(Apis.users.get_system);
      if (categoryResponse.status === true) {
        setCategories(categoryResponse.data.categories);
      }

      const stateResponse = await Geturl(Apis.users.get_system);
      if (stateResponse.status === true) {
        setStates(stateResponse.data.cities);
      }

      const serviceResponse = await Geturl(Apis.users.get_system);
      if (serviceResponse.status === true) {
        setServices(serviceResponse.data.all_services);
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const [locationButtonText, setLocationButtonText] = useState('Get Location');

  const getUserGeoAddress = async () => {
    setLocationButtonText('Getting your location...'); // Change button text
    if (!navigator.geolocation) {
      ErrorAlert('Geolocation is not supported by your browser.');
      setLocationButtonText('Get Location'); // Reset button text
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const apiKey = "AIzaSyAWrGaFeWRxxtjxUCZGG7naNmHtg0RK88o"; // Replace with your API key
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
          );
          const data = await response.json();
          if (data.status === "OK" && data.results.length > 0) {
            setLocation({
              address: data.results[0].formatted_address,
              latitude,
              longitude,
            });
          }
        } catch (error) {
          console.error('Error fetching geolocation:', error);
        } finally {
          setLocationButtonText('Get Location'); // Reset button text
        }
      },
      (error) => {
        ErrorAlert(`Error fetching location: ${error.message}`);
        setLocationButtonText('Get Location'); // Reset button text
      }
    );
  };

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);


  const handleDateSelect = useCallback((selectedDate) => {
    setSelectedDateTime((prev) => ({
      date: selectedDate,
      time: prev.time,
    }));
  }, []);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/svg+xml'];

    const newImages = files.filter(file => {
      if (!validTypes.includes(file.type)) {
        alert('Please upload valid images (JPEG/PNG/SVG).');
        return false;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert('File size should not exceed 2MB.');
        return false;
      }
      return true;
    });

    setImages(prevImages => [...prevImages, ...newImages]);
  };
  const onSubmit = async (data) => {
    if (!userloggedin) {
      ErrorAlert('You must be logged in to complete the booking.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }
    const formData = new FormData();
    formData.append('job_title', data.job_title);
    formData.append('service_tid', data.service_tid);
    formData.append('state_tid', data.state_tid);
    formData.append('description', data.description);
    formData.append('address', location.address || data.address);
    formData.append('location_long', location.longitude || 6.11223322);
    formData.append('location_lat', location.latitude || 6.11223322);
    formData.append('time', moment(data.time, 'HH:mm').format('hh:mm A'));
    formData.append('price', data.price);
    formData.append('date', selectedDateTime.date ? moment(selectedDateTime.date).format('MM-DD-YYYY') : moment().format('MM-DD-YYYY'));

    images.forEach(image => {
      formData.append('images[]', image);
    });

    formData.append('zipcode', data.zipcode);
    formData.append('urgent', 0);

    setIsSubmitting(true);
    setIsModalOpen(true);

    // Handle the actual submission in the modal confirmation
    try {
      const res = await AuthPosturl(Apis.users.create_bookings, formData);
      if (res.status === true && res.data[0].paid === true) {
        setBookingData({
          ...data,
          price: data.price,
          paymentUrl: res.text,
          firstImage: images[0] ? URL.createObjectURL(images[0]) : null, // Add this line
        });

        setView(2);
      } else {
        ErrorAlert(res.text)
        ErrorAlert('You do not have enough funds to carry out this booking.');
        setTimeout(() => {
          ErrorAlert(res.text);
          if (res.data[0].paid === false) {
            window.location.href = res.text;
          }
        }, 2000);
      }
    } catch (error) {

    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };
  return (
    <Layout>
      <div className="bg-gray w-full xl:h-[20rem]">
        <div className="text-center py-10 xl:pt-24">
          <p className="font-[500] text-4xl mb-3">
            {service ? service.name : 'Loading Service...'}
          </p>
          <span className="flex items-center gap-4 font-[500] justify-center">
            <p className="text-primary">Home</p>
            <span className="bg-[#6C757D] w-3 py-0.5"></span>
            <p className="text-secondary">Service Detail</p>
          </span>
        </div>
      </div>

      {view === 1 && (
        <div className="">
          <div className="lg:flex gap-10 mx-5 md:mx-10 mt-5 items-start justify-center">
            <div className="w-full">
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : error ? (
                <div className="text-center text-red-500">{error}</div>
              ) : service ? (
                <>
                  <LazyLoadImage
                    effect="blur"
                    className="w-screen object-center object-cover h-[20rem]"
                    src={service.banner_image?.[0]}
                  />
                  <div className="mt-4">
                    <div className="flex justify-between mb-3 font-[500]">
                      <p className="lg:text-3xl text-xl">{service.name}</p>
                    </div>

                    <div className="mt-6 mb-8">
                      <span className="font-[500] pb-1 text-sm text-black">Description</span>
                      <p className="text-primary text-xs">{service.description}</p>
                    </div>
                    <div className="bg-cart w-full mb-10 rounded-lg lg:px-7 px-3 h-[12rem]">
                      <div className="flex justify-between">
                        <div className="font-[500] text-base py-3">Gallery</div>
                      </div>

                      <div className="flex overflow-x-auto items-center space-x-3">
                        {service.gallery?.map((image, index) => (
                          <div key={index} className="flex-shrink-0">
                            <img
                              src={image}
                              alt={`Gallery image ${index + 1}`}
                              className="w-24 h-28 object-cover rounded-lg"
                            />
                          </div>
                        ))}
                      </div>

                    </div>
                    <div className="mt-10 mb-20">
                      <h3 className="font-[500] text-xl">Reviews</h3>
                      {service.reviews?.length > 0 ? (
                        service.reviews.map((review) => (
                          <div key={review.id} className="border-b py-4">
                            <div className="flex gap-4 font-medium">
                              <div className="">
                                <FaUserCircle className='text-5xl' />
                              </div>
                              <div>
                                <div className="flex gap-4">
                                  <p className="font-[500]">
                                    {review.ufname} {review.ulname}
                                  </p>
                                  <p className="text-primary text-xs">{review.created_at}</p>
                                </div>
                                <div className="flex text-star gap-2">
                                  {[...Array(5)].map((_, starIndex) => (
                                    <FaStar
                                      key={starIndex}
                                      color={starIndex < review.rating ? '#FFD700' : '#ddd'}
                                    />
                                  ))}
                                </div>

                                <div className="mt-4">{review.review}</div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No reviews yet.</p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center">No service details available.</div>
              )}
            </div>

            <div className="">
              <div className="h-auto py-5 lg:w-[24rem] px-5 rounded-xl bg-[#e2e2e2]">
                <div className="text-xl pt-5 pb-3 font-semibold">Booking Information</div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="text-sm text-[#374151]">
                    <div className="mb-5">
                      <label className="text-xs font-semibold">Job Title</label>
                      <input
                        {...register('job_title', { required: 'Job title is required' })}
                        type="text"
                        placeholder="Job Title"
                        className={`inputs border ${errors.job_title ? 'border-red-600' : 'border'}`}
                      />
                      {errors.job_title && (
                        <div className="text-red-600">{errors.job_title.message}</div>
                      )}
                    </div>

                    {/* Job Description */}
                    <div className="mb-5">
                      <label className="text-xs font-semibold">Job Description</label>
                      <input
                        {...register('description', { required: 'Job description is required' })}
                        type="text"
                        placeholder="Job Description"
                        className={`inputs border ${errors.description ? 'border-red-600' : 'border'}`}
                      />
                      {errors.description && (
                        <div className="text-red-600">{errors.description.message}</div>
                      )}
                    </div>
                    <div className="mb-5">
                      <label className="text-xs font-semibold">Select Categories</label>
                      <select
                        className={`inputs border`}
                        {...register('category', { required: false })} // Dummy field
                        onChange={(e) => setSelectedCategory(e.target.value)} // Update selected category
                      >
                        <option value="">Select Categories</option>
                        {categories.map((category) => (
                          <option key={category.trackid} value={category.trackid}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Select Service */}
                    <div className="mb-5">
                      <label className="text-xs font-semibold">Select Service</label>
                      <select
                        className={`inputs border ${errors.service_tid ? 'border-red-600' : 'border'}`}
                        {...register('service_tid', { required: 'Service is required' })}
                      >
                        <option value="">Select Service</option>
                        {services
                          .filter((service) => service.cat_tid === selectedCategory) // Filter services by selected category
                          .map((service) => (
                            <option key={service.trackid} value={service.trackid}>
                              {service.name}
                            </option>
                          ))}
                      </select>
                      {errors.service_tid && (
                        <div className="text-red-600">{errors.service_tid.message}</div>
                      )}
                    </div>
                    {/* Select State */}
                    <div className="mb-5">
                      <label className="text-xs font-semibold">Select State</label>
                      <select
                        className={`inputs border ${errors.state_tid ? 'border-red-600' : 'border'}`}
                        {...register('state_tid', { required: 'State is required' })}
                      >
                        <option value="">Select State</option>
                        {states.map((state) => (
                          <option key={state.trackid} value={state.trackid}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                      {errors.state_tid && (
                        <div className="text-red-600">{errors.state_tid.message}</div>
                      )}
                    </div>

                    {/* Date Required */}
                    <div className="mb-5 mt-5">
                      <label className="text-xs font-semibold">Date Required</label>
                      <div className="overflow-x-auto scrollsdown mb-4">
                        <div className="flex space-x-2">
                          <CalendarDays onSelectDate={handleDateSelect} />
                        </div>
                      </div>
                    </div>

                    {/* Time Service */}
                    <div className="mb-5">
                      <label className="text-xs font-semibold">Time Service</label>
                      <input
                        {...register('time', { required: 'Time is required' })}
                        type="time"
                        className={`inputs border ${errors.time ? 'border-red-600' : 'border'}`}
                        onChange={(e) =>
                          setSelectedDateTime((prev) => ({ ...prev, time: e.target.value }))
                        }
                      />
                      {errors.time && (
                        <div className="text-red-600">{errors.time.message}</div>
                      )}
                    </div>

                    {/* Address */}
                    <div className="mb-5">
                      <div className="flex justify-between">
                        <label className="text-xs font-semibold">Address</label>
                        <button className="text-xs text-secondary font-semibold" type="button" onClick={getUserGeoAddress}>
                          {locationButtonText}
                        </button>
                      </div>
                      <input
                        {...register('address', { required: 'Address is required' })}
                        type="text"
                        placeholder="Enter Address"
                        className={`inputs border ${errors.address ? 'border-red-600' : 'border'}`}
                        value={location.address}
                        onChange={(e) => setLocation({ ...location, address: e.target.value })}
                      />
                      {errors.address && (
                        <div className="text-red-600">{errors.address.message}</div>
                      )}
                    </div>

                    {/* Price Offering */}
                    <div className="mb-5">
                      <label className="text-xs font-semibold">Price Offering</label>
                      <input
                        {...register('price', { required: 'Price is required' })}
                        type="text"
                        placeholder="Price"
                        className={`inputs border ${errors.price ? 'border-red-600' : 'border'}`}
                      />
                      {errors.price && (
                        <div className="text-red-600">{errors.price.message}</div>
                      )}
                    </div>

                    {/* Zip Code */}
                    <div className="mb-5">
                      <label className="text-xs font-semibold">Zip Code</label>
                      <input
                        {...register('zipcode', { required: 'Zip Code is required' })}
                        type="text"
                        placeholder="Zip Code"
                        className={`inputs border ${errors.zipcode ? 'border-red-600' : 'border'}`}
                      />
                      {errors.zipcode && (
                        <div className="text-red-600">{errors.zipcode.message}</div>
                      )}
                    </div>

                    {/* Image Upload Section */}
                    <div className="my-4 w-full overflow-x-auto">
                      <div className="flex gap-2">
                        {images.length === 0 ? (
                          <label className="w-full h-40 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center rounded-md cursor-pointer">
                            <FaPlus className="text-gray-500 mb-2" size={24} />
                            <span className="text-gray-500">Choose from gallery</span>
                            <span className="text-xs text-gray-400">(PNG, JPG, JPEG or SVG - max. 2MB)</span>
                            <input
                              onChange={handleUpload}
                              type="file"
                              multiple
                              accept=".png,.jpg,.jpeg,.svg" // Allow SVGs
                              hidden
                            />
                          </label>
                        ) : (
                          <>
                            <div className="flex gap-2 overflow-x-auto items-start">
                              {images.map((image, index) => (
                                <div key={index} className="relative w-20 h-20">
                                  <img
                                    src={URL.createObjectURL(image)}
                                    alt={`Preview ${index}`}
                                    className="w-full h-full border rounded-md object-cover"
                                  />
                                  <button
                                    onClick={() => handleDelete(index)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                    aria-label="Delete image"
                                  >
                                    <FaTimes />
                                  </button>
                                </div>
                              ))}
                              <label className="w-20 h-20 bg-slate-200 cursor-pointer flex items-center justify-center rounded-md flex-shrink-0">
                                <FaPlus className="text-slate-600" size={24} />
                                <input
                                  onChange={handleUpload}
                                  type="file"
                                  multiple
                                  accept=".png,.jpg,.jpeg,.svg" // Allow SVGs
                                  hidden
                                />
                              </label>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-secondary mt-6 mb-3 w-full py-3 rounded-full text-white"
                    >
                      {isSubmitting ? 'Processing...' : 'Post'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="flex overflow-auto scrollsdown my-10 mx-5 gap-10">
            {services.slice(0, 8).map((item, index) => (
              <div className="flex-shrink-0" key={index}>
                <div className="">
                  <LazyLoadImage
                    effect="blur"
                    src={item.banner_image[0]}
                    className="h-[15rem] w-[20rem] object-top object-cover" // Increased height and width
                  />
                  <div className="py-6 px-6 md:h-[8rem] bg-white rounded-b-3xl shadow-xl -mt-4"> {/* Increased padding and height */}
                    <div className="font-medium text-lg">{item.name}</div> {/* Increased font size */}
                    <div className="text-sm capitalize text-slate-500 mt-3">{item.description}</div> {/* Increased font size */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}



      {view === 2 && bookingData && (
        <ConfirmBooking bookingData={bookingData} />
      )}
      <Popups isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Commission Fee">
        <p>Task Colony will take a 10% commission on any payment made.</p>
      </Popups>
    </Layout>
  );
};

export default ServiceDetail;