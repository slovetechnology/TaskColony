import React, { useEffect, useState } from "react";
import Layout from "../../../Components/User/Layout";
import gradient from "../../../assets/gradient.jpeg";
import { MdOutlineLocationOn, MdOutlineMyLocation } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaChevronRight, FaUserCircle } from "react-icons/fa";
import FavouriteService from "../Profiles/FavouriteService";
import ChangePassword from "../Profiles/ChangePassword";
import Settings from "../Profiles/Settings";
import ProviderWithdraw from "./ProviderWithdraw";
import EditUser from "../Profiles/EditUser"; // Import the EditUser component
import UpdateFavservice from "./UpdateFavservice";

const Provider = () => {
  const { user } = useSelector((state) => state.data);
  const [location, setLocation] = useState("Fetching location...");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [changePass, SetChangePass] = useState(false);
  const [settings, SetSettings] = useState(false);
  const [fundWithdraw, SetFundwithdraw] = useState(false);
  const [kyc, setKyc] = useState(false);

  useEffect(() => {
    // Call the function to get the address when the component mounts
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
          const apiKey = "AIzaSyAWrGaFeWRxxtjxUCZGG7naNmHtg0RK88o"; // Use your actual API key here
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

  const handleModalClose = () => setIsModalOpen(false);
  const handleEditUserOpen = () => setIsEditUserOpen(true);

  const handleEditUserClose = () => setIsEditUserOpen(false);
  const handleChangePasswordClose = () => SetChangePass(false);

  const handlefundWithdrawOpen = () => SetFundwithdraw(true);
  const handlefundWithdrawClose = () => SetFundwithdraw(false);

  const handleKycOpen = () => setKyc(true);
  const handleKycClose = () => setKyc(false);

  const handleSettingsClose = () => SetSettings(false);

  return (
    <Layout>
      <div className="bg-gray w-full xl:h-[20rem]">
        <div className="text-center py-10 xl:pt-24">
          <p className="font-[500] xl:text-4xl text-xl mb-3">Provider Profile</p>
          <span className="flex items-center gap-4 font-[500] justify-center">
            <p className="text-primary">Home</p>
            <span className="bg-[#6C757D] w-3 py-0.5"></span>
            <p className="text-secondary">Provider Profile</p>
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
          <div className="bg-white w-full xl:px-10 px-4 py-5 lg:h-[30rem] shadow-2xl">
            <div className="md:flex items-center justify-between mb-3 gap-4 pb-3">
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
                <div className="text-secondary text-2xl">${user.user_wallets[0].walletbal}</div>
              </div>

              <div className="flex items-center justify-between  px-1 text-sm py-3 gap-10 text-primary md:w-[30rem] bg-white shadow-2xl">
                <div className=""><MdOutlineLocationOn /></div>
                <div>{location}</div>
                <div className=""> <MdOutlineMyLocation /></div>
              </div>
            </div>

            <div className="bg-secondary cursor-pointer rounded-full mb-4 p-2 w-fit text-white">
              <Link to="/user">Switch To User</Link>
            </div>

            <div className="border-t pt-5">
              <div className="flex items-center text-primary gap-3 justify-between"></div>
            </div>

            <div className="flex flex-col gap-10 lg:grid-cols-2 lg:grid">
              <div
                onClick={handlefundWithdrawOpen}
                className="border flex items-center justify-between py-3 px-2 cursor-pointer"
              >
                <Link to="#">Withdraw Earning</Link>
                <FaChevronRight />
              </div>
              <div
                onClick={handleKycOpen}
                className="border flex items-center justify-between py-3 px-2 cursor-pointer"
              >
                <Link to="#">KYC</Link>
                <FaChevronRight />
              </div>

              <Link
                to="/faq"
                className="border py-3 px-2 items-center justify-between flex w-full"
              >
                FAQs <FaChevronRight />
              </Link>
              <Link
                to="/provider-settings"
                className="border py-3 px-2 items-center justify-between flex w-full"
              >
                Settings <FaChevronRight />
              </Link>

              <Link
                className="border py-3 px-2 items-center justify-between flex w-full"
                to="/terms"
              >
                Terms & Conditions <FaChevronRight />
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

      {isModalOpen && <FavouriteService closeview={handleModalClose} />}
      {changePass && <ChangePassword closeview={handleChangePasswordClose} />}
      {fundWithdraw && <ProviderWithdraw closeView={handlefundWithdrawClose} />}
      {kyc && <UpdateFavservice closeView={handleKycClose} />}
      {settings && <Settings closeview={handleSettingsClose} />}
    </Layout>
  );
};

export default Provider;