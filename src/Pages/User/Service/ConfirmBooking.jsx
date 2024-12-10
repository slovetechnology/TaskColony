  import React, { useState } from 'react'
  import Layout from '../../../Components/User/Layout'
  import { FaPhoneVolume, FaRegStar, FaStar } from 'react-icons/fa'
  import img5 from '../../../assets/profile.png'
  import tv from '../../../assets/tv.png'
  import { MdVerified } from 'react-icons/md'
  import { AiOutlineMessage } from 'react-icons/ai'
  import { LuPhoneCall } from 'react-icons/lu'
  import { useParams } from 'react-router-dom'
  import { Apis, AuthGeturl } from '../../../Components/General/Api'

  const ConfirmBooking = () => {
    const [selected, setSelected] = useState('Call');

    return (
      <Layout>
        <div className="bg-gray w-full xl:h-[20rem]">
          <div className="text-center py-10 xl:pt-24">
            <p className='font-[500] text-4xl mb-3'>TV Wall Mount Installation</p>
            <span className='flex items-center gap-4 font-[500] justify-center'>
              <p className="text-primary">Home</p>
              <span className="bg-[#6C757D] w-3 py-0.5"></span>
              <p className="text-secondary">Service Detail</p>
            </span>
          </div>
        </div>
        <div className="gap-10 mt-10 xl:w-[80%] mb-40 mx-auto xl:flex">
          <div className="px-5">
            <img src={tv} alt="" className="w-full rounded-3xl object-cover md:h-[23rem]" />
            <div className="">
              <div className="flex justify-between mt-10 mb-3 font-[500]">
                <p className="md:text-3xl">TV Wall Mount Installation</p>
              </div>
              <div className="">
                <p className="text-primary text-xs"><span className="font-[500] text-sm text-black">Location</span> : 4517 Washington Ave. Manchester, Kentucky 39495</p>
                <div className="md:flex gap-10 mt-2">
                  <p className="text-primary text-xs mb-4 md:mb-0"><span className="font-[500] text-sm text-black">Provider</span> : Arley McCoy</p>
                  <p className="text-primary text-xs"><span className="font-[500] text-sm text-black">Duration</span> : 01 Hour</p>
                </div>
                <div className="mt-6 mb-8">
                  <span className="font-[500] pb-1 w-full text-sm text-black">Description</span>
                  <p className="text-primary text-xs">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. </p>
                </div>
              </div>
            </div>

            <div className="">

              <div className="">
                <div className="mt-12 mb-5">
                  <p className=" font-[500] text-2xl">Reviews About Provider</p>
                </div>
                <div className="">
                  <div className="flex border-t pt-7 justify-between">
                    <div className="md:flex gap-4 items-start">
                      <img src={img5} alt="" className="rounded-full w-16 h-16 object-cover" />
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3 justify-between w-full">
                          <p className="font-[500]">Ralph Edwards</p>
                          <p className="text-xs text-primary font-[400]">02 Dec, 2021</p>
                        </div>
                        <div className="flex">
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                        </div>
                      </div>
                    </div>
                    <div className="text-secondary">Edit</div>
                  </div>
                  <p className="text-sm mt-4">
                    Amal is incredible at what he does, very prompt with delivery and any revisions. I would definitely recommend you to work with him. My next project will definitely be getting him to sing a love ballad in the voice of Master Oogway.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray h-[60rem] w-[60%] mt-16 xl:mt-0 md:p-10 p-2 rounded-xl">
            <div className="mb-3"><p className=" font-[500] text-2xl">About Provider</p></div>
            <div className="bg-white rounded-xl p-4 md:h-[13rem]">
              <div className="">
                <div className="flex border-t pt-7 px-5 justify-between">
                  <div className="md:flex gap-4 items-start">
                    <img src={img5} alt="" className="rounded-full w-16 h-16 object-cover" />
                    <div className="flex flex-col">
                      <div className="">
                        <p className="font-[500] flex items-center gap-2 mb-2">Ralph Edwards  <div className="text-green-400"><MdVerified /></div></p>
                        <p className="text-sm mb-2 text-primary font-[400]">TV Installation Expert</p>
                      </div>
                      <div className="flex text-star items-center">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar /><span className="text-primary px-3">4.5</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div className="md:flex items-center justify-center mt-7 gap-6">
                <div className={`px-7 flex items-center justify-center gap-2 h-10 rounded-lg cursor-pointer font-medium ${selected === 'Call' ? 'bg-secondary text-white' : 'text-black'}`} onClick={() => setSelected('Call')}> <LuPhoneCall /> Call</div>
                <div className={`px-7 flex items-center justify-center gap-2 h-10 rounded-lg cursor-pointer font-medium ${selected === 'Chat' ? 'bg-secondary text-white' : 'text-black'}`} onClick={() => setSelected('Chat')}> <AiOutlineMessage /> Chat</div>
              </div>
            </div>
            <div className="mt-10">
              <p className=" font-[500] text-2xl">Price Detail</p>
              <div className="bg-white rounded-xl py-4 h-[20rem]">
                <div className=" h-[28rem] px-6">
                  <div className="text-xs">
                    <div className="flex border-b items-center justify-between gap-5 my-5">
                      <div className="font-medium text-base">Price</div>
                      <div className="">$120</div>
                    </div>

                    <div className="flex border-b items-center justify-between gap-5 my-5">
                      <div className="font-medium text-base">Sub Total</div>
                      <div className="">$120 * 2 = 240</div>
                    </div>

                    <div className="flex border-b items-center justify-between gap-5 my-5">
                      <div className="font-medium text-base">Discount <span className="text-green-400 text-sm">(5% off)</span></div>
                      <div className="text-green-400">-$15.12</div>
                    </div>

                    <div className="flex border-b items-center justify-between gap-5 my-5">
                      <div className="font-medium text-base">Tax</div>
                      <div className="text-secondary">$15.12</div>
                    </div>

                    <div className="flex border-b items-center justify-between gap-5 my-5">
                      <div className="font-medium text-base">Coupon <span className="text-secondary text-sm">(AB45789A)</span></div>
                      <div className="text-green-400">-$10</div>
                    </div>

                    <div className="flex items-center justify-between gap-5 my-5">
                      <div className="font-medium text-base">Total Amount</div>
                      <div className="text-secondary">$255.12</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col font-[500] mt-10 items-center justify-center">
                <div className=" bg-secondary w-full text-center text-white rounded-lg py-4"><button>Confirm Book</button></div>
                <div className="mt-3 text-secondary"> <button>Cancel Booking</button></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  export default ConfirmBooking
