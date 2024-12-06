import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaPlus, FaStar } from 'react-icons/fa';
import Layout from '../../../Components/User/Layout';
import { Apis, AuthGeturl, Geturl } from '../../../Components/General/Api';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useForm } from 'react-hook-form';
import CalendarDays from '../../../Components/General/CalendarDays';

const ServiceDetail = () => {
  const { userid } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);
  const [cartegory, setCategory] = useState([]);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [image, setImage] = useState({
    main: null,
    preview: null,
  });

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image (JPEG/PNG).');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert('File size should not exceed 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImage({
          main: file,
          preview: reader.result,
        });
      };
    }
  };
  const fetchService = useCallback(async () => {
    try {
      const res = await AuthGeturl(`${Apis.users.get_all_services}/${userid}`);
      console.log('Route user ID:', userid);
      console.log('API Response:', res.data.data);

      if (res.status === true && res.data.data.length > 0) {
        const filteredService = res.data.data.find((item) => String(item.id) === String(userid));
        if (filteredService) {
          setService(filteredService);
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
        setCategory(res.data.categories);
      } else {
        console.log(error)
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

  const handleDateSelect = () => {
    const selectedMoment = moment(date);
    setMonth(selectedMoment.format("MMMM"));
    setYear(selectedMoment.year());

    setSelectedDateTime((prev) => {
      const newDateTime = { date, time: prev.time };
      localStorage.setItem("selectedDateTime", JSON.stringify(newDateTime));
      onTimeSelect(newDateTime);
      return newDateTime;
    });
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

      <div className="w-[80%] mt-10  mx-auto">
        <div className="lg:flex gap-10 items-start justify-center">
          <div className="w-full">
            {loading ? (
              <div className="text-center"></div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : service ? (
              <>
                <LazyLoadImage
                  effect="blur"
                  className="w-screen object-center object-cover  h-[20rem]"
                  src={service.banner_image?.[0]}
                />
                <div className="mt-4">
                  <div className="flex justify-between mb-3 font-[500]">
                    <p className="lg:text-3xl text-xl">{service.name}</p>
                  </div>
                  <p className="text-primary text-xs">
                    <span className="font-[500] text-sm text-black">Location:</span> {service.location}
                  </p>
                  <div className="mt-6 mb-8">
                    <span className="font-[500] pb-1 text-sm text-black">Description</span>
                    <p className="text-primary text-xs">{service.description}</p>
                  </div>
                  <div className="bg-cart w-full mb-10 rounded-lg lg:px-7 px-3 h-[12rem]">
                    <div className="flex justify-between">
                      <div className="font-[500] text-base py-3">Gallery</div>
                    </div>
                    <div className="flex overflow-x-auto items-center space-x-3">
                      {service.gallery?.length > 0 ? (
                        service.gallery.map((image, index) => (
                          <div key={index} className="flex-shrink-0">
                            <img
                              src={image[0]}
                              alt={`Gallery ${index}`}
                              className="w-24 h-28 object-cover rounded-lg"
                            />
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No images in gallery.</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-10 mb-20">
                    <h3 className="font-[500] text-xl">Reviews</h3>
                    {service.reviews?.length > 0 ? (
                      service.reviews.map((review, index) => (
                        <div key={index} className="border-b py-4">
                          <div className="flex gap-4 font-medium">
                            <img src={review.profile_pic} alt="" className="w-20 h-20" />
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
              <div className="text-center"></div>
            )}
          </div>
          <div className="w-[30%]">
            <div className="h-[55rem] w-[22rem] px-5 rounded-xl bg-[#e2e2e2]">
              <div className="text-xl pt-5 pb-3 font-semibold">Booking  Information </div>
              <form action="">
                <div className="mb-5 ">
                  <label className='text-xs font-semibold'>job Title</label>
                  <input
                    {...register('lastname', { required: 'Last name is required' })}
                    type="text" placeholder='Job Title'
                    className={`inputs border ${errors.lastname ? 'border-red-600' : 'border'}`}
                  />
                  {errors.lastname && <div className="text-red-600">{errors.lastname.message}</div>}
                </div>

                <div className="mb-5 ">
                  <label className='text-xs font-semibold'>Job Description</label>
                  <input
                    {...register('lastname', { required: 'Last name is required' })}
                    type="text" placeholder='Job Description'
                    className={`inputs border ${errors.lastname ? 'border-red-600' : 'border'}`}
                  />
                  {errors.lastname && <div className="text-red-600">{errors.lastname.message}</div>}
                </div>

                <div className="mb-5 ">
                  <label className='text-xs font-semibold'>Select Category</label>
                  <select className="inputs" {...register('status')}>
                    {cartegory.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-5  mt-5">
                <label className='text-xs font-semibold'>Date Required</label>
                  <div className="overflow-x-auto scrollsdown mb-4">
                    <div className="flex space-x-2">
                      <CalendarDays onSelectDate={handleDateSelect} />
                    </div>
                  </div>
                </div>

                <div className="mb-5 ">
                  <label className='text-xs font-semibold'>Time Service</label>
                  <input
                    {...register('lastname', { required: 'Last name is required' })}
                    type="time"
                    placeholder='Time'
                    className={`inputs border ${errors.lastname ? 'border-red-600' : 'border'}`}
                  />
                  {errors.lastname && <div className="text-red-600">{errors.lastname.message}</div>}
                </div>

                <div className="mb-5 ">
                  <label className='text-xs font-semibold'>Address</label>
                  <input
                    {...register('lastname', { required: 'Last name is required' })}
                    type="text"
                    placeholder='Enter Address'
                    className={`inputs border ${errors.lastname ? 'border-red-600' : 'border'}`}
                  />
                  {errors.lastname && <div className="text-red-600">{errors.lastname.message}</div>}
                </div>

                <div className="mb-5 ">
                  <label className='text-xs font-semibold'>Price Offering</label>
                  <input
                    {...register('lastname', { required: 'Last name is required' })}
                    type="text"
                    placeholder='Price'
                    className={`inputs border ${errors.lastname ? 'border-red-600' : 'border'}`}
                  />
                  {errors.lastname && <div className="text-red-600">{errors.lastname.message}</div>}
                </div>

                <div className="my-4">
                  <label>
                    {image.preview === null ? (
                      <div className="w-full h-32 bg-slate-200 cursor-pointer mx-auto flex items-center justify-center text-slate-600">
                        <FaPlus />
                      </div>
                    ) : (
                      <img
                        src={image.preview}
                        alt="Preview"
                        className="w-full h-40 mx-auto border rounded-md object-cover"
                      />
                    )}
                    <input onChange={handleUpload} type="file" hidden />
                  </label>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="lg:flex -mt-20 mb-20">
          <div className="lg:flex gap-10 items-end justify-end">
            <div className="w-full">
              <div className="bg-[#e2e2e2] px-4 py-5">
                <div className="flex items-center text-sm justify-between">
                  <div className="font-semibold">Related Search</div>
                  <Link className='text-primary hover:text-secondary' to='/service'>View All</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-5 mt-3">
                  {services.map((item, index) => (
                    <div className="w-11/12 mx-auto" key={index}>
                      <div className="relative">

                        <LazyLoadImage
                          effect="blur"
                          src={item.banner_image[0]}
                          className="w-[40rem] h-[10rem] object-top md:w-[30rem] rounded-t-3xl object-cover"
                        />
                      </div>
                      <div className="py-4 px-5 h-[5rem] bg-white rounded-b-3xl shadow-xl -mt-3">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs capitalize text-slate-500 mt-1">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-[30%]">
              <div className="h-[30rem] w-[22rem] px-5 rounded-xl bg-[#e2e2e2]">
                <div className="text-xl pt-5 pb-3 font-semibold">Payment  Summary </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ServiceDetail;