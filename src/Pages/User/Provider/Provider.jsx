import React, { useEffect, useState } from 'react';
import Layout from '../../../Components/User/Layout';
import profiles from '../assets/new/img15.jpeg';
import gradient from '../../../assets/gradient.jpeg';
import { MdOutlineLocationOn, MdOutlineMyLocation } from 'react-icons/md';
import { useSelector } from 'react-redux';
import axios from 'axios';
import CustomDropdown from '../../../Components/General/DropDown';
import { Link } from 'react-router-dom';
import KycForm from './KycForm';

const Provider = () => {
    const { user } = useSelector((state) => state.data);
    const [isEditUserOpen, setIsEditUserOpen] = useState(false); // EditUser modal

    const [location, setLocation] = useState("Fetching location...");
    const handleOpenEditModal = () => {
        setIsEditUserOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditUserOpen(false);
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation(`Lat: ${latitude.toFixed(2)}, Lng: ${longitude.toFixed(2)}`);
                },
                async () => {
                    try {
                        const response = await axios.get('https://ipapi.co/json/');
                        const { city, region } = response.data;
                        setLocation(`${city}, ${region}`);
                    } catch (error) {
                        setLocation("Unable to fetch location");
                    }
                }
            );
        } else {
            (async () => {
                try {
                    const response = await axios.get('https://ipapi.co/json/');
                    const { city, region } = response.data;
                    setLocation(`${city}, ${region}`);
                } catch (error) {
                    setLocation("Unable to fetch location");
                }
            })();
        }
    }, []);

    return (
        <Layout>
            {/* Edit User Modal */}
            {isEditUserOpen && (
                <KycForm
                    closeView={handleCloseEditModal}

                />
            )}
            <div className="bg-gray w-full h-[20rem]">
                <div className="text-center pt-24">
                    <p className="font-[500] text-4xl mb-3">Provider Profile</p>
                    <span className="flex items-center gap-4 font-[500] justify-center">
                        <p className="text-primary">Home</p>
                        <span className="bg-[#6C757D] w-3 py-0.5"></span>
                        <p className="text-secondary">Provider Profile</p>
                    </span>
                </div>
            </div>
            <div className="xl:w-[80%] w-full px-5 xl:px-0 my-20 mx-auto">
                <div className="">
                    <img
                        src={gradient}
                        alt=""
                        className="h-16 w-full rounded-tl-xl rounded-tr-xl"
                    />
                    <div className="bg-white w-full px-10 py-5 h-[39rem] shadow-2xl">
                        <div className="">
                            <div className="flex items-center justify-between mb-3 gap-4 pb-3 border last:border-none">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={profiles}
                                        alt=""
                                        className="xl:w-20 xl:h-20 w-16 h-16 rounded-full object-cover"
                                    />
                                    <span className="flex-1">
                                        <h5 className="font-[500] text-sm xl:text-base">
                                            {user.firstname} {user.lastname}
                                        </h5>
                                        <p className="text-sm text-primary">{user.email}</p>
                                        <div className="">
                                            <div className="text-secondary cursor-pointer">
                                                Edit Profile
                                            </div>
                                        </div>
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="text-primary text-sm font-medium">
                                        Wallet Balance
                                    </div>
                                    <div className="text-secondary text-2xl">
                                        ${user.user_wallets[0].walletbal}
                                    </div>
                                </div>

                                {/* Location Section */}
                                <div className="border flex items-center justify-between px-10 py-3 gap-10 text-primary bg-white shadow-2xl">
                                    <MdOutlineLocationOn />
                                    <div>{location}</div>
                                    <MdOutlineMyLocation />
                                </div>
                            </div>
                        </div>

                        {/* Dropdowns Section */}
                        <div className="border-t grid grid-cols-2 mt-10 py-10 gap-4">
                            <div className="border py-3 px-2">
                                <Link to=''>Withdraw Earning</Link>
                            </div>
                            <div onClick={handleOpenEditModal} className="border py-3 px-2">
                                <Link to=''>KYC </Link>
                            </div>
                            <div className="border py-3 px-2">
                                <Link to=''>Change Password </Link>
                            </div>
                            <div className="border py-3 px-2">
                                <Link to=''>Chat Messages</Link>
                            </div>
                            <div className="border py-3 px-2">
                                <Link to=''>Settings</Link>
                            </div>
                            <div className="border py-3 px-2">
                                <Link to='/policy'>Privacy Policy</Link>
                            </div>
                            <div className="border py-3 px-2">
                                <Link to='/terms'>Terms & Conditions</Link>
                            </div>
                            <div className="border py-3 px-2">
                                <Link to=''>Help Support</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Provider;
