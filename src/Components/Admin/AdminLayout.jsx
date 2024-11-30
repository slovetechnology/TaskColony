import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { FaSearch, FaTimes, FaUserCircle } from 'react-icons/fa';
import { SlMenu } from 'react-icons/sl';
import { Toaster } from 'react-hot-toast';
import profiles from '../../assets/profile.png';
import { useSelector } from 'react-redux';

const AdminLayout = ({ children }) => {
    const [mobile, setMobile] = useState(false);
    const Icon = mobile ? FaTimes : SlMenu;
    const [logs, setLogs] = useState(false);
    const { adminloggedin, admin } = useSelector(state => state.data); // Pulling from Redux

    const handleLogs = (e) => {
        e.preventDefault();
        setLogs(!logs);
    };

    return (
        <div className="relative h-screen overflow-hidden">
            <div className="flex items-center h-full">
                <div className={`h-full ${mobile ? 'w-[20vw]' : 'w-0'} border-r shadow-2xl transition-all xl:w-[15%] scrollsdown overflow-y-auto`}>
                    <AdminSidebar handleLogs={handleLogs} />
                </div>
                <div className={`h-full ${mobile ? 'w-[80vw]' : 'w-full'} ml-auto transition-all overflow-hidden xl:w-[90%] relative`}>
                    <div className="h-[12vh] border-b shadow-2xl bg-white">
                        <div className="flex items-center justify-between pt-5 w-11/12 mx-auto">
                            <div>
                                <Icon onClick={() => setMobile(!mobile)} className='cursor-pointer xl:hidden text-navy font-bold text-xl' />
                            </div>
                            {adminloggedin && (
                                <div className="flex items-center gap-2">
                                    <FaUserCircle className="text-[3rem] bg-gray-200" />
                                    <div>
                                        <p className="mb-0">{admin?.userlevel_name || 'User'}</p>
                                        <p className="text-sm font-light text-secondary-500">{admin?.email}</p>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                    <div className="h-[88vh] bg-gray overflow-y-auto scrollsdown relative">
                        {children}
                    </div>
                </div>
            </div>
            <Toaster position='top-center' />
        </div>
    );
};

export default AdminLayout;
