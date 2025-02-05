import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../../Components/User/Layout';
import grid from '../../assets/grid.svg';
import img1 from 'assets/brick.png';
import img2 from 'assets/zinc.png';
import { FaUsers, FaStar, FaArrowLeft, FaArrowRight, FaRegUserCircle } from 'react-icons/fa';
import icon1 from '../../assets/icon11.png';
import icon2 from '../../assets/icon12.png';
import icon3 from '../../assets/icon13.png';
import worker from '../../assets/about1.png';
import { IoIosArrowDroprightCircle } from 'react-icons/io';
import { HomeTestimonials, Team } from '../../utils/utils';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Apis, Posturl } from '../../Components/General/Api';
import { ErrorAlert, ToastAlert } from '../../Components/General/Utils';

const about = [
  { image: icon3, num: '250+', text: 'Authorized Team' },
  { image: icon1, num: '90+', text: 'Service Cites' },
  { image: icon2, num: '1400+', text: 'Happy Customers' },
];

const Aboutus = () => {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [activeButton, setActiveButton] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const handlePrevTestimonial = () => {
    setActiveButton("prev");
    setCurrentTestimonialIndex((prevIndex) =>
      prevIndex === 0 ? HomeTestimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNextTestimonial = () => {
    setActiveButton("next");
    setCurrentTestimonialIndex((prevIndex) =>
      prevIndex === HomeTestimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const newsletter = async (data) => {
    try {
      const res = await Posturl(Apis.users.news_letter, { email: data.email });
      if (res.data.status === true) {
        ToastAlert(res.data.text);
      } else {
        ErrorAlert(res.text);
      }
    } catch (error) {
      ErrorAlert('An error occurred. Please try again later.');
    }
  };

  return (
    <Layout>
      <div className="bg-gray w-full xl:h-[10rem]">
        <div className="text-center py-10 pt-10">
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
            <h3 className='font-[700] leading-tight my-5 lg:text-2xl xl:text-[30px]'>A whole world of services at your door step</h3>
            <div className="lg:flex items-center gap-4">
              <div className="mb-3">
                <div className="rounded-full p-4 w-16 bg-icons shadow-2xl"><img src={grid} alt="" /></div>
              </div>
              <span>
                <h3 className="font-[500] text-[17px]">The Best For Every Budget</h3>
                <p className="text-[14px] text-primary">Affordable, high-quality services tailored to meet your needs without compromising on excellence.</p>
              </span>
            </div>

            <div className="lg:flex items-center my-12 gap-4">
              <div className="mb-3">
                <div className="rounded-full p-4 w-16 bg-icons shadow-2xl"><img src={grid} alt="" /></div>
              </div>
              <span>
                <h3 className="font-[500] text-[17px]">Quality Work Done Quickly</h3>
                <p className="text-[14px] text-primary">Efficient and reliable services delivered promptly without sacrificing quality.</p>
              </span>
            </div>

            <div className="lg:flex items-center gap-4">
              <div className="mb-3">
                <div className="rounded-full p-4 w-16 bg-icons shadow-2xl text-secondary"><FaUsers size={24} /></div>
              </div>
              <span>
                <h3 className="font-[500] text-[17px]">24 Hours Customer Support</h3>
                <p className="text-[14px] text-primary">We're here for you anytime, providing prompt assistance and ensuring you're satisfied around the clock</p>
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="bg-gray h-[44rem] lg:mt-28">
            <div className="lg:w-[80%] mx-auto">
              <div className="lg:flex px-5 gap-7 pt-10 xl:pt-28">
                <div>
                  <p className="font-medium text-2xl mb-3">Experience In Number</p>
                  <p className="text-xs mb-3 text-primary">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters</p>
                  <p className="text-secondary text-xs italic">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
                </div>
                <div className="md:flex items-center justify-center xl:mt-0 mt-8 gap-6">
                  {about.map((item, i) => (
                    <div key={i} className="bg-white md:w-[12rem] mb-3 flex items-center justify-center flex-col lg:h-[12rem] py-3 rounded-xl">
                      <img src={item.image} alt="" className="xl:w-16 w-10 md:w-14" />
                      <div className="text-center lg:mt-6">
                        <p className="font-[500] text-xl xl:text-2xl">{item.num}</p>
                        <p className="text-primary text-xs xl:text-sm">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative mx-3 text-white">
                <img src={worker} alt="" className="w-full xl:h-[26rem] h-[24rem] mt-10 hidden md:block object-cover object-top xl:rounded-xl" />
                <div className="md:absolute bg-secondary md:left-0 top-7 right-10 rounded-xl px-5 py-7 h-[21rem] w-full md:w-[18rem]">
                  <div>
                    <p className="font-medium xl:text-3xl">Goal To Achieve</p>
                    <p className="text-xs mt-2">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.</p>
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
        </div>

        {/* <div className="mt-[20rem] md:mt-[10rem ] mb-[5rem]">
          <div className="flex items-center justify-center font-semibold text-3xl">Our Team</div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-y-16 mt-7">
            {Team.map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-center flex-col">
                  <div><img src={item.img} alt={item.title} /></div>
                  <div>{item.title}</div>
                  <div>{item.position}</div>
                  <div className="text-sm text-slate-500 break-keep text-center mx-12">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        <div className="w-11/12 mx-auto lg:w-10/12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 bg-black rounded-3xl px-5 md:px-10 py-14 text-white">
            <div className="flex flex-col justify-center">
              <div className="flex items-center justify-between mt-10">
                <div className="font-medium text-2xl">What our customers say</div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-11/12">
                  <div className="font-medium text-xl">{HomeTestimonials[currentTestimonialIndex]?.title}</div>
                  <div className="text-slate-300 w-10/12 ml-4 leading-5 my-5 text-xs">
                    {HomeTestimonials[currentTestimonialIndex]?.content}
                  </div>
                  <div className="md:flex items-center mt-10 justify-between">
                    <div className="flex items-center gap-">
                      <div className="text-4xl"><FaRegUserCircle /></div>
                      <div className="text-sm mx-4">
                        <div className="font-medium">{HomeTestimonials[currentTestimonialIndex]?.name}</div>
                        <div className="flex items-center gap-1 mt-2 text-slate-300 text-xs">
                          {new Array(HomeTestimonials[currentTestimonialIndex]?.rating).fill(0).map((_, i) => (
                            <FaStar key={i} className={`text-secondary`} />
                          ))}
                          | {HomeTestimonials[currentTestimonialIndex]?.date}
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-row mt-3 items-center justify-between gap-3">
                      <button
                        onClick={handlePrevTestimonial}
                        className={`${activeButton === "prev" ? "bg-secondary" : "border border-white"} rounded-full size-10 text-white items-center justify-center flex`}
                      >
                        <FaArrowLeft />
                      </button>
                      <button
                        onClick={handleNextTestimonial}
                        className={`${activeButton === "next" ? "bg-secondary" : "border border-white"} rounded-full size-10 text-white items-center justify-center flex`}
                      >
                        <FaArrowRight />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <LazyLoadImage src={HomeTestimonials[currentTestimonialIndex].img} className="object-cover w-full object-top lg:w-[35rem] lg:h-[20rem]" effect="blur" />
          </div>
        </div>

        <div className="bg-gray xl:w-[80%] w-full h-auto xl:h-[15rem] mb-40 mt-10 xl:py-20 py-10 xl:px-20 mx-auto">
          <div className="flex flex-col xl:flex-row items-center justify-center mx-10 gap-10">
            <div className="text-center xl:text-left">
              <p className="font-[500] text-2xl">Subscribe to our Newsletter</p>
              <p className="text-xs text-primary">Subscribe to the Newsletter to receive exclusive offers, latest news, and updates</p>
            </div>
            <form onSubmit={handleSubmit(newsletter)} className="flex flex-col xl:flex-row items-center w-full xl:w-auto">
              <label className='bg-white gap-[10px] flex items-center h-16 w-[24rem] px-3 border-primary rounded-tl-md rounded-bl-md'>
                <input
                  type="email"
                  placeholder='Enter Your Email Address'
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Email is not valid',
                    }
                  })}
                  className='w-full xl:w-[16rem] placeholder:text-xs placeholder:text-primary outline-none'
                />
              </label>
              <button type='submit' className="bg-secondary px-7 text-white flex items-center h-16 w-full xl:w-auto justify-center xl:justify-start rounded-tr-md rounded-br-md mt-3 xl:mt-0">
                Subscribe
              </button>
              {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Aboutus;