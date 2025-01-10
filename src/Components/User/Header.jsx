import React, { useState, useEffect, useCallback } from 'react';
import { FaBars, FaTimes, FaUserCircle, FaUserPlus } from 'react-icons/fa';
import { IoIosLogOut } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie';
import animationData from '../../Lotties/task-colony';
import { SlBell, SlMenu } from 'react-icons/sl';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { NavLinks, TopNavsLinks } from '../../utils/utils';
import { AuthGeturl, Apis, Geturl } from '../../Components/General/Api'; // Assuming this is the API service

const Header = () => {
  const { userloggedin, user } = useSelector((state) => state.data); // Pulling from Redux
  const navigate = useNavigate();
  const [mobile, setMobile] = useState(false);
  const MobileIcon = mobile ? FaTimes : SlMenu;
  const [topNav, setTopNav] = useState(false);
  const TopNavIcon = topNav ? FaTimes : SlMenu;
  const [message, setMessage] = useState();
  const [notificationCount, setNotificationCount] = useState(0); // State for notification count
  const [loading, setLoading] = useState(true);
const [error, setError] = useState(false)
  const fetchAllHome = useCallback(async () => {
    setLoading(true);
    try {
      const res = await Geturl(Apis.users.get_system);
      if (res.status === true) {
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

  // Fetch notifications count
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

  return (
    <div className='relative'>
      <div className={`fixed w-full bg-white z-50 border-b shadow-xl lg:py-5 py-4 gap-10 ${topNav ? 'h-[16rem]' : 'h-[4.6rem]'} transition-all`}>
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
                    <FaUserCircle className="lg:text-[2rem] text-[1rem] bg-gray-200" />
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
            <div className="" dangerouslySetInnerHTML={{ __html: message }} />
          </p>
        </div>
      </div>




    </div>
  );
};

export default Header;
