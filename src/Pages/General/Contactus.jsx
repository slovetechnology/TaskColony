import React from 'react'
import Layout from '../../Components/User/Layout'
import { FaGreaterThan } from "react-icons/fa"
import { FaFacebook, FaInstagram, FaTiktok, FaTwitter } from "react-icons/fa";
const Contactus = () => {
  return (
    <Layout>
      <div className="">
        <div className="bg-gray w-full xl:h-[20rem]">
          <div className="text-center py-10 xl:pt-24">
            <p className="font-[500] text-3xl md:text-4xl mb-3">Contact Us</p>
            <span className="flex items-center gap-4 font-[500] justify-center">
              <p className="text-primary">Home</p>
              <span className="bg-[#6C757D] w-3 py-0.5"></span>
              <p className="text-secondary">Contact Us</p>
            </span>
          </div>
        </div>
        <div className="w-[80%] my-20  mx-auto">
          <div className="lg:flex text-navy items-start gap-10">
            <div className="">
              <h6 className='font-semibold italic my-5'>CONTACT US</h6>
              <p className='text-4xl font-bold my-3'>YOU'RE ALWAYS WELCOME!</p>
              <div className="border p-0.5 w-20 my-5 rounded-full bg-primary border-none"></div>
              <p className='text-xl mb-5 font-semibold'>Feel free to give us a call to schedule an appointment. Our experienced and friendly provider will provide you with the best.</p>
              <div className="flex items-center gap-6 mt-5">
                <span className="text-lg font-bold">FOLLOW US:</span>
                <div className="flex items-center gap-3">
                  <span className="bg-secondary p-2 border text-white">
                    <FaFacebook />
                  </span>
                  <span className="bg-secondary p-2 border text-white">
                    <FaInstagram />
                  </span>
                  <span className="bg-secondary p-2 border text-white">
                    <FaTwitter />
                  </span>
                  <span className="bg-secondary p-2 border text-white">
                    <FaTiktok />
                  </span>
                </div>
              </div>
            </div>
            <div className="flex mt-10 flex-col">
              <span className="mb-1">
                <h4 className='text-2xl font-bold my-2'>Phone</h4>
                <p className="text-lg font-medium">+1 705 082 1589</p>
              </span>

              <span className="mb-1">
                <h4 className='text-2xl font-bold my-2'>E-mail</h4>
                <p className="text-lg font-medium">support@taskcolony.com</p>
              </span>

            </div>
          </div>
        </div>
        
      </div>
    </Layout>
  )
}

export default Contactus
