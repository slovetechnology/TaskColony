import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import animationData from '../../Lotties/task-colony';
import Lottie from 'react-lottie';
import { useSelector } from 'react-redux';
import { FaUserCircle, FaUserPlus } from 'react-icons/fa';
import { SlMenu } from 'react-icons/sl';
import { IoIosLogOut } from 'react-icons/io';

const Navbar = ({ closeView }) => {
    const { userloggedin, user } = useSelector(state => state.data); // Pulling from Redux
    const [isVisible, setIsVisible] = useState(true);
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
    };
    
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ duration: 0.5 }}
                    className="bg-white fixed top-0 z-[99] left-0 xl:w-[30%] w-[60%] h-[100%] shadow-2xl border"
                >

                    <div className="flex items-center my-5 gap-5">
                        <Link to="/" className="">
                            <Lottie options={defaultOptions} height={40} width={140} />
                        </Link>

                    </div>
                    <div className="grid grid-cols-1 leading-1 mx-10 font-medium gap-3 text-lg">
                        <div className="block items-center gap-6 font-medium text-[14px]">
                            {userloggedin ? <>
                                <div  className="cursor-pointer mb-4 hover:text-secondary">HOME</div>
                                <div className="cursor-pointer mb-4 hover:text-secondary">CATEGORIES</div>
                                <div className="cursor-pointer mb-4 hover:text-secondary">SERVICES</div>
                                <div className="cursor-pointer mb-4 hover:text-secondary">MY BOOKING</div>
                                <div className="cursor-pointer mb-4 hover:text-secondary">MY PROFILE</div>
                            </> : <>
                                <div  className="cursor-pointer mb-4 hover:text-secondary">HOME</div>
                                <div  className="cursor-pointer mb-4 hover:text-secondary">ABOUT US</div>
                                <div  className="cursor-pointer mb-4 hover:text-secondary">CATEGORIES</div>
                                <div className="cursor-pointer mb-4 hover:text-secondary">TEAM</div>
                            </>}
                        </div>
                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Navbar;
