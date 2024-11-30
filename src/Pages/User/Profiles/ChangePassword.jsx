import React, { useState } from 'react';
import { ErrorAlert, ToastAlert } from '../../../Components/General/Utils';
import { useForm } from 'react-hook-form';
import Modal from '../../../Components/General/Modal';
import { Apis, AuthPosturl } from '../../../Components/General/Api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ChangePassword = ({ isOpen, closeview, resendSignal }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [pass1, setPass1] = useState(false);
  const [pass2, setPass2] = useState(false);
  const Icon1 = pass1 ? FaEye : FaEyeSlash;
  const Icon2 = pass2 ? FaEye : FaEyeSlash;
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm();

  const newPassword = watch("new_password");

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const dataToSend = {
      old_password: data.old_password,
      new_password: data.new_password,
    };

    try {
      const res = await AuthPosturl(Apis.users.change_profile_pass, dataToSend);

      if (res.status === true) { // Adjust based on your API response structure
        ToastAlert("Password updated successfully!");
        reset();
        closeview();
      } else {
        ErrorAlert(res.text || "Failed to update password. Please try again.");
      }
    } catch (error) {
      console.error("Error changing password:", error);

      if (error.response?.status === 400) {
        ErrorAlert("Incorrect old password. Please try again.");
      } else {
        ErrorAlert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal height="h-[32rem]" isOpen={isOpen} closeview={closeview}>
      <p className="font-[500] text-3xl text-[#1C1F34] mb-4">Change Password</p>
      <p className="text-xs text-[#828282]">
        Set the new password for your account so you can log in and access all features.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 text-sm">
        <div className="mb-6 relative">
          <div onClick={() => setPass1(!pass1)} className="absolute top-9 right-4 cursor-pointer text-xl text-primary">
            <Icon1 />
          </div>
          <label>Old Password</label>
          <input
            {...register('old_password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' }
            })}
            type={pass1 ? 'text' : 'password'}
            className={`input ${errors.old_password ? 'border-red-600' : 'border'}`}
          />
          {errors.old_password && <div className="text-red-600">{errors.old_password.message}</div>}
        </div>

        <div className="mb-6 relative">
          <div onClick={() => setPass1(!pass1)} className="absolute top-9 right-4 cursor-pointer text-xl text-primary">
            <Icon1 />
          </div>
          <label>New Password</label>
          <input
            {...register('new_password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' }
            })}
            type={pass1 ? 'text' : 'password'}
            className={`input ${errors.new_password ? 'border-red-600' : 'border'}`}
          />
          {errors.new_password && <div className="text-red-600">{errors.new_password.message}</div>}
        </div>

        <div className="mb-6 relative">
          <div onClick={() => setPass2(!pass2)} className="absolute top-8 right-3 cursor-pointer text-slate-600 text-xl">
            <Icon2 />
          </div>
          <label>Retype Password</label>
          <input
            {...register('confirm_password', { required: 'Confirm your password' })}
            type={pass2 ? 'text' : 'password'}
            className="input"
          />
        </div>

        <button
          type="submit"
          className="bg-[#374151] w-full text-center py-3 mt-5 rounded-md text-white text-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Continue"}
        </button>
      </form>
    </Modal>
  );
};

export default ChangePassword;
