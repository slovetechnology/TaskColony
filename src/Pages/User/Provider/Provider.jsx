import React, { useEffect, useState } from "react";
import Layout from "../../../Components/User/Layout";
import gradient from "../../../assets/gradient.jpeg";
import { MdOutlineLocationOn, MdOutlineMyLocation } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaChevronRight, FaUserCircle, FaPlus } from "react-icons/fa";
import FavouriteService from "../Profiles/FavouriteService";
import ChangePassword from "../Profiles/ChangePassword";
import Settings from "../Profiles/Settings";
import ProviderWithdraw from "./ProviderWithdraw";
import EditUser from "../Profiles/EditUser";
import Kyc from "./Kycverify";
import { LazyLoadImage } from "react-lazy-load-image-component";

const Provider = () => {
  const { user } = useSelector((state) => state.data);
  const [location, setLocation] = useState("Fetching location...");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [changePass, SetChangePass] = useState(false);
  const [settings, SetSettings] = useState(false);
  const [fundWithdraw, SetFundwithdraw] = useState(false);
  const [kyc, setKyc] = useState(false);
  const [image, setImage] = useState({
    main: null,
    preview: null,
  });

  useEffect(() => {
    // Retrieve image from local storage when the component mounts
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setImage({ main: savedImage, preview: savedImage });
    }

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

  const handleUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage({
        main: file,
        preview: reader.result,
      });
      localStorage.setItem("profileImage", reader.result); // Save image to local storage
    };
  };

  const handleEditUserOpen = () => setIsEditUserOpen(true);
  const handleEditUserClose = () => setIsEditUserOpen(false);
  const handleChangePasswordClose = () => SetChangePass(false);
  const handlefundWithdrawOpen = () => SetFundwithdraw(true);
  const handlefundWithdrawClose = () => SetFundwithdraw(false);
  const handleKycOpen = () => setKyc(true);
  const handleKycClose = () => setKyc(false);
  const handleSettingsOpen = () => SetSettings(true);
  const handleSettingsClose = () => SetSettings(false);
  const handleModalClose = () => setIsModalOpen(false);

  return (
    <Layout>
      <div className="bg-gray w-full h-[10rem]">
        <div className="text-center py-10 pt-10">
          <p className="font-[500] xl:text-4xl text-xl mb-3">Provider Profile</p>
          <span className="flex items-center gap-4 font-[500] justify-center">
            <p className="text-primary">Home</p>
            <span className="bg-[#6C757D] w-3 py-0.5"></span>
            <p className="text-secondary">Provider Profile</p>
          </span>
        </div>
      </div>

      <div className="xl:w-[88%] w-full px-2 xl:px-0 xl:my-20 my-10 mx-auto">
        <div>
          <img
            src={gradient}
            alt="Gradient"
            className="h-16 w-full rounded-tl-xl rounded-tr-xl"
          />

          <div className="bg-white w-full px-4 py-5 h-auto shadow-2xl">
            <div className="lg:flex items-center justify-between mb-3 gap-4 pb-3">
              <div className="md:flex items-center justify-center w-full  gap-4">
                <div className="mb-4">
                  <label>
                    <div className="">
                      <img src={user.passport} alt="" className="w-24 h-24 rounded-full object-cover" />
                    </div>
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
                  <div className="text-primary text-sm font-medium">Total Earning</div>
                  <div className="text-secondary text-2xl">${user.provider_bal}</div>
                </div>
              </div>

              <div className="flex items-center justify-between px-1 text-sm py-3 gap-10 text-primary md:w-full  bg-white shadow-2xl">
                <div className=""><MdOutlineLocationOn /></div>
                <div>{location}</div>
                <div className=""><MdOutlineMyLocation /></div>
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
                to="/favourite"
              >
                Registered Service <FaChevronRight />
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
      {kyc && <Kyc closeView={handleKycClose} />}
      {settings && <Settings closeview={handleSettingsClose} />}
    </Layout>
  );
};

export default Provider;