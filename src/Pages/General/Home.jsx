// 
import React, { useCallback, useEffect, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { img1, img3, img4 } from 'utils/utils';
import { HomeServices, HomeTestimonials, img22, img23, img25, img26, StoreLinks } from '../../utils/utils';
import { FaArrowLeft, FaArrowRight, FaRegUserCircle, FaStar } from 'react-icons/fa';
import { Apis, AuthGeturl, Geturl, Posturl } from '../../Components/General/Api';
import { FaBars, FaTimes, FaUserCircle, FaUserPlus } from 'react-icons/fa';
import { IoIosLogOut, IoIosNotificationsOutline } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie';
import animationData from '../../Lotties/task-colony';
import { SlBell, SlMagnifier, SlMenu } from 'react-icons/sl';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { NavLinks, TopNavsLinks } from '../../utils/utils';
import Footer from '../../Components/User/Footer';
import { ErrorAlert, ToastAlert } from '../../Components/General/Utils';
import vector from '../../assets/Vector 10.png'
import Slider from "react-slick";

const ActiveTabOptions = [
    "email"
]

function Home() {
    const [offers, setOffers] = useState([]);
    const [message, setMessage] = useState();
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
    const [email, setEmail] = useState('');
    const profileImage = localStorage.getItem('profileImage') || user.passport;
    const [providers, setProvider] = useState(null);
    const [gallery, setGallery] = useState([]);
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1000,
    };

    const [notificationCount, setNotificationCount] = useState(0);
    const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

    const [activeButton, setActiveButton] = useState(null); // Track the active button

    const handlePrevTestimonial = () => {
        setActiveButton("prev"); // Set active button to "prev"
        setCurrentTestimonialIndex((prevIndex) =>
            prevIndex === 0 ? HomeTestimonials.length - 1 : prevIndex - 1
        );
    };

    const handleNextTestimonial = () => {
        setActiveButton("next"); // Set active button to "next"
        setCurrentTestimonialIndex((prevIndex) =>
            prevIndex === HomeTestimonials.length - 1 ? 0 : prevIndex + 1
        );
    };
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await AuthGeturl(Apis.users.all_notification);
                if (res.status === true && res.data.records) {
                    setNotificationCount(res.data.records.length);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };
        fetchNotifications();
    }, []);

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
                setOffers(res.data.dashboard_top_slider);
                setServices(res.data.random_services);
                setGallery(res.data.gallery_images);
                setCategory(res.data.categories);
                setMessage(res.data.home_message);
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

    const handleSubmission = async (e) => {
        e.preventDefault();
        if (!email) {
            return ErrorAlert('Email address is required');
        }

        const data = new FormData();
        data.append('email', email);

        try {
            const res = await Posturl(Apis.users.app_link, data);
            if (res.status === true) {
                ToastAlert(res.text)
                setEmail('');
            } else {
                ErrorAlert(res.data.text);
            }
        } catch (error) {
            ErrorAlert('An error occurred while verifying the booking.');
            console.error(error);
        }
    };
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
                            {userloggedin && <Link className='uppercase text-xs py-3 px-4 truncate' to='/user'>Profile</Link>}
                        </div>
                        <div className="flex items-center gap-3">

                            <Link to='/user' className="">
                                {userloggedin ? (
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <img src={profileImage} alt='User' className="w-9 h-9 rounded-full" />
                                            <div className='text-xs hidden xl:block pr-5'>
                                                <p className="mb-0">{user?.firstname || 'User'}</p>
                                                <p className="text-sm font-medium text-secondary-500">{user?.email}</p>
                                            </div>
                                        </div>
                                        <Link to="/notification" className='text-secondary text-xl lg:text-2xl relative '>
                                            <SlBell />
                                            {notificationCount > 0 && (
                                                <div className="absolute -top-2 -right-2 bg-black text-white flex items-center justify-center size-5 rounded-full text-[0.7rem]">
                                                    {notificationCount}
                                                </div>
                                            )}
                                        </Link>
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
                    <div className="overflow-hidden h-full relative">
                        <p className="text-end marquee pt-4 text-white whitespace-nowrap">
                            <div dangerouslySetInnerHTML={{ __html: message }} />

                        </p>
                    </div>
                </div>
            </div>

            <div className="relative z-10">
                <div className="bg-[#fff3e4] relative -z-50 h-auto">
                    <div className="grid grid-cols-1 pt-10 pb-4  -z-50 lg:grid-cols-7 w-11/12 lg:w-10/12 mx-auto">
                        <div className="lg:col-span-3 w-full h-full flex flex-col justify-center z-10 relative">
                            <div className="">
                                <h1>
                                    <div className="text-secondary text-2xl md:text-5xl font-bold">A One-Stop Place </div>
                                    <div className="font-bold text-2xl md:text-5xl">For Home Repair</div>
                                </h1>
                                <div className="text-xs w-[90%] mt-4">Your trusted partner for all home repairs. From plumbing to renovations, our skilled professionals deliver reliable solutions with ease.</div>
                            </div>
                            <div className="mt-10 mb-24">
                                <Link className='bg-secondary py-3 px-3 rounded-lg text-white' to="/booking-list">Book Now</Link>
                                <div className="flex items-center mt-5 gap-2">
                                    <LazyLoadImage
                                        effect="blur"
                                        className='size-5'
                                        src={img3}
                                    />
                                    <div className="text-sm">
                                        <div className="font-medium">Have any Questions?</div>
                                        <div className="text-slate-500">+1 720 573 1900</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="lg:col-span-4 -mt-32 -mb-3 -z-30 lg:-mt-20">
                            <LazyLoadImage
                                effect="blur"
                                className='w-full object-contain'
                                src={img1}
                            />
                        </div>

                    </div>

                </div>
                <div className=" md:-bottom-3.5 sm:-bottom-2  absolute lg:-bottom-5 w-full">
                    <img src={vector} alt="" className=" w-full md:h-36" />
                </div>
            </div>

            <div className="  mx-10 mt-10 lg:mt-28">
                <div className="grid grid-cols-1 lg:grid-cols-7">
                    <div className="lg:col-span-4 hidden lg:block">
                        <div className="relative">
                            <div className="absolute top-0 left-0 bg-[#E73D17] size-[8.75rem] rounded-full -mt-20"></div>
                            <div className="absolute top-0 left-0 bg-[#F29D8A] size-[2rem] rounded-full -mt-16 ml-[10rem]"></div>
                            <div className="absolute bottom-0 right-0 bg-gradient-to-r from-[#FFBC0A] to-[#FF3D3D] size-[9rem] md:size-[13rem] rounded-full -mt-14 md:-mt-20 mr-20"></div>
                            <div className="absolute bottom-7 right-0 bg-[#E73D17] size-[2rem] rounded-full mr-[18rem]"></div>
                            <LazyLoadImage
                                src={img4}
                                effect='blur'
                                className='w-full hidden lg:block h-full'
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="mt-10">
                            <div className="font-bold text-2xl  mb-8">A whole world of services at your door step</div>
                            {HomeServices.map((item, index) => (
                                <div className="flex gap-2" key={index}>
                                    <div>
                                        <div className="shadow-xl rounded-full size-12 flex items-center justify-center">
                                            <img src={item.img} alt="" className="size-6" />
                                        </div>
                                    </div>
                                    <div className="">
                                        <div className="font-[500] text-[17px]">{item.title}</div>
                                        <div className=" w-11/12 lg:w-3/4 mt-2 mb-3 text-[14px] text-primary">{item.content}</div>
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
                    {category.slice(0, 6).map((item, index) => (
                        <Link to={`/sub-category/${item.trackid}`} key={index}>
                            <div className="bg-white shadow-2xl h-[7rem] rounded-xl p-4">
                                <div className="bg-secondary p-3 rounded-full w-fit mx-auto -mt-14">
                                    <img src={item.icon} alt="" className="size-8 object-contain" />
                                </div>
                                <div className="text-center mt-5 mb-10 capitalize">{item.name}</div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="flex items-center justify-between mt-20">
                    <div className="font-medium text-2xl">Our Services</div>
                    <div className="">
                        <Link to='/service' className='flex items-center gap-2 text-sm'>See All <FaArrowRight className='text-yellow' /> </Link>
                    </div>
                </div>

                <div className="grid  items-center justify-center md:grid-cols-2 lg:grid-cols-4 gap-y-5 mt-7">
                    {services.slice(0, 8).map((item, index) => (
                        <div className="w-11/12 mx-auto" key={index}>
                            <div className="w-full">
                                <div className="relative w-full">
                                    <LazyLoadImage
                                        effect="blur"
                                        src={item.banner_image[0]}
                                        className="w-[20rem] h-[10rem] object-top md:w-[30rem] object-cover"
                                    />
                                    <div className="py-4 px-5 md:h-[7rem] bg-white rounded-b-3xl shadow-xl -mt-3">
                                        <div className="font-medium">{item.name}</div>
                                        <div className="text-xs capitalize text-slate-500 mt-3">{item.description}</div>
                                        <Link to={`/service-detail/${item.id}`} className='text-xs font-medium text-secondary'>View Details</Link>

                                    </div>
                                </div>
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

            <div className=" mt-7 mb-10 pl-0 w-[95%] mx-auto">
                <Slider {...settings}>
                    {offers.map((item, index) => (
                        <div className="flex space-x-7">
                            <div className="md:flex bg-white mx-10 px-3 py-5 shadow-xl mb-10  gap-4 items-center rounded-xl" key={index}>
                                <div className="">
                                    <LazyLoadImage src={item.imagelinks[0]} effect='blur' className='rounded-[2rem] h-[11rem] w-[30rem] border object-cover' />
                                </div>
                                <div className="w-[25rem]">
                                    <div className="text-sm text-slate-500">{item.title}</div>
                                    <div className="font-medium text-lg">{item.description}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>

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
                                    <div className="flex items-center gap-3">
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

                    <div className="flex items-center justify-center">
                        <LazyLoadImage src={HomeTestimonials[currentTestimonialIndex].img} className="object-cover w-full lg:w-[35rem] lg:h-[20rem]" effect="blur" />
                    </div>
                </div>
            </div>

            <div className="w-11/12 mx-auto lg:w-10/12 mb-10 mt-20">
                <div className="grid grid-cols-1 lg:grid-cols-7 rounded-3xl pt-10 px-5 lg:px-10 text-white" style={{ background: `url(${img25})center/cover no-repeat` }}>
                    <div className="lg:col-span-3 w-fit mx-auto -mb-1.5 lg:ml-auto order-2 lg:order-1">
                        <LazyLoadImage src={img26} className='object-cover h-full w-full' effect='blur' />
                    </div>
                    <div className="lg:col-span-4 order-1 lg:order-2">
                        <div className="flex flex-col justify-center">
                            <div className="text-[2.5rem] lg:text-[2.7rem] font-bold">Refer and get free services</div>
                            <div className="my-10">Let’s enjoy Task Colony various services and get latest offer and deals by downloading application</div>
                            <div className="grid grid-cols-1 lg:grid-cols-7 gap-5">
                                <div className="lg:col-span-5">
                                    <div className="flex items-center">
                                        {ActiveTabOptions.map((item, index) => (
                                            <button key={index} onClick={() => setActiveTab(item)} className={`${activeTab === item ? 'bg-white/50 backdrop-blur-sm' : ''} capitalize rounded-full text-white py-1 px-4`}>{item}</button>
                                        ))}
                                    </div>
                                    <div className="my-5">Enter your email address to receive a text with a link to download the app.</div>
                                    <form action="" onSubmit={handleSubmission}>
                                        <div className="bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center">
                                            <input name='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder={'yourmail@example.com'} type="text" className="outline-none placeholder:text-white bg-transparent p-2 w-full" />
                                            <button className='bg-white text-secondary w-10/12 py-2 px-3 rounded-lg'>Send</button>
                                        </div>
                                    </form>
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



            <Footer />
        </>
    )
}

export default Home