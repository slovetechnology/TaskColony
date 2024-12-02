import React, { useState } from 'react';
import { FaBars, FaTimes, FaUserCircle, FaUserPlus } from 'react-icons/fa';
import { IoIosLogOut, IoIosNotificationsOutline } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie';
import animationData from '../../Lotties/task-colony';
import { SlBell, SlMagnifier, SlMenu } from 'react-icons/sl';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { NavLinks, TopNavsLinks } from '../../utils/utils';

const Header = () => {
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
          </div>
          <div className="flex items-center gap-3">
            <Link to='/login' className="">
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
  );
};

export default Header;


{/* <div className="z-10 relative">
<div className=" py-5 bg-secondary-light">
    <div className="flex items-center justify-between lg:justify-center gap-8 w-11/12 lg:w-10/12 mx-auto">
        <div className="">
            <Link to="">
                <LazyLoadImage
                    effect="blur"
                    src={logo}
                    className='h-full w-32'
                />
            </Link>
        </div>
        <div className="lg:flex flex-row items-center gap-4 hidden">
            <div className="border border-slate-500 w-[15rem] rounded-md p-2 flex items-center gap-1">
                <input type="text" placeholder='What are you looking for today?' className="outline-none w-full text-xs bg-transparent" />
                <SlMagnifier className='text-zinc-400 text-xs' />
            </div>
            {TopNavsLinks.map((item, index) => (
                <Link to={item.link} key={index} className='uppercase text-xs py-3 px-4 truncate'>{item.title}</Link>
            ))}
        </div>
        <div className="">
            <Link to="">
                <div className='text-white bg-secondary truncate py-1.5 px-4 flex items-center gap-1 rounded-md text-xs'> <img src={img2} alt="" className="size-3" /> Login/Register</div>
            </Link>
        </div>
    </div>
</div>
<div className="bg-secondary">
    <div className="lg:hidden ml-auto py-3 w-fit mr-10">
        <SlMenu className='text-white text-2xl cursor-pointer' />
    </div>
    <div className="hidden lg:flex flex-row gap-1 items-center justify-center w-11/12 lg:w-10/12 mx-auto py-2">
        {NavLinks.map((item, index) => (
            <Link to={`${item.link}`} key={index} className='text-xs truncate uppercase text-orange-100 py-3 px-3'>{item.title}</Link>
        ))}
        <Link to="" className='text-white relative text-sm'> <SlBell /> <div className="absolute -top-2 -right-2 bg-black text-white flex items-center justify-center size-4 rounded-full text-[0.7rem]">1</div> </Link>
    </div>
</div>
</div> */}