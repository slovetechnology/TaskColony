import React from 'react'
import Layout from '../../Components/User/Layout'
import grid from '../../assets/grid.svg'
import img1 from 'assets/brick.png'
import img2 from 'assets/zinc.png'
import { FaUsers, FaStar, FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import profiles from '../../assets/profile.png'
import review from '../../assets/review.png'
import icon1 from '../../assets/icon11.png'
import icon2 from '../../assets/icon12.png'
import icon3 from '../../assets/icon13.png'
import worker from '../../assets/about1.png'
import { IoIosArrowDroprightCircle } from 'react-icons/io'
import { Team } from '../../utils/utils'
const about = [
  { image: icon3, num: '250+', text: 'Authorized Team' },
  { image: icon1, num: '90+', text: 'Service Cites' },
  { image: icon2, num: '1400+', text: 'Happy Customers' },
]

const Aboutus = () => {
  return (
    <Layout>
      <div className="bg-gray w-full xl:h-[20rem]">
        <div className="text-center py-10 xl:pt-24">
          <p className='font-[500] text-4xl mb-3'>About Us</p>
          <span className='flex items-center gap-4 font-[500] justify-center'>
            <p className="text-primary">Home</p>
            <span className="bg-[#6C757D] w-3 py-0.5"></span>
            <p className="text-secondary">About Us</p>
          </span>
        </div>
      </div>

      <div className="">
        <div className="xl:flex items-center mx-auto xl:w-[80%] my-12 px-5 justify-center gap-10">
          <div className="">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-10 xl:w-[32rem]">
              <div className="bg-secondary text-white xl:w-[15rem] rounded-xl py-10 px-5 h-[12rem]">
                <h5 className="font-[500] text-5xl">1,548 +</h5>
                <p className="text-base">gave Services across the cities and world</p>
              </div>
              <img src={img1} alt="" className="rounded-xl w-full object-cover h-[12rem]" />
              <img src={img2} alt="" className="rounded-xl w-full md:col-span-2 object-cover md:h-[15rem] h-[12rem]" />
            </div>
          </div>

          <div className="2xl:mx-10">
            <span><h3 className='font-[700] leading-tight my-5 lg:text-2xl xl:text-[30px]'>A whole world of services at your door step</h3></span>
            <div className="lg:flex items-center gap-4">
              <div className="mb-3">
                <div className="rounded-full p-4 w-16 bg-icons shadow-2xl"> <img src={grid} alt="" /> </div>
              </div>
              <span className="">
                <h3 className="font-[500] text-[17px]">The Best For Every Budget</h3>
                <p className="text-[14px] text-primary">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. </p>
              </span>
            </div>

            <div className="lg:flex items-center my-12 gap-4">
              <div className="mb-3">
                <div className="rounded-full p-4 w-16 bg-icons shadow-2xl"> <img src={grid} alt="" /> </div>
              </div>
              <span className="">
                <h3 className="font-[500] text-[17px]">Quality work done quickly</h3>
                <p className="text-[14px] text-primary">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. </p>
              </span>
            </div>

            <div className="lg:flex items-center gap-4">
              <div className="mb-3">
                <div className="rounded-full p-4 w-16 bg-icons shadow-2xl text-secondary"> <FaUsers size={24} /> </div>
              </div>
              <span className="">
                <h3 className="font-[500] text-[17px]">24 hours customer support</h3>
                <p className="text-[14px] text-primary">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. </p>
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="bg-gray h-[44rem] lg:mt-28">
            <div className=" lg:w-[80%] mx-auto">
              <div className="lg:flex px-5 gap-7 pt-10  xl:pt-28 ">
                <div className="">
                  <p className="font-medium text-2xl mb-3">Experience in Number</p>
                  <p className="text-xs mb-3 text-primary">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters</p>
                  <p className="text-secondary text-xs italic">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. </p>
                </div>
                <div className="lg:flex items-center justify-center  xl:mt-0 mt-8 gap-6">
                  {about.map((item, i) => (
                    <div key={i} className="bg-white w-[12rem] mb-3 flex items-center justify-center flex-col lg:h-[12rem] py-3 rounded-xl">
                      <img src={item.image} alt="" className="xl:w-16 w-10 md:w-14" />
                      <div className="text-center lg:mt-6">
                        <p className="font-[500] text-xl xl:text-2xl">{item.num}</p>
                        <p className="text-primary text-xs xl:text-sm">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative text-white">
                <img src={worker} alt="" className="w-full xl:h-[26rem] h-[24rem] mt-10 hidden md:block object-cover object-top xl:rounded-xl" />
                <div className="absolute bg-secondary left-0 top-7 right-10 rounded-xl  px-5 py-7 h-[21rem] w-[16rem] xl:w-[18rem]">
                  <p className=" font-medium xl:text-3xl">Goal To Achieve</p>
                  <p className="text-xs mt-2">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. </p>
                  <div className="xl:mt-5 mt-3">
                    <p className="flex py-2 items-center gap-3 text-xs"><IoIosArrowDroprightCircle />Amet minim mollit non deserunt</p>
                    <p className="flex py-2 items-center gap-3 text-xs"><IoIosArrowDroprightCircle />Amet minim mollit non deserunt</p>
                    <p className="flex py-2 items-center gap-3 text-xs"><IoIosArrowDroprightCircle />Amet minim mollit non deserunt</p>
                    <p className="flex py-2 items-center gap-3 text-xs"><IoIosArrowDroprightCircle />Amet minim mollit non deserunt</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="mt-[20rem] lg:mt-[15rem]">
          <div className="flex items-center justify-center font-semibold text-3xl">Our Team</div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-y-16 mt-7">
            {Team.map((item,i) => (
              <div key={i} className="">
                <div className="flex items-center justify-center flex-col">
                  <div className=""> <img src={item.img} alt="" className="" /> </div>
                  <div className="">{item.title}</div>
                  <div className="">{item.position}</div>
                  <div className="text-sm  text-slate-500 break-keep text-center mx-12">{item.description }</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-[8rem] mx-10 mb-20">
          <div className="bg-black h-[44rem] md:h-[45rem]  xl:h-[32rem] xl:px-20 text-white my-10 xl:flex items-center justify-center gap-7 px-5 rounded-3xl xl:mx-0 mx-[rem] xl:rounded-[3rem]">
            <div className="my-6">
              <div className=""><h5 className="font-[500] text-[1.7rem] xl:text-[2rem] pt-6 -mt-10 mb-4 xl:mb-7">What our customers says</h5></div>
              <p className="mb-5">“ Excellent Service by handyman“</p>
              <i className="text-primary text-sm">On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer sur la mise en page elle-même.</i>
              <div className="xl:flex items-center mt-12 justify-between">
                <div className="flex items-start gap-2 xl:gap-4">
                  <img src={profiles} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <span className="">
                    <h5 className="">Cameron Williamson</h5>
                    <div className="flex items-center text-sm gap-3">
                      <span className="flex text-secondary gap-1">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                      </span>
                      <div className="text-primary">|</div>
                      <p className="text-primary">One week Ago</p>
                    </div>
                  </span>
                </div>
                <div className="flex justify-between xl:py-0  py-4 gap-3">
                  <div className='bg-secondary rounded-full p-3'> <FaArrowLeft /> </div>
                  <div className='border rounded-full p-3'> <FaArrowRight /> </div>
                </div>
              </div>
            </div>
            <img src={review} alt="" className=" rounded-[2rem] object-cover xl:w-[24rem] md:h-[18rem] md:w-full xl:h-[22rem]" />
          </div>
        </div>

        <div className="bg-gray xl:w-[80%] w-full h-auto xl:h-[15rem] mb-40 mt-10 xl:py-20 py-10 xl:px-20 mx-auto">
          <div className="flex flex-col xl:flex-row items-center justify-center mx-10 gap-10">
            <div className="text-center xl:text-left"> 
              <p className="font-[500] text-2xl">Subscribe to our newsletter</p>
              <p className="text-xs text-primary">Subscribe to the newsletter to receive exclusive offers, latest news, and updates</p>
            </div>
            <div className="flex flex-col xl:flex-row items-center w-full xl:w-auto"> {/* Stack in column on small, row on large */}
              <label className='bg-white gap-[10px] flex items-center h-16 w-full xl:w-[24rem] px-3 border-primary rounded-tl-md rounded-bl-md'>
                <input type="text" placeholder='Enter Your Email Address' className='w-full xl:w-[16rem] placeholder:text-xs placeholder:text-primary outline-none' />
              </label>
              <p className="bg-secondary px-7 text-white flex items-center h-16 w-full xl:w-auto justify-center xl:justify-start rounded-tr-md rounded-br-md mt-3 xl:mt-0">
                Subscribe
              </p>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  )
}

export default Aboutus
