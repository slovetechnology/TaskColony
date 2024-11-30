import React, { useState } from 'react'
import {FaPlug, FaStar, FaStripe } from 'react-icons/fa'
import img6 from 'assets/new/img6.svg'
import Layout from '../../../Components/User/Layout'

const ServiceDetail = () => {
  const { userid } = useParams(); 
  const [service, setService] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchService = useCallback(async () => {
    try {
      const res = await AuthGeturl(`${Apis.users.get_all_services}/${userid}`);

      if (res.status === true && res.data.data.length > 0) {
        const foundService = res.data.data.find((s) => s.id === parseInt(userid));

        if (foundService) {
          setService(foundService);
        } else {
          setError('Service not found for the given ID.');
        }
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

  if (loading) {
    return (
      <div className="w-full p-6 text-center">
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Render the service details once data is loaded
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
          <div className="">
            <img
              src={service.banner_image?.[0] || '/placeholder.jpg'}
              alt={service.name}
              className="w-full rounded-3xl object-cover lg:h-[23rem]"
            />
            <div className="mt-10">
              <div className="flex justify-between mb-3 font-[500]">
                <p className="lg:text-3xl text-xl">{service.name}</p>
              </div>
              <div>
                {service.location && (
                  <p className="text-primary text-xs">
                    <span className="font-[500] text-sm text-black">Location</span>: {service.location}
                  </p>
                )}
                <div className="mt-6 mb-8">
                  <span className="font-[500] pb-1 text-sm text-black">Description</span>
                  <p className="text-primary text-xs">{service.description || 'No description provided.'}</p>
                </div>
                <div className="bg-cart w-full mb-10 rounded-lg lg:px-7 px-3 h-[12rem]">
                  <div className="flex justify-between">
                    <div className="font-[500] text-base py-3">Gallery</div>
                    <div className="font-[500] text-sm text-primary py-3">View All</div>
                  </div>
                  <div className="flex overflow-x-auto items-center space-x-3">
                    {service.gallery?.length > 0 ? (
                      service.gallery.map((image, j) => (
                        <div key={j} className="flex-shrink-0">
                          <img
                            src={image}
                            alt={`Gallery ${j}`}
                            className="w-24 h-28 object-cover rounded-lg"
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No images in gallery.</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-10 mb-20">
                <h3 className="font-[500] text-xl">Reviews</h3>
                {service.reviews?.length > 0 ? (
                  service.reviews.map((review, j) => (
                    <div key={j} className="border-b py-4">
                      <div className="flex gap-4 font-medium">
                        <img src={review.profile_pic} alt="" className="w-20 h-20" />
                        <div className="">
                          <div className="flex gap-4">
                            <p className="font-[500]">{review.ufname} {review.ulname} </p>
                            <p className="text-primary text-xs">{review.created_at}</p>
                          </div>
                          <div className="flex text-star gap-2">
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
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
