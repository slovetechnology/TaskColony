import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie to manage cookies
import { IoGridOutline } from 'react-icons/io5';
import { IoIosLogOut } from 'react-icons/io';
import Lottie from 'react-lottie';
import animationData from '../../Lotties/task-colony'; // Path to your Lottie animation

const AdminSidebar = () => {
    const navigate = useNavigate(); // Hook to handle navigation

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData, // Lottie animation data
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    // Function to handle navigation
    const handleNavigation = (path) => {
        navigate(path);
    };

    // Function to handle logout
    const handleLogout = () => {
        Cookies.remove('taskcolony');
        sessionStorage.clear();

        navigate('/auth/admin/login');
    };

    return (
        <div className="admin-sidebar">
            <div className="border-b py-8">
                <div onClick={() => handleNavigation('/auth/admin')} className="logo-container">
                    <Lottie
                        options={defaultOptions}
                        height={40}
                        width={140}
                    />
                </div>
            </div>

            <div className="sidebar-menu text-sm">
                <div className="border-b p-4">
                    <p className="text-sm font-medium pb-3">MAIN MENU</p>
                    <div onClick={() => handleNavigation('/auth/admin')} className="flex cursor-pointer hover:text-secondary items-center pb-3 gap-2">
                        <IoGridOutline /> Dashboard
                    </div>
                    <div onClick={() => handleNavigation('/auth/admin/booking')} className="flex cursor-pointer hover:text-secondary items-center pb-3 gap-2">
                        <IoGridOutline /> Bookings
                    </div>
                </div>

                <div className="border-b p-4">
                    <p className="text-sm font-medium pb-3">SETTINGS</p>
                    <div onClick={() => handleNavigation('/auth/admin/service')} className="flex cursor-pointer hover:text-secondary items-center pb-3 gap-2">
                        <IoGridOutline /> Services
                    </div>
                    <div onClick={() => handleNavigation('/auth/admin/category')} className="flex cursor-pointer hover:text-secondary items-center pb-3 gap-2">
                        <IoGridOutline /> Categories
                    </div>
                </div>

                <div className="border-b p-4">
                    <p className="text-sm font-medium pb-3">ACCOUNTS</p>
                    <div onClick={() => handleNavigation('/auth/admin/user')} className="flex cursor-pointer hover:text-secondary items-center pb-3 gap-2">
                        <IoGridOutline /> All Users
                    </div>
                    <div onClick={() => handleNavigation('/auth/admin/provider')} className="flex cursor-pointer hover:text-secondary items-center pb-3 gap-2">
                        <IoGridOutline /> All Provider
                    </div>
                    <div onClick={() => handleNavigation('/auth/admin/admin')} className="flex cursor-pointer hover:text-secondary items-center pb-3 gap-2">
                        <IoGridOutline /> All Admins
                    </div>
                </div>

                <div className="border-b p-4">
                    <p className="text-sm font-medium pb-3">SYSTEM</p>
                    <div onClick={() => handleNavigation('/auth/admin/slider')} className="flex cursor-pointer hover:text-secondary items-center pb-3 gap-2">
                        <IoGridOutline /> Slider
                    </div>
                    <div onClick={() => handleNavigation('/auth/admin/faqs')} className="flex cursor-pointer hover:text-secondary items-center pb-3 gap-2">
                        <IoGridOutline /> FAQs
                    </div>
                    <div onClick={() => handleNavigation('/auth/admin/news-letter')} className="flex cursor-pointer hover:text-secondary items-center pb-3 gap-2">
                        <IoGridOutline /> News Letter
                    </div>
                    <div onClick={() => handleNavigation('/auth/admin/earning')} className="flex cursor-pointer hover:text-secondary items-center pb-3 gap-2">
                        <IoGridOutline /> Earning
                    </div>
                    <div onClick={() => handleNavigation('/auth/admin/coupon')} className="flex cursor-pointer hover:text-secondary items-center pb-3 gap-2">
                        <IoGridOutline /> Coupon
                    </div>
                    <div onClick={() => handleNavigation('/auth/admin/tax')} className="flex cursor-pointer hover:text-secondary items-center pb-3 gap-2">
                        <IoGridOutline /> Taxes
                    </div>
                    <div onClick={() => handleNavigation('/auth/admin/testemonial')} className="flex cursor-pointer hover:text-secondary items-center pb-3 gap-2">
                        <IoGridOutline /> Testemonial
                    </div>
                    <div onClick={() => handleNavigation('/auth/admin/marquee')} className="flex cursor-pointer hover:text-secondary items-center pb-3 gap-2">
                        <IoGridOutline /> Marquee
                    </div>
                    <div onClick={() => handleNavigation('/auth/admin/market')} className="flex cursor-pointer hover:text-secondary items-center gap-2">
                        <IoGridOutline /> Marketing Message
                    </div>
                </div>

                <div className="border-b p-4">
                    <div onClick={handleLogout} className="flex cursor-pointer hover:text-secondary items-center text-sm pb-3 gap-2">
                        <IoIosLogOut /> Logout
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;
