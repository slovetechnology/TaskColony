import React, { useEffect, useState } from "react";
import Layout from "../../../Components/User/Layout";
import gradient from "../../../assets/gradient.jpeg";
import { MdOutlineLocationOn, MdOutlineMyLocation } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronRight, FaUserCircle } from "react-icons/fa";
import FavouriteService from "./FavouriteService";
import EditUser from "./EditUser";
import ChangePassword from "./ChangePassword";
import Settings from "./Settings";
import FundWallet from "./Funds/FundWallet";
import KycForm from "../Provider/KycForm";
import Popups from "../../../Components/General/Popups";
import KycPopups from "../../../Components/General/KycPopup";

const User = () => {
  const { user } = useSelector((state) => state.data);
  const [location, setLocation] = useState("Fetching location...");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [changePass, SetChangePass] = useState(false);
  const [settings, SetSettings] = useState(false);
  const [fundWallet, SetFundwallet] = useState(false);
  const [isKycFormOpen, setIsKycFormOpen] = useState(false); // State for KYC form
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getUserGeoAddress();
  }, []);

  const getUserGeoAddress = async () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Latitude:", latitude, "Longitude:", longitude);

        try {
          const apiKey = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your actual API key
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch address information.");
          }

          const data = await response.json();
          if (data.status === "OK" && data.results.length > 0) {
            setLocation(data.results[0].formatted_address);
          } else {
            console.error("Could not retrieve address:", data.status);
          }
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      },
      (error) => {
        console.error("Error getting geolocation:", error.message);
      }
    );
  };

  const handleKycSubmit = () => {
    if (user.kyclevel === 0) {
      setIsKycFormOpen(true); // Open the KYC form if kyclevel is 0
    } else {
      navigate('/provider'); // Navigate to provider if kyclevel is 1
    }
  };

  const handleSwitchToProvider = () => {
    if (user.kyclevel === 0) {
      setIsPopupOpen(true); // Show popup if kyclevel is 0
    } else {
      navigate('/provider'); // Navigate if kyclevel is 1
    }
  };

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);
  const handleEditUserOpen = () => setIsEditUserOpen(true);
  const handleEditUserClose = () => setIsEditUserOpen(false);
  const handleChangePasswordOpen = () => SetChangePass(true);
  const handleChangePasswordClose = () => SetChangePass(false);
  const handleFundWalletOpen = () => SetFundwallet(true);
  const handleFundWalletClose = () => SetFundwallet(false);
  const handleSettingsOpen = () => SetSettings(true);
  const handleSettingsClose = () => SetSettings(false);
  const handleCancel = () => setIsPopupOpen(false);
  const handleCloseKycForm = () => setIsKycFormOpen(false); // Close KYC Form

  return (
    <Layout>
      <KycPopups
        isOpen={isPopupOpen}
        title="Not Registered Provider Yet"
        onClose={handleCancel}
        onRegister={handleKycSubmit}
      >
        Please proceed to register as a provider.
      </KycPopups>

      <KycForm closeView={handleCloseKycForm} isOpen={isKycFormOpen} />
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
            alt="Gradient"
            className="h-16 w-full rounded-tl-xl rounded-tr-xl"
          />
          <div className="bg-white w-full xl:px-10 px-4 py-5 lg:h-[40rem] shadow-2xl">
            <div className="lg:flex items-center justify-between mb-3 gap-4 pb-3">
              <div className="flex items-center gap-4">
                <FaUserCircle className="xl:text-[5rem] text-4xl bg-gray-200" />
                <span className="flex-1">
                  <h5 className="font-[500] text-sm xl:text-base">
                    {user.firstname} {user.lastname}
                  </h5>
                  <p className="text-sm text-primary">{user.email}</p>
                  <div
                    className="text-secondary cursor-pointer"
                    onClick={handleEditUserOpen}
                  >
                    Edit Profile
                  </div>
                </span>
              </div>

              <div className="flex justify-center items-center my-5 gap-2">
                <div className="text-primary text-sm font-medium">Wallet Balance</div>
                <div className="text-secondary text-2xl">
                  ${parseFloat(user.user_wallets[0].walletbal).toLocaleString()}
                </div>
              </div>

              <div className="flex items-center justify-between md:px-10 px-1 text-xs py-3 gap-10 text-primary bg-white shadow-2xl">
                <MdOutlineLocationOn />
                <div>{location}</div>
                <MdOutlineMyLocation />
              </div>
            </div>
            {user.kyclevel === 0 && <Link to='/provider-kyc'></Link>}
            <div className="bg-secondary cursor-pointer rounded-full mb-4 p-2 w-fit text-white" onClick={handleSwitchToProvider}>
              Switch to provider
            </div>

            <div className="border-t pt-5">
              <div className="flex items-center text-primary gap-3 justify-between"></div>
            </div>

            <div className="flex flex-col gap-10 lg:grid-cols-2 lg:grid">
              <div
                onClick={handleFundWalletOpen}
                className="border flex items-center justify-between py-3 px-2 cursor-pointer"
              >
                <Link to="#">Fund Wallet</Link>
                <FaChevronRight />
              </div>

              <Link
                to="/notification"
                className="border py-3 px-2 items-center justify-between flex w-full"
              >
                Notification <FaChevronRight />
              </Link>

              <Link
                to="/faq"
                className="border py-3 px-2 items-center justify-between flex w-full"
              >
                FAQs <FaChevronRight />
              </Link>

              <div
                onClick={handleChangePasswordOpen}
                className="border py-3 px-2 items-center justify-between flex w-full cursor-pointer"
              >
                <Link to="#">Change Password</Link>
                <FaChevronRight />
              </div>

              <div
                onClick={handleSettingsOpen}
                className="border py-3 px-2 items-center justify-between flex w-full cursor-pointer"
              >
                <Link to="#">Settings</Link>
                <FaChevronRight />
              </div>

              <Link
                className="border py-3 px-2 items-center justify-between flex w-full"
                to="/terms"
              >
                Terms & Conditions <FaChevronRight />
              </Link>

              <Link
                className="border py-3 px-2 items-center justify-between flex w-full"
                to="/fund-history"
              >
                Transaction History <FaChevronRight />
              </Link>

              <div
                onClick={handleModalOpen}
                className="border py-3 px-2 items-center justify-between flex w-full cursor-pointer"
              >
                <Link to="#">Favourite Service</Link>
                <FaChevronRight />
              </div>

              <Link
                className="border py-3 px-2 items-center justify-between flex w-full"
                to="/privacy"
              >
                Privacy Policy <FaChevronRight />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {isEditUserOpen && user && (
        <EditUser
          closeView={handleEditUserClose}
          singles={user}
          updateUser={(updatedData) => {
            console.log("User updated:", updatedData);
            handleEditUserClose();
          }}
        />
      )}

      {isModalOpen && <FavouriteService closeview={handleModalClose} />}
      {changePass && <ChangePassword closeview={handleChangePasswordClose} />}
      {fundWallet && <FundWallet closeview={handleFundWalletClose} />}
      {settings && <Settings closeview={handleSettingsClose} />}
    </Layout>
  );
};

export default User;