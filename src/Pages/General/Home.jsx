import React, { useCallback, useEffect, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { img1, img3, img4 } from 'utils/utils';
import { HomeBestOffers, HomeCategories, HomeGallery, HomeOurServices, HomeProviders, HomeServices, HomeTestimonials, img22, img23, img25, img26, StoreLinks } from '../../utils/utils';
import { FaArrowLeft, FaArrowRight, FaCheck, FaHeart, FaStar } from 'react-icons/fa';
import Layout from '../../Components/User/Layout';
import { Apis, Geturl } from '../../Components/General/Api';

import { FaBars, FaTimes, FaUserCircle, FaUserPlus } from 'react-icons/fa';
import { IoIosLogOut, IoIosNotificationsOutline } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie';
import animationData from '../../Lotties/task-colony';
import { SlBell, SlMagnifier, SlMenu } from 'react-icons/sl';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { NavLinks, TopNavsLinks } from '../../utils/utils';

const ActiveTabOptions = [
    "mobile", "email"
]

function Home() {
    const [offers, setOffers] = useState([]);
    const [services, setServices] = useState([]);
    const [category, setCategory] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userloggedin, user } = useSelector(state => state.data); // Pulling from Redux
    const navigate = useNavigate();
    const [mobile, setMobile] = useState(false)
    const MobileIcon = mobile ? FaTimes : SlMenu
    const [topNav, setTopNav] = useState(false)
    const TopNavIcon = topNav ? FaTimes : SlMenu

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };
    const handleLogout = () => {
        Cookies.remove('taskcolony');
        sessionStorage.clear();
        navigate('/login');
        window.location.reload();
    };

    // Fetch bookings
    const fetchAllHome = useCallback(async () => {
        setLoading(true);
        try {
            const res = await Geturl(Apis.users.get_system);
            if (res.status === true) {
                setOffers(res.data.dashboard_middle_slider);
                setServices(res.data.random_services);
                setCategory(res.data.data);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllHome();
    }, [fetchAllHome]);

    const [activeTab, setActiveTab] = useState(ActiveTabOptions[0])
    return (
        <>
            <div className='relative'>
                <div className={`fixed w-full bg-primary z-50 border-b shadow-xl lg:py-5 py-4 gap-10 ${topNav ? 'h-[16rem]' : 'h-[4.6rem]'} transition-all`}>
                    <div className='flex items-center justify-between px-5 lg:px-10'>
                        <div className="flex items-center gap-5">
                            <Link to="/" className="hidden lg:block">
                                <Lottie options={defaultOptions} height={40} width={140} />
                            </Link>
                            <Link to="/" className="lg:hidden block">
                                <Lottie options={defaultOptions} height={40} width={125} />
                            </Link>

                        </div>
                        <div className="lg:flex flex-row items-center gap-4 hidden">
                            {TopNavsLinks.map((item, index) => (
                                <Link to={item.link} key={index} className='uppercase text-xs py-3 px-4 truncate'>{item.title}</Link>
                            ))}
                        </div>
                        <div className="flex items-center gap-3">
                            <Link to='/user' className="">
                                {userloggedin ? (
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <FaUserCircle className="lg:text-[2rem] text-[1rem] bg-gray-200" />
                                            <div className='text-xs hidden xl:block pr-5'>
                                                <p className="mb-0">{user?.firstname || 'User'}</p>
                                                <p className="text-sm font-medium text-secondary-500">{user?.email}</p>
                                            </div>
                                        </div>

                                        <div className="xl:hidden flex text-xl lg:text-2xl cursor-pointer">
                                            <div onClick={handleLogout} className="flex cursor-pointer items-center text-secondary gap-2">
                                                <IoIosLogOut />
                                            </div>
                                        </div>

                                        <div className="hidden xl:flex">
                                            <div onClick={handleLogout} className="flex cursor-pointer items-center text-secondary gap-2">
                                                <IoIosLogOut /> Logout
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="">
                                        <div className="hidden xl:flex">
                                            <div
                                                onClick={() => navigate('/login')}
                                                className="bg-secondary flex text-white gap-2 h-11 w-[9.5rem] justify-center rounded-md items-center cursor-pointer"
                                            >
                                                <FaUserPlus /> Login/Register
                                            </div>

                                        </div>
                                        <div onClick={() => navigate('/user')} className="block text-3xl mx-5 xl:hidden">
                                            <FaUserCircle />
                                        </div>
                                    </div>
                                )}
                            </Link>

                            <div className="xl:hidden flex text-xl lg:text-2xl cursor-pointer">
                                <TopNavIcon onClick={() => setTopNav(!topNav)} />
                            </div>
                        </div>
                    </div>
                    {topNav && <div className="w-11/12 lg:w-10/12 mx-auto mt-6">
                        <div className="flex flex-col">

                            {TopNavsLinks.map((item, index) => (
                                <Link to={item.link} key={index} className='uppercase text-xs py-3 px-4 truncate'>{item.title}</Link>
                            ))}
                        </div>
                    </div>}
                </div>
                <br />
                <br />
                <div className={`bg-secondary z-10 relative mt-6 transition-all ${mobile ? 'h-[30rem]' : 'h-[3.5rem]'}`}>
                    <div className="lg:hidden ml-auto py-3 w-fit mr-10">
                        <MobileIcon onClick={() => setMobile(!mobile)} className='text-white text-2xl cursor-pointer' />
                    </div>
                    <div className={` ${mobile ? 'flex flex-col' : 'flex-row hidden lg:flex items-center justify-center'} gap-1 w-11/12 lg:w-10/12 mx-auto py-3`}>
                        {NavLinks.map((item, index) => (
                            <Link to={`${item.link}`} key={index} className='text-xs hover:text-white transition-all truncate uppercase text-orange-100 py-3 px-3'>{item.title}</Link>
                        ))}
                        {mobile ?
                            <Link to={``} className='text-xs truncate uppercase hover:text-white transition-all text-orange-100 py-3 px-3'>notifications</Link>
                            : <Link to="" className='text-white relative text-sm'> <SlBell /> <div className="absolute -top-2 -right-2 bg-black text-white flex items-center justify-center size-4 rounded-full text-[0.7rem]">1</div> </Link>}
                    </div>
                </div>
            </div>
            <div className="h-fit lg:h-[50rem] hmbanner relative lg:-mt-24 pt-10 lg:pt-0 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-7 w-11/12 lg:w-10/12 mx-auto">
                    <div className="lg:col-span-3 w-full h-full flex flex-col justify-center z-10 relative">
                        <div className="">
                            <h1>
                                <div className="text-secondary text-4xl md:text-5xl font-bold">A One-Stop Place </div>
                                <div className="font-bold text-4xl md:text-5xl">For Home Repair</div>
                            </h1>
                            <div className="text-xs w-[90%] mt-4">Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Pellentesque in ipsum id orci porta dapibus.t</div>
                        </div>
                        <div className="mt-10">
                            <Link className='bg-secondary py-3 px-3 rounded-lg text-white' to="">Book Now</Link>
                        </div>
                        <div className="md:mt-10 mt-40 gap-2">
                            <div className="flex md:-mt-0 gap-2 items-center -mt-32">
                                <LazyLoadImage
                                    effect="blur"
                                    className='size-5'
                                    src={img3}
                                />
                                <div className="text-sm">
                                    <div className="font-medium">Have any Questions?</div>
                                    <div className="text-slate-500">+0 123 888 555</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-4 relative -mt-32 lg:-mt-0">
                        <LazyLoadImage
                            effect="blur"
                            className='w-full object-contain lg:h-[51rem]'
                            src={img1}
                        />
                    </div>
                </div>
            </div>
            <div className="w-11/12 lg:w-10/12 mx-auto mt-28">
                <div className="grid grid-cols-1 lg:grid-cols-7">
                    <div className="lg:col-span-4">
                        <div className="relative">
                            <div className="absolute top-0 left-0 bg-[#E73D17] size-[8.75rem] rounded-full -mt-20"></div>
                            <div className="absolute top-0 left-0 bg-[#F29D8A] size-[2rem] rounded-full -mt-16 ml-[10rem]"></div>
                            <div className="absolute bottom-0 right-0 bg-gradient-to-r from-[#FFBC0A] to-[#FF3D3D] size-[9rem] md:size-[13rem] rounded-full -mt-14 md:-mt-20 mr-20"></div>
                            <div className="absolute bottom-7 right-0 bg-[#E73D17] size-[2rem] rounded-full mr-[18rem]"></div>
                            <LazyLoadImage
                                src={img4}
                                effect='blur'
                                className='w-full h-full'
                            />
                        </div>
                    </div>
                    <div className="lg:col-span-3">
                        <div className="mt-10">
                            <div className="font-bold text-3xl w-4/5 mb-8">A whole world of services
                                at your door step</div>
                            {HomeServices.map((item, index) => (
                                <div className="flex gap-2" key={index}>
                                    <div>
                                        <div className="shadow-xl rounded-full size-12 flex items-center justify-center">
                                            <img src={item.img} alt="" className="size-6" />
                                        </div>
                                    </div>
                                    <div className="">
                                        <div className="font-medium">{item.title}</div>
                                        <div className="text-slate-500 text-xs w-11/12 lg:w-3/4 mt-2 mb-3">{item.content}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 mt-20 mb-20">
                    <div className="lg:col-span-2"></div>
                    <div className="flex  lg:col-span-3 items-center justify-between">
                        <div className="font-medium text-2xl">Categories</div>
                        <div className="">
                            <Link to='/category' className='flex items-center gap-2 text-sm'>See All <FaArrowRight className='text-yellow' /> </Link>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-12 lg:gap-y-16 gap-x-4">
                    {HomeCategories.map((item, index) => (
                        <div className="bg-white shadow-2xl rounded-xl p-4" key={index}>
                            <div className="bg-secondary p-3 rounded-full w-fit mx-auto -mt-14"><img src={item.img} alt="" className="size-8" /></div>
                            <div className="text-center mt-5 mb-10 capitalize">{item.title}</div>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-between mt-20">
                    <div className="font-medium text-2xl">Our Services</div>
                    <div className="">
                        <Link to='/service' className='flex items-center gap-2 text-sm'>See All <FaArrowRight className='text-yellow' /> </Link>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-5 mt-7">
                    {services.map((item, index) => (
                        <div className="w-11/12 mx-auto" key={index}>
                            <div className="relative">

                                <LazyLoadImage
                                    effect="blur"
                                    src={item.banner_image[0]}
                                    className="w-[40rem] h-[10rem] object-top md:w-[30rem] object-cover"
                                />
                            </div>
                            <div className="py-4 px-5 bg-white rounded-b-3xl shadow-xl -mt-3">
                                <div className="font-medium">{item.name}</div>
                                <div className="text-xs capitalize text-slate-500 mt-3">{item.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex  items-center justify-between mt-10">
                    <div className="font-medium text-2xl">Best Offers</div>
                    <div className="">
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto scrollsdown mt-7 mb-2 pl-0 w-[95%] mx-auto  md:pl-20 lg:pl-">
                <div className="w-fit flex items-center gap-5">
                    {HomeBestOffers.map((item, index) => (
                        <div className="flex bg-white px-3 py-5 shadow-xl mb-10 gap-3 items-center rounded-xl" key={index}>
                            <div className="">
                                <LazyLoadImage src={item.img} effect='blur' className='rounded-[2rem] h-[11rem] w-[30rem] border object-cover' />
                            </div>
                            <div className="w-[25rem]">
                                <div className="text-sm text-slate-500">{item.tag}</div>
                                <div className="font-medium text-lg">{item.title}</div>
                                <div className="text-slate-600 text-xs my-3"> {item.deal && <span className='text-secondary'>{item.deal}% off </span>} {item.sub} </div>

                                <button className="bg-secondary py-2 px-6 rounded-full text-white text-xs">From ${item.price}</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-11/12 mx-auto lg:w-10/12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 bg-black rounded-3xl px-10 py-14 text-white">
                    <div className="flex flex-col justify-center">
                        <div className="font-medium text-4xl mb-6">What our customers says</div>
                        <div className="">
                            {HomeTestimonials.map((item, index) => (
                                <div className="w-11/12" key={index}>
                                    <div className="font-medium text-xl">{item.title}</div>
                                    <div className="text-slate-300 w-10/12 ml-4 leading-5 my-5 text-xs">{item.content}</div>
                                    <div className="flex items-center mt-10 justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="">
                                                <LazyLoadImage src={item.img} effect='blur' className='size-12' />
                                            </div>
                                            <div className="text-sm mx-4">
                                                <div className="font-medium">{item.name}</div>
                                                <div className="flex items-center mt-2 text-slate-300 text-xs">
                                                    {new Array(5).fill(0).map((_, i) => (
                                                        <FaStar key={i} className={`text-secondary`} />
                                                    ))}
                                                    | One week Ago
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-row items-center gap-3">
                                            <button className="bg-secondary rounded-full size-10 text-white items-center justify-center flex"> <FaArrowLeft /> </button>
                                            <button className="border border-white rounded-full size-10 text-white items-center justify-center flex"> <FaArrowRight /> </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="">
                        <LazyLoadImage
                            src={img23}
                            className='object-cover'
                            effect='blur'
                        />
                    </div>
                </div>
            </div>
            <div className="w-11/12 mx-auto lg:w-10/12 mt-20">
                <div className="grid grid-cols-1 lg:grid-cols-7 rounded-3xl pt-10 px-5 lg:px-10 text-white" style={{ background: `url(${img25})center/cover no-repeat` }}>
                    <div className="lg:col-span-3 w-fit mx-auto -mb-1.5 lg:ml-auto order-2 lg:order-1">
                        <LazyLoadImage src={img26} className='object-cover h-full w-full' effect='blur' />
                    </div>
                    <div className="lg:col-span-4 order-1 lg:order-2">
                        <div className="flex flex-col justify-center">
                            <div className="text-[2.5rem] lg:text-[2.7rem] font-bold">Refer and get free services</div>
                            <div className="my-10">Let’s enjoy handyman various services and get latest offer and deals by downloading application</div>
                            <div className="grid grid-cols-1 lg:grid-cols-7 gap-5">
                                <div className="lg:col-span-5">
                                    <div className="flex items-center">
                                        {ActiveTabOptions.map((item, index) => (
                                            <button key={index} onClick={() => setActiveTab(item)} className={`${activeTab === item ? 'bg-white/50 backdrop-blur-sm' : ''} capitalize rounded-full text-white py-1 px-4`}>{item}</button>
                                        ))}
                                    </div>
                                    <div className="my-5">Enter your {activeTab === ActiveTabOptions[0] ? 'phone number' : 'email address'} to receive a text with a link to download the app.</div>
                                    <div className="bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center">
                                        <input placeholder={activeTab === ActiveTabOptions[0] ? '+91 Mobile Number' : 'yourmail@example.com'} type="text" className="outline-none placeholder:text-white bg-transparent p-2 w-full" />
                                        <button className='bg-white text-secondary w-10/12 py-2 px-3 rounded-lg'>Search</button>
                                    </div>
                                </div>
                                <div className="lg:col-span-2 relative flex items-center gap-3">
                                    <img src={img22} alt="" className="" />
                                    <div className="flex flex-col items-center gap-3">
                                        {StoreLinks.map((item, index) => (
                                            <Link to="" className='' key={index}>
                                                <LazyLoadImage src={item.img} effect='blur' className='' />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-zinc-200 py-10 mt-20">
                <div className="w-11/12 mx-auto lg:w-10/12">
                    <div className="flex  items-center justify-between">
                        <div className="font-medium text-2xl capitalize">our Work gallery</div>
                        <div className="">
                            <Link className='flex items-center gap-2 text-sm'>See All <FaArrowRight className='text-yellow' /> </Link>
                        </div>
                    </div>
                    <div className="mt-8">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {HomeGallery.map((item, index) => (
                                <LazyLoadImage key={index} src={item.img} className='' effect='blur' />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-11/12 mx-auto lg:w-10/12 mb-20">
                <div className="flex  items-center justify-between mt-20">
                    <div className="font-medium text-2xl capitalize">our best providers</div>
                    <div className="">
                        <Link className='flex items-center gap-2 text-sm'>See All <FaArrowRight className='text-yellow' /> </Link>
                    </div>
                </div>
                <div className="mt-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {HomeProviders.map((item, index) => (
                            <div key={index} className="bg-white shadow-lg rounded-3xl">
                                <LazyLoadImage src={item.img} className='w-[40rem] md:w-[30rem] object-cover' effect='blur' />
                                <div className="px-4 py-5 -mt-5 rounded-b-2xl ">
                                    <div className="text-center text-xl font-semibold">{item.title}</div>
                                    <div className="text-center text-secondary text-xs">{item.tag}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home