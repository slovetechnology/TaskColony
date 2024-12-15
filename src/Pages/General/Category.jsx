import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../../Components/User/Layout';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Apis, AuthGeturl, Geturl } from '../../Components/General/Api';
import { HomeCategories } from '../../utils/utils';

const Category = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await Geturl(Apis.users.get_system);
      if (res.status === true) {
        setItems(res.data.categories);
      } else {
        setError('Unstable network. Please contact tech support.');
      }
    } catch (err) {
      setError('Unstable network. Please contact tech support.');
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <Layout>
      <div className="bg-gray w-full xl:h-[20rem]">
        <div className="text-center py-10 xl:pt-24">
          <p className='font-[500] text-4xl mb-3'>Categories</p>
          <span className='flex items-center gap-4 font-[500] justify-center'>
            <p className="text-primary">Home</p>
            <span className="bg-[#6C757D] w-3 py-0.5"></span>
            <p className="text-secondary">Category</p>
          </span>
        </div>
      </div>

      <div className="w-11/12 lg:w-10/12 mx-auto my-28">
        <div className="grid grid-cols-1 lg:grid-cols-5 mt-20 mb-20">
          <div className="lg:col-span-2"></div>
          <div className="flex  lg:col-span-3 items-center justify-between">
            <div className="font-medium text-2xl">Categories</div>
          s</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-12 lg:gap-y-16 gap-x-4">
          {items.map((item, index) => (
            <div className="bg-white shadow-2xl rounded-xl p-4" key={index}>
              <div className="bg-secondary p-3 rounded-full w-fit mx-auto -mt-14"><img src={item.icon} alt="" className="size-8" /></div>
              <div className="text-center mt-5 mb-10 capitalize">{item.name}</div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Category;
