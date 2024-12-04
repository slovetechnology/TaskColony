import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import Layout from '../../../Components/User/Layout';
import { Geturl } from '../../../Components/General/Api';

const ServiceDetail = () => {
  const { userid } = useParams();
  const [service, setService] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchService = useCallback(async () => {
    try {
      const res = await AuthGeturl(Apis.users.get_all_services);
      if (res.status === true) {
        setService(res.data.data);
      } else {
        setError('Service not found');
      }
    } catch (err) {
      setError('Failed to fetch service details');
    } finally {
      setLoading(false);
    }
  }, [userid]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);


  return (
    <Layout>
      <div className="bg-gray w-full xl:h-[20rem]">
        <div className="text-center py-10 xl:pt-24">
          <p className="font-[500] text-4xl mb-3">{service.name}</p>
          <span className="flex items-center gap-4 font-[500] justify-center">
            <p className="text-primary">Home</p>
            <span className="bg-[#6C757D] w-3 py-0.5"></span>
            <p className="text-secondary">Service Detail</p>
          </span>
        </div>
      </div>
      <div className="lg:w-[80%] w-full px-5 lg:px-0 mx-auto">
        <div className="gap-10 lg:mt-28 mt-10 lg:flex">
          <div>
            <img
              src={service.banner_image?.[0] || '/placeholder.jpg'}
              alt={service.name}
              className="w-full rounded-3xl object-cover lg:h-[23rem]"
            />
            <div className="mt-10">
              <div className="flex justify-between mb-3 font-[500]">
                <p className="lg:text-3xl text-xl">{service.name}</p>
              </div>
              <p className="text-primary text-xs">
                <span className="font-[500] text-sm text-black">Location:</span> {service.location}
              </p>
              <div className="mt-6 mb-8">
                <span className="font-[500] pb-1 text-sm text-black">Description:</span>
                <p className="text-primary text-xs">{service.description || 'No description provided.'}</p>
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
                          src={image}
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
                            <p className="font-[500]">{review.ufname} {review.ulname}</p>
                            <p className="text-primary text-xs">{review.created_at}</p>
                          </div>
                          <div className="flex text-star gap-2">
                            {[...Array(5)].map((_, starIndex) => (
                              <FaStar key={starIndex} color={starIndex < review.rating ? '#FFD700' : '#ddd'} />
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ServiceDetail;
