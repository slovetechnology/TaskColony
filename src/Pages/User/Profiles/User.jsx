import React, { useEffect, useState } from "react";
import Layout from "../../../Components/User/Layout";
import gradient from "../../../assets/gradient.jpeg";
import { MdOutlineLocationOn, MdOutlineMyLocation } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronRight, FaUserCircle, FaPlus } from "react-icons/fa";
import FavouriteService from "./FavouriteService";
import EditUser from "./EditUser";
import ChangePassword from "./ChangePassword";
import Settings from "./Settings";
import FundWallet from "./Funds/FundWallet";
import KycForm from "../Provider/KycForm";
import KycPopups from "../../../Components/General/KycPopup";
import { LazyLoadImage } from "react-lazy-load-image-component";

const User = () => {
  const { user } = useSelector((state) => state.data);
  const [location, setLocation] = useState("Fetching location...");
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [changePass, SetChangePass] = useState(false);
  const [settings, SetSettings] = useState(false);
  const [fundWallet, SetFundwallet] = useState(false);
  const [isKycFormOpen, setIsKycFormOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  const [image, setImage] = useState({
    main: null,
    preview: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) {
      setImage({ main: storedImage, preview: storedImage });
    }
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
          const apiKey = "AIzaSyAWrGaFeWRxxtjxUCZGG7naNmHtg0RK88o"; // Replace with your actual API key
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
      setIsKycFormOpen(true);
    } else {
      navigate('/provider');
    }
  };

  const handleSwitchToProvider = () => {
    if (user.kyclevel === 0) {
      setIsPopupOpen(true);
    } else {
      navigate('/provider');
    }
  };

  const handleEditUserOpen = () => setIsEditUserOpen(true);
  const handleEditUserClose = () => setIsEditUserOpen(false);
  const handleChangePasswordOpen = () => SetChangePass(true);
  const handleChangePasswordClose = () => SetChangePass(false);
  const handleFundWalletOpen = () => SetFundwallet(true);
  const handleFundWalletClose = () => SetFundwallet(false);
  const handleSettingsOpen = () => SetSettings(true);
  const handleSettingsClose = () => SetSettings(false);
  const handleCancel = () => setIsPopupOpen(false);
  const handleCloseKycForm = () => setIsKycFormOpen(false);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage({
        main: file,
        preview: reader.result,
      });
      localStorage.setItem('profileImage', reader.result); // Store the image in localStorage
    };
  };

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
      <div className="bg-gray w-full h-[10rem]">
        <div className="text-center py-10 pt-10">
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
          <div className="bg-white w-full px-4 py-5 lg:h-[45rem] shadow-2xl">
            <div className="lg:flex items-center justify-between mb-3 gap-4 pb-3">
              <div className="md:flex items-center justify-center w-full  gap-4">
                <div className="mb-4">
                  <label>
                    {image.preview === null ? (
                    <div className=""></div>
                    ) : (
                      <LazyLoadImage
                        src={image.preview}
                        alt=""
                        className="md:w-32 md:h-32 h-20 w-20 mx-auto border  rounded-full object-cover"
                      />
                    )}
                    <input type="file" hidden onChange={handleUpload} />
                    <div className="text-center text-secondary text-xs">Upload Profile</div>
                  </label>
                </div>

                <div className="flex flex-col justify-center md:block items-center">
                  <h5 className="font-[500] text-sm xl:text-base">
                    {user.firstname} {user.lastname}
                  </h5>
                  <p className="text-sm text-primary">{user.email}</p>
                  <p className="text-sm text-primary">{user.referralcode}</p>
                  <div
                    className="text-secondary cursor-pointer"
                    onClick={handleEditUserOpen}
                  >
                    Edit Profile
                  </div>
                </div>
                <div className="flex justify-center items-center my-5 gap-2">
                <div className="text-primary text-sm font-medium">Wallet Balance</div>
                <div className="text-secondary text-2xl">${user.user_wallets[0].walletbal}</div>
              </div>
              </div>
        
              <div className="flex items-center justify-between px-1 text-sm py-3 gap-10 text-primary md:w-full  bg-white shadow-2xl">
                <div className=""><MdOutlineLocationOn /></div>
                <div>{location}</div>
                <div className=""><MdOutlineMyLocation /></div>
              </div>
            </div>
            {user.kyclevel === 0 && <Link to='/provider-kyc'></Link>}
            <div className="bg-secondary cursor-pointer rounded-full mb-4 p-2 w-fit text-white" onClick={handleSwitchToProvider}>
              Switch to Provider
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

              <Link
                className="border py-3 px-2 items-center justify-between flex w-full"
                to="/user-favourite"
              >
                Favourite Service <FaChevronRight />
              </Link>

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

      {changePass && <ChangePassword closeview={handleChangePasswordClose} />}
      {fundWallet && <FundWallet closeview={handleFundWalletClose} />}
      {settings && <Settings closeview={handleSettingsClose} />}
    </Layout>
  );
};

export default User;