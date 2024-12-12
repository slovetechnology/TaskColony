import React, { useRef, useState, useEffect } from 'react';
import { ErrorAlert, ToastAlert } from '../../../Components/General/Utils';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Apis, AuthPosturl, Posturl } from '../../../Components/General/Api';

const VerifyEmail = ({ email: initialEmail, token }) => {
    const [email, setEmail] = useState(initialEmail || '');
    const [view, setView] = useState(1);
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [timeLeft, setTimeLeft] = useState(60);
    const inputRefs = useRef([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            console.log("Token received in VerifyEmail component:", token);
        }
    }, [token]);

    const onSubmit = async () => {
        setIsSubmitting(true);
        const dataToSend = {
            email: email,
            verifytype: 1,
            method: 1,
        };
        try {
            const res = await AuthPosturl(Apis.users.send_verify, dataToSend);
            console.log(res)
            if (res.status === true) {
                console.log(res.status)
                Cookies.set('taskcolony', token); 
                console.log("Token set in cookies (onSubmit):", token);
                ToastAlert(res.text);
                setView(2);
            } else {
                ErrorAlert(res.text || 'Error during verification');
            }
        } catch (error) {
            console.error("Error submitting email:", error);
            ErrorAlert('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOtpSubmit = async () => {
        setIsSubmitting(true);
        const dataToSend = {
            otp: otp.join(""), // Combine OTP digits into a single string
            verifytype: 1,
        };

        try {
            const res = await AuthPosturl(Apis.users.otp_verify, dataToSend);
            if (res.status === true) {
                Cookies.set('taskcolony', token); 
                console.log("Token set in cookies (onSubmit):", token);
                ToastAlert(res.text);
                setTimeout(() => {
                    navigate('/service'); 
                }, 3000);
            } else {
                ErrorAlert(res.text || 'OTP verification failed');
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            ErrorAlert('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

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

    useEffect(() => {
        if (view === 2 && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft, view]);

    return (
        <div>
            {view === 1 && (
                <div className="flex items-center mt-16 mb-32 justify-center">
                    <div className="bg-white h-[20rem] w-[24rem] border shadow-xl rounded-lg px-8 py-4">
                        <p className='font-[500] text-3xl text-[#1C1F34] mb-4'>Verify Email</p>
                        <p className="text-xs text-[#828282]">Enter your email for the verification process. We will send a 4-digit code to your email.</p>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-3">
                                <label>Email</label>
                                <input
                                    {...register('email', {
                                        required: 'Email is required',
                                        validate: (value) => value.includes('@') || 'Enter a valid email address'
                                    })}
                                    type="email"
                                    className={`input border ${errors.email ? 'border-red-600' : 'border'}`}
                                    value={email} // Bind to state
                                    onChange={(e) => setEmail(e.target.value)} // Update state on change
                                />
                                {errors.email && <div className="text-red-600">{errors.email.message}</div>}
                            </div>
                            <button
                                type="submit"
                                className='bg-[#374151] w-full text-center py-3 rounded-md text-white text-lg'
                                disabled={isSubmitting}
                            >
                                Continue
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {view === 2 && (
                <div className="flex items-center justify-center mt-16 mb-32">
                    <div className="bg-white h-[21rem] w-[24rem] border shadow-xl rounded-lg px-12 py-7">
                        <p className='font-[500] text-3xl text-[#1C1F34] mb-4'>Verification</p>
                        <p className="text-xs text-[#828282]">Enter the 4-digit code that you received on your email.</p>

                        <form onSubmit={handleOtpSubmit} className="mt-6">
                            <div className="flex items-center justify-center w-full mb-10 space-x-5">
                                {otp.map((value, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength="1"
                                        className="w-full h-14 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={value}
                                        onChange={(e) => handleChange(e.target, index)}
                                        onKeyDown={(e) => e.key === "Backspace" ? handleBackspace(e.target, index) : null}
                                        ref={(el) => inputRefs.current[index] = el}
                                    />
                                ))}
                            </div>

                            <button
                                type="button"
                                className={`bg-[#374151] w-full text-center py-3 rounded-md text-white text-lg`}
                                onClick={handleOtpSubmit}
                            >
                                Continue
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerifyEmail;