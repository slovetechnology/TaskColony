import React, { useRef, useState, useEffect } from 'react';
import Layout from '../../../Components/User/Layout';
import { ErrorAlert, ToastAlert } from '../../../Components/General/Utils';
import { useForm } from 'react-hook-form';

const ForgetPassword = () => {
    const [view, setView] = useState(1); // Initial view (1 = Email, 2 = OTP, 3 = Password, 4 = Success)
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [timeLeft, setTimeLeft] = useState(60);
    const inputRefs = useRef([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    // Handle email submission
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const dataToSend = { email: data.email };
        try {
            const res = await Posturl(Apis.admins.forgetpass_admin, dataToSend);
            console.log(res); // Log the response for debugging
            if (res.status === true) {
                ToastAlert(res.text);
                setEmail(data.email);
                if (res.status === true) {
                    setView(2)
                }
                else {
                    return ErrorAlert(result.msg)
                }
            } else {
                ErrorAlert(res.text || 'Error during verification');
            }
        } catch (error) {
            console.error("Error submitting email:", error); // Log the error for debugging
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

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    // Function to handle continue after OTP verification
    const handleContinue = async () => {
        if (password === confirmPassword) {
            setIsSubmitting(true);
            try {
                const response = await Posturl(Apis.admins.reset_password, { email, password });
                if (response.status === true) {
                    ToastAlert('Password updated successfully');
                    setView(4); // Transition to success view
                } else {
                    ErrorAlert(response.text || 'Error during password reset');
                }
            } catch (error) {
                console.error('Error updating password:', error);
                ErrorAlert('An error occurred while resetting your password.');
            } finally {
                setIsSubmitting(false);
            }
        } else {
            ErrorAlert('Passwords do not match');
        }
    };

    // Timer logic for OTP expiration
    useEffect(() => {
        if (view === 2 && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft, view]);

    return (
        <Layout>
            <div className="bg-gray w-full xl:h-[20rem]">
                <div className="text-center py-10 xl:pt-24">
                    <p className='font-[500] text-4xl mb-3'>Forget Password</p>
                    <span className='flex items-center gap-4 font-[500] justify-center'>
                        <p className="text-primary">Home</p>
                        <span className="bg-[#6C757D] w-3 py-0.5"></span>
                        <p className="text-secondary">Password</p>
                    </span>
                </div>
            </div>

            {/* Step 1: Enter Email */}
            {view === 1 && (
                <div className="flex items-center mx-5 mt-16 mb-32 justify-center">
                    <div className="bg-white h-[20rem] w-[24rem] border shadow-xl rounded-lg px-8 py-4">
                        <p className='font-[500] text-2xl lg:text-3xl text-[#1C1F34] mb-4'>Forget Password</p>
                        <p className="text-xs text-[#828282]">Enter your email for the verification process, we will send a 4-digit code to your email.</p>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-3 mt-3">
                                <label>Email</label>
                                <input
                                    {...register('email', {
                                        required: 'Email is required',
                                        validate: (value) => value.includes('@') || 'Enter a valid email address'
                                    })}
                                    type="email"
                                    className={`input border ${errors.email ? 'border-red-600' : 'border-red-600'}`}
                                />
                                {errors.email && <div className="text-red-600">{errors.email.message}</div>}
                            </div>
                            <button
                                type="submit" // Changed to type="submit" to trigger form submission
                                className='bg-[#374151] w-full text-center py-3 rounded-md text-white text-lg'
                                disabled={isSubmitting} // Disable the button while submitting
                            >
                                Continue
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Step 2: OTP Verification */}
            {view === 2 && (
                <div className="flex items-center justify-center mt-16 mb-32">
                    <div className="bg-white h-[24rem] w-[24rem] border shadow-xl rounded-lg px-12 py-7">
                        <p className='font-[500] text-3xl text-[#1C1F34] mb-4'>Verification</p>
                        <p className="text-xs text-[#828282]">Enter the 4-digit code that you received on your email.</p>

                        <form className="mt-6">
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
                            <p className="text-center text-secondary text-sm mb-4">
                                Time remaining: {formatTime(timeLeft)}
                            </p>
                            <button
                                type="button"
                                className={`bg-[#374151] w-full text-center py-3 rounded-md text-white text-lg ${timeLeft === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={timeLeft === 0}
                            >
                                Continue
                            </button>
                            <p className="text-xs text-[#828282]">If you didn’t receive a code! Resend</p>
                        </form>
                    </div>
                </div>
            )}

            {/* Step 3: Set New Password */}
            {view === 3 && (
                <div className="flex items-center justify-center mt-16 mb-32">
                    <div className="bg-white h-[28rem] w-[24rem] border shadow-xl rounded-lg px-12 py-4">
                        <p className='font-[500] text-3xl text-[#1C1F34] mb-4'>New Password</p>
                        <p className="text-xs text-[#828282]">Set the new password for your account so you can login and access all features.</p>

                        <form className="mt-6 text-sm">
                            <div className="mb-4">
                                <label htmlFor="password">Enter New Password</label>
                                <input
                                    type="password"
                                    className="input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="New password"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="confirmPassword">Confirm New Password</label>
                                <input
                                    type="password"
                                    className="input"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                />
                            </div>
                            <button
                                type="button"
                                className='bg-[#374151] w-full text-center py-3 rounded-md text-white text-lg'
                                onClick={handleContinue}
                                disabled={isSubmitting} // Disable while submitting
                            >
                                Continue
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Step 4: Success */}
            {view === 4 && (
                <div className="flex items-center justify-center mt-16 mb-32">
                    <div className="bg-white h-[20rem] w-[24rem] border shadow-xl rounded-lg px-12 py-7">
                        <p className='font-[500] text-3xl text-[#1C1F34] mb-4'>Password Reset Successful</p>
                        <p className="text-xs text-[#828282]">You can now log in with your new password.</p>
                        <button
                            type="button"
                            className='bg-[#374151] w-full text-center py-3 rounded-md text-white text-lg'
                            onClick={() => setView(1)} // Redirect to login or home
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ForgetPassword;
