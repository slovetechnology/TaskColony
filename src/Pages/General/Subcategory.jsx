import React from 'react';
import Layout from '../../Components/User/Layout';

const subcart = [
  { name: 'handyman' }, { name: 'handyman' }, { name: 'handyman' }, { name: 'handyman' }, { name: 'handyman' },
  { name: 'handyman' }, { name: 'handyman' }, { name: 'handyman' }, { name: 'handyman' }, { name: 'handyman' },
  { name: 'handyman' }, { name: 'handyman' }, { name: 'handyman' }, { name: 'handyman' }, { name: 'handyman' },
  { name: 'handyman' }, { name: 'handyman' }, { name: 'handyman' }, { name: 'handyman' }, { name: 'handyman' },
  { name: 'handyman' }, { name: 'handyman' }, { name: 'handyman' }, { name: 'handyman' }, { name: 'handyman' },
  { name: 'handyman' }
];

const Subcategory = () => {
  return (
    <Layout>
    <div className="bg-gray w-full xl:h-[20rem]">
        <div className="text-center py-10 xl:pt-24">
          <p className="font-[500] text-4xl mb-3">Categories</p>
          <span className="flex items-center gap-4 font-[500] justify-center">
            <p className="text-primary">Home</p>
            <span className="bg-[#6C757D] w-3 py-0.5"></span>
            <p className="text-secondary">
              Categories <span className="text-secondary">Handyman</span>
            </p>
          </span>
        </div>
      </div>
      <div className="w-[80%] mx-auto my-10">
        <div className="font-semibold text-center text-3xl mb-6">Handyman</div>
        <div className="flex flex-wrap gap-2 justify-center">
          {subcart.map((item, i) => (
            <div
              className="bg-[#fdece8] text-secondary rounded-full px-5 py-1"
              key={i}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Subcategory;
