import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Apis, Posturl } from '../../../Components/General/Api';
import { ErrorAlert, ToastAlert } from '../../../Components/General/Utils';
import Cookies from 'js-cookie';
import { Toaster } from 'react-hot-toast';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const dataToSend = {
      email: data.email,
      password: data.password,
    };

    try {
      const res = await Posturl(Apis.admins.login_admin, dataToSend);

      if (res.data.status === true && res.data.data[0].access_token) {
        const token = res.data.data[0].access_token;
        Cookies.set('taskcolony', token);
        ToastAlert(res.data.text);

        setTimeout(() => {
          navigate('/auth/admin');
        }, 3000);
      } else {
        ErrorAlert(res.data.text || 'Login failed');
      }
    } catch (error) {
      ErrorAlert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="bg-gray w-full xl:h-[20rem]">
        <div className="text-center py-10 xl:pt-24">
          <p className='font-[500] text-4xl mb-3'>Login</p>
          <span className='flex items-center gap-4 font-[500] justify-center'>
            <p className="text-primary">Admin</p>
            <span className="bg-[#6C757D] w-3 py-0.5"></span>
            <p className="text-secondary">Login</p>
          </span>
        </div>
      </div>
      <div className="md:flex my-14 items-center md:mx-7 justify-center">
        <div className="bg-white md:w-[27rem] border mx-3 rounded-tr-md rounded-br-md md:h-[25rem] shadow-2xl py-5 px-6">
          <div className="text-center text-[#4B5563] font-[400] text-lg mb-4">Welcome back Admin!</div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="text-sm text-[#374151]">
              <div className="mb-3">
                <label>Email</label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    validate: (value) => value.includes('@') || 'Enter a valid email address'
                  })}
                  type="email"
                  className={`input border ${errors.email ? 'border-red-600' : 'border'}`}
                />
                {errors.email && <div className="text-red-600">{errors.email.message}</div>}
              </div>

              <div className="mt-6 relative">
                <div onClick={() => setShowPassword(!showPassword)} className="absolute top-9 right-4 cursor-pointer text-xl text-primary">
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </div>
                <div className="flex items-center justify-between">
                  <label>Password</label>
                  <Link to='/auth/admin/forgot-password' className='text-[#6B7280]'>Forgot Password?</Link>
                </div>
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPassword ? 'text' : 'password'}
                  className={`input border ${errors.password ? 'border-red-600' : 'border'}`}
                />
                {errors.password && <div className="text-red-600">{errors.password.message}</div>}
              </div>
            </div>
            <div className="mt-10">
              <button className='bg-[#374151] w-full text-center py-3 rounded-md text-white text-lg' disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toaster />

    </div>
  );
};

export default AdminLogin;
