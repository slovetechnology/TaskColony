import React, { useEffect, useState } from 'react';
import Layout from '../../../Components/User/Layout';
import gradient from '../../../assets/gradient.jpeg';
import { MdOutlineLocationOn, MdOutlineMyLocation } from 'react-icons/md';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import FavouriteService from './FavouriteService';
import EditUser from './EditUser';
import ChangePassword from './ChangePassword';
import Settings from './Settings';
import FundWallet from './Funds/FundWallet';

const User = () => {
    const { user } = useSelector((state) => state.data);
    const [location, setLocation] = useState("Fetching location...");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditUserOpen, setIsEditUserOpen] = useState(false);
    const [changePass, SetChangePass] = useState(false);
    const [settings, SetSettings] = useState(false);
    const [fundWallet, SetFundwallet] = useState(false);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation(`Lat: ${latitude.toFixed(2)}, Lng: ${longitude.toFixed(2)}`);
                },
                async () => {
                    fetchLocation();
                }
            );
        } else {
            fetchLocation();
        }
    }, []);

    const fetchLocation = async () => {
        try {
            const response = await axios.get('https://ipapi.co/json/');
            const { city, country_name } = response.data;
            setLocation(`${city}, ${country_name}`);
        } catch (error) {
            setLocation("Unable to fetch location");
        }
    };

    const handleOpenEditModal = () => {
        setIsEditUserOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditUserOpen(false);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOpenChangePass = () => {
        SetChangePass(true);
    };

    const handleCloseChangePass = () => {
        SetChangePass(false);
    };

    const handleOpenSettings = () => {
        SetSettings(true);
    };

    const handleCloseSettings = () => {
        SetSettings(false);
    };

    const handleOpenFundWallet = () => {
        SetFundwallet(true);
    };

    const handleCloseFundWallet = () => {
        SetFundwallet(false);
    };
  
    return (
        <Layout>
            <div className="bg-gray w-full xl:h-[20rem]">
                <div className="text-center py-10 xl:pt-24">
                    <p className="font-[500] xl:text-4xl text-xl mb-3">User Profile</p>
                    <span className="flex items-center gap-4 font-[500] justify-center">
                        <p className="text-primary">Home</p>
                        <span className="bg-[#6C757D] w-3 py-0.5"></span>
                        <p className="text-secondary">User Profile</p>
                    </span>
                </div>
            </div>
            <div className="xl:w-[80%] w-full px-2 xl:px-0 xl:my-20 my-10 mx-auto">
                <div>
                    <img
                        src={gradient}
                        alt=""
                        className="h-16 w-full rounded-tl-xl rounded-tr-xl"
                    />
                    <div className="bg-white w-full xl:px-10 px-4 py-5 xl:h-[39rem] shadow-2xl">
                        <div>
                            <div className="md:flex items-center justify-between mb-3 gap-4 pb-3 border last:border-none">
                                <div className="flex items-center gap-4">
                                    <FaUserCircle className='xl:text-[5rem] text-4xl bg-gray-200' />
                                    <span className="flex-1">
                                        <h5 className="font-[500] text-sm xl:text-base">
                                            {user.firstname} {user.lastname}
                                        </h5>
                                        <p className="text-sm text-primary">{user.email}</p>
                                        <div className="">
                                            <div className="text-secondary cursor-pointer" onClick={handleOpenEditModal}>
                                                Edit Profile
                                            </div>
                                        </div>
                                    </span>
                                </div>

                                <div className="flex justify-center items-center my-5 gap-2">
                                    <div className="text-primary text-sm font-medium">
                                        Wallet Balance
                                    </div>
                                    <div className="text-secondary text-2xl">
                                        ${user.user_wallets[0].walletbal}
                                    </div>
                                </div>
                                <div className="border flex items-center justify-between md:px-10 px-1 text-xs py-3 gap-10 text-primary bg-white shadow-2xl">
                                    <MdOutlineLocationOn />
                                    <div>{location}</div>
                                    <MdOutlineMyLocation />
                                </div>
                                
                            </div>
                        </div>

                        <div className="xl:border-t pt-5">
                            <div className="flex items-center text-primary gap-3 justify-between">
                            </div>
                        </div>

                        <div className="border-t md:grid grid-cols-2 g xl:mt-10 py-10 gap-5   ">
                            <div onClick={handleOpenFundWallet} className="border py-3 px-2">
                                <Link to=''>Fund Wallet</Link>
                            </div>
                            <div className="border py-3 px-2">
                                <Link to='/notification'>Notification</Link>
                            </div>
                            <div onClick={handleOpenChangePass} className="border py-3 px-2">
                                <Link to=''>Change Password</Link>
                            </div>
                            <div onClick={handleOpenSettings} className="border py-3 px-2">
                                <Link to=''>Settings</Link>
                            </div>
                            <div className="border py-3 px-2">
                                <Link to='/terms'>Terms & Conditions</Link>
                            </div>
                            <div onClick={handleOpenModal} className="border py-3 px-2">
                                <Link to='' >Favourite Service</Link>
                            </div>
                                                <div className="border py-3 px-2">
                                <Link to='/privacy'>Privacy Policy</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isEditUserOpen && user && (
                <EditUser
                    closeView={handleCloseEditModal}
                    singles={user}
                    updateUser={(updatedData) => {
                        console.log('User updated:', updatedData);
                        handleCloseEditModal();
                    }}
                />
            )}

            {isModalOpen && (
                <FavouriteService
                    closeview={handleCloseModal}
                />
            )}
            {changePass && (
                <ChangePassword
                    closeview={handleCloseChangePass}
                />
            )}
            {fundWallet && (
                <FundWallet 
                    closeview={handleCloseFundWallet}
                />
            )}
            {settings && (
                <Settings
                    closeview={handleCloseSettings}
                />
            )}
        </Layout>
    );
};

export default User;
