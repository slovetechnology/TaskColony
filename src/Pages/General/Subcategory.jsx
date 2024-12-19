import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../Components/User/Layout';
import { Geturl, Apis } from '../../Components/General/Api';

const Subcategory = () => {
  const { trackid } = useParams(); // Retrieve trackid from URL
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [error, setError] = useState(null);

  const fetchServices = useCallback(async () => {
    try {
      const res = await Geturl(`${Apis.users.get_system}`);
      if (res.status === true) {
        setServices(res.data.all_services);

        // Filter services based on trackid
        const filtered = res.data.all_services.filter(
          (service) => service.cat_tid === trackid
        );
        setFilteredServices(filtered);
      } else {
        setError('Unstable network. Please contact tech support.');
      }
    } catch (err) {
      setError('Unstable network. Please contact tech support.');
    }
  }, [trackid]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <Layout>
      <div className="bg-gray w-full xl:h-[20rem]">
        <div className="text-center py-10 xl:pt-24">
          <p className="font-[500] text-4xl mb-3">Sub Categories</p>
          <span className="flex items-center gap-4 font-[500] justify-center">
            <p className="text-primary">Home</p>
            <span className="bg-[#6C757D] w-3 py-0.5"></span>
            <p className="text-secondary">Sub Categories</p>
          </span>
        </div>
      </div>
      <div className="w-[80%] mx-auto my-10">
        <div className="flex flex-wrap gap-2 justify-center">
          {filteredServices.length > 0 ? (
            filteredServices.map((service, i) => (
              <div
                className="bg-[#fdece8] text-secondary rounded-full px-5 py-1"
                key={i}
              >
                {service.name}
              </div>
            ))
          ) : (
            <p>No services available for this category.</p>
          )}
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </Layout>
  );
};

export default Subcategory;