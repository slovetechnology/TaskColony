import React, { useCallback, useEffect, useState } from 'react'
import Layout from '../../../Components/User/Layout'
import { FaHeart, FaSearch, FaStar } from 'react-icons/fa'
import { SlArrowDown } from 'react-icons/sl'
import { Link } from 'react-router-dom'
import { Apis, AuthGeturl } from '../../../Components/General/Api'
import { HomeOurServices } from '../../../utils/utils'
import { LazyLoadImage } from 'react-lazy-load-image-component'

const Service = () => {
  const [items, setItems] = useState([]); // List of services
  const [carts, setCarts] = useState([]); // List of categories
  const [error, setError] = useState(null); // Error message
  const [loading, setLoading] = useState(true); // Loading state
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [view, setView] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); // Selected category state

  const handleView = (tag) => {
    setView(view !== tag ? tag : '');
  };

  // Fetch services
  const fetchServices = useCallback(async () => {
    try {
      const res = await AuthGeturl(Apis.users.get_all_services);
      if (res.status) {
        setItems(res.data.data);
      } else {
        throw new Error('Failed to fetch services');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Fetch categories
  const fetchCarts = useCallback(async () => {
    try {
      const res = await AuthGeturl(Apis.users.get_category);
      if (res.status) {
        setCarts(res.data.categories);
      } else {
        throw new Error('Failed to fetch categories');
      }
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    fetchCarts();
  }, [fetchCarts]);

  // Filter items based on search query and selected category
  const filteredItems = items.filter(item => {
    const matchesSearchQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? item.category_name === selectedCategory : true;
    return matchesSearchQuery && matchesCategory;
  });

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category.name);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedCategory(''); // Reset category when changing search
  };

  return (
    <Layout>
      <div className="bg-gray w-full xl:h-[20rem]">
        <div className="text-center py-10 xl:pt-24">
          <p className="font-[500] text-4xl mb-3">Services</p>
          <span className="flex items-center gap-4 font-[500] justify-center">
            <p className="text-primary">Home</p>
            <span className="bg-[#6C757D] w-3 py-0.5"></span>
            <p className="text-primary">Categories</p>
            <span className="bg-[#6C757D] w-3 py-0.5"></span>
            <p className="text-secondary">Services</p>
          </span>
        </div>
      </div>

      <div className="w-[80%] gap-10 xl:mt-28 mt-10 mb-32 border-b pb-16 xl:flex mx-auto">
        {/* Search Bar */}
        <div className="mx-3">
          <div className="border-b py-5">
            <div className="w-full">
              <label className="border gap-[10px] mb-10 text-[#9C9C9C] flex items-center py-2.5 px-3 border-primary rounded-md">
                <input
                  type="text"
                  placeholder="Search services"
                  className="xl:w-[16rem] w-full bg-transparent placeholder:text-[16px] placeholder:text-primary outline-none"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <FaSearch size={16} />
              </label>
              {searchQuery && (
                <div className="mt-2">
                  {filteredItems.length > 0 ? (
                    <div className="border rounded-md p-2 bg-white">
                      <h4 className="font-semibold">Search Results:</h4>
                      {filteredItems.map((item, i) => (
                        <Link to={`/service-detail/${item.id}`} key={i} className="block text-primary mb-1">
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No services found.</p>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="cursor-pointer py-3 border-b px-3">
            <div onClick={() => handleView('category')} className="flex items-center justify-between font-semibold text-gold capitalize mb-2">
              Category <SlArrowDown className='text-xs' />
            </div>
            {view === 'category' && (
              <div className="flex gap-4 flex-col text-sm text-light">
                {carts.map((category, i) => (
                  <div
                    key={i}
                    className="hover:bg-secondary hover:text-white bg-cart w-fit py-2 px-5 rounded-full cursor-pointer"
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-5 mt-7">
          {HomeOurServices.map((item, index) => (
            <div className="w-11/12 mx-auto" key={index}>
              <div className="relative">
                <div className="absolute z-10 text-sm top-2 right-4 bg-white rounded-full py-1  font-semibold px-2">
                  ${item.price}
                </div>
                <div className="absolute z-10 text-sm bottom-4 flex items-center gap-1 right-4 bg-white rounded-full py-1  font-semibold px-2">
                  <FaHeart className='text-secondary' /> {item.rating} <FaStar className='text-yellow' />
                </div>
                <LazyLoadImage
                  effect="blur"
                  src={item.img}
                  className="w-[30rem] object-cover"
                />
              </div>
              <div className="py-4 px-5 bg-white rounded-b-3xl -mt-3">
                <div className="font-medium">{item.title}</div>
                <div className="text-xs capitalize text-slate-500 mt-3">{item.tag}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Service;