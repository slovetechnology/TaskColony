import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../../../Components/User/Layout';
import { FaSearch } from 'react-icons/fa';
import { SlArrowDown } from 'react-icons/sl';
import { Link } from 'react-router-dom';
import { Apis, AuthGeturl, Geturl } from '../../../Components/General/Api';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const Service = () => {
  const [items, setItems] = useState([]);
  const [carts, setCarts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleView = (tag) => {
    setView(view !== tag ? tag : '');
  };

  const fetchServices = useCallback(async () => {
    try {
      const res = await Geturl(Apis.users.get_system);
      if (res.status) {
        console.log(res.status)
        setItems(res.data.all_services);
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

  const fetchCarts = useCallback(async () => {
    try {
      const res = await Geturl(Apis.users.get_system);
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

  const filteredItems = items.filter(item => {
    const matchesSearchQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? item.category_name === selectedCategory : true;
    return matchesSearchQuery && matchesCategory;
  });

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.name);
    setSearchQuery('');
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedCategory('');
  };

  const clearCategory = () => {
    setSelectedCategory('');
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

      <div className="lg:w-[80%] gap-10 xl:mt-28 mt-10 mb-32 border-b pb-16 xl:flex mx-auto">
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
                    className={`hover:bg-secondary hover:text-white bg-cart w-fit py-2 px-5 rounded-full cursor-pointer ${
                      selectedCategory === category.name ? 'bg-secondary text-white' : ''
                    }`}
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category.name}
                  </div>
                ))}
                {selectedCategory && (
                  <button
                    className="text-sm text-red-500 mt-3 underline"
                    onClick={clearCategory}
                  >
                    Clear Category
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-5 mt-7">
          {(searchQuery || selectedCategory ? filteredItems : items).length > 0 ? (
            (searchQuery || selectedCategory ? filteredItems : items).map((item, index) => (
              <div className="w-11/12 mx-auto relative" key={index}>
                <div className="">
                  <LazyLoadImage
                    effect="blur"
                    src={item.banner_image[0]}
                    className="w-[20rem] md:w-[30rem] h-[10rem] object-top object-cover"
                  />
                </div>
                <div className="py-4 px-5 shadow-2xl lg:h-[9rem] w-full bg-white rounded-b-3xl -mt-3">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs capitalize text-slate-500 mt-3">{item.description}</div>
                  <Link to={`/service-detail/${item.id}`} className='text-xs font-medium text-secondary'>View Details</Link>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full flex h-screen justify-center  text-center my-10">
              <p className="text-gray-500 text-lg">No services found.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Service;