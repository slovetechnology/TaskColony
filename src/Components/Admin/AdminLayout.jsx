import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { FaTimes, FaUserCircle } from 'react-icons/fa';
import { SlMenu } from 'react-icons/sl';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';

const AdminLayout = ({ children }) => {
    const [mobile, setMobile] = useState(false);
    const [logs, setLogs] = useState(false);
    const { adminloggedin, admin } = useSelector(state => state.data);

    const handleLogs = (e) => {
        e.preventDefault();
        setLogs(!logs);
    };

    return (
        <div className="relative h-screen scrollsdown overflow-hidden">
            {/* Overlay when sidebar is open */}
            {mobile && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setMobile(false)}></div>}

            <div className="flex items-center h-full">
                {/* Sidebar */}
                <div className={`fixed top-0 left-0 h-full ${mobile ? 'w-full' : 'w-0'} xl:w-[14%]  border-r shadow-2xl transition-all bg-white z-50 scrollsdown overflow-y-auto`}>
                    <div className="flex justify-end p-4 xl:hidden">
                        <FaTimes onClick={() => setMobile(false)} className="cursor-pointer text-2xl text-gray-700" />
                    </div>
                    <AdminSidebar handleLogs={handleLogs} />
                </div>

                {/* Main Content */}
                <div className={`h-full ${mobile ? 'w-0' : 'w-full'} ml-auto transition-all overflow-hidden xl:w-[90%] relative`}>
                    <div className="h-[12vh] border-b shadow-2xl bg-white">
                        <div className="flex items-center justify-between pt-5 w-11/12 mx-auto">
                            <div>
                                <SlMenu onClick={() => setMobile(!mobile)} className='cursor-pointer xl:hidden text-navy font-bold text-xl' />
                            </div>
                            {adminloggedin && (
                                <div className="flex items-center gap-2">
                                    <FaUserCircle className="md:text-[3rem] text-2xl bg-gray-200" />
                                    <div className='hidden md:block'>
                                        <p className="mb-0">{admin?.userlevel_name || 'User'}</p>
                                        <p className="text-sm font-light text-secondary-500">{admin?.email}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="h-[88vh]  w-full lg:mx-10 mx-0 bg-gray overflow-y-auto scrollsdown relative">
                        {children}
                    </div>
                </div>
            </div>

            <Toaster position='top-center' />
        </div>
    );
};

export default AdminLayout;
