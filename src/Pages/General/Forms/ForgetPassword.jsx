import React, { useRef, useState } from 'react';
import Layout from '../../../Components/User/Layout';
import { ErrorAlert, ToastAlert } from '../../../Components/General/Utils';
import { useForm } from 'react-hook-form';
import { Apis, Posturl } from '../../../Components/General/Api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
    const [view, setView] = useState(1); // 1 = Email, 2 = OTP, 3 = Password, 4 = Success
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [pass1, setPass1] = useState(false);
    const [pass2, setPass2] = useState(false);
    const [token, setToken] = useState(""); // To store the token
    const inputRefs = useRef([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const Icon1 = pass1 ? FaEye : FaEyeSlash;
    const Icon2 = pass2 ? FaEye : FaEyeSlash;
    const navigate = useNavigate();

    // Step 1: Handle Email Submission
    const handleEmailSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const res = await Posturl(Apis.users.forget_password, { email: data.email });
            if (res.data.status) {
                ToastAlert(res.data.text);
                setEmail(data.email);
                setToken(res.data.token); // Assuming the API returns a token
                setView(2); // Move to OTP view
            } else {
                ErrorAlert(res.data.text);
            }
        } catch (error) {
            console.error("Error in email submission:", error);
            ErrorAlert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle OTP Input Changes
    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);
        if (element.value !== "" && index < 3) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleBackspace = (element, index) => {
        if (element.value === "" && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    // Step 2: Handle OTP Submission
    const handleOtpSubmit = async (data) => {
        if (otp.join('').length !== 4) {
            ErrorAlert("Please enter a valid 4-digit OTP.");
            return;
        }
        if (data.password !== data.confirm_password) {
            ErrorAlert("Passwords do not match.");
            return;
        }
        const dataToSend = {
            otp: otp.join(''),
            token, // Use the token saved from email step
            newpassword: data.password, // Collected from the form
        };
        setIsSubmitting(true);
        try {
            const res = await Posturl(Apis.users.reset_password, dataToSend);
            if (res.data.status) {
                ToastAlert(res.data.text);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                ErrorAlert(res.data.text);
            }
        } catch (error) {
            console.error("Error in OTP verification:", error);
            ErrorAlert("An error occurred while verifying OTP.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="bg-gray w-full xl:h-[20rem]">
                <div className="text-center py-10 xl:pt-24">
                    <p className="font-[500] text-4xl mb-3">Forget Password</p>
                    <span className="flex items-center gap-4 font-[500] justify-center">
                        <p className="text-primary">Home</p>
                        <span className="bg-[#6C757D] w-3 py-0.5"></span>
                        <p className="text-secondary">Password</p>
                    </span>
                </div>
            </div>

            {view === 1 && (
                <div className="flex items-center mx-5 mt-16 mb-32 justify-center">
                    <div className="bg-white h-[20rem] w-[24rem] border shadow-xl rounded-lg px-8 py-4">
                        <p className="font-[500] text-2xl lg:text-3xl text-[#1C1F34] mb-4">Forget Password</p>
                        <p className="text-xs text-[#828282]">
                            Enter your email for the verification process, we will send a 4-digit code to your email.
                        </p>
                        <form onSubmit={handleSubmit(handleEmailSubmit)}>
                            <div className="mb-3 mt-3">
                                <label>Email</label>
                                <input
                                    {...register("email", {
                                        required: "Email is required",
                                        validate: (value) => value.includes("@") || "Enter a valid email address",
                                    })}
                                    type="email"
                                    className={`input border ${errors.email ? "border-red-600" : "border"}`}
                                />
                                {errors.email && <div className="text-red-600">{errors.email.message}</div>}
                            </div>
                            <button
                                type="submit"
                                className="bg-[#374151] w-full text-center py-3 rounded-md text-white text-lg flex items-center justify-center"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <span className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full border-white"></span>
                                        Sending...
                                    </div>
                                ) : (
                                    "Continue"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Remaining views unchanged */}
        </Layout>
    );
};

export default ForgetPassword;
