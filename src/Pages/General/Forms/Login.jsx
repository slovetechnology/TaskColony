import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../Components/User/Layout';
import { FcGoogle } from 'react-icons/fc';
import login from '../../../assets/form.png';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Apis, Posturl } from '../../../Components/General/Api';
import { ErrorAlert, ToastAlert } from '../../../Components/General/Utils';
import Cookies from 'js-cookie';
import Signin from './Signin';
import { GoogleOAuthProvider } from '@react-oauth/google';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [selected, setSelected] = useState('User');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const dataToSend = {
      email: data.email,
      password: data.password,
      googlecode: 'wdw', // Update as required
    };

    try {
      const res = await Posturl(Apis.users.login, dataToSend);
      if (res.data.status === true) {
        const token = res.data.data[0].access_token;
        Cookies.set('taskcolony', token);
        ToastAlert(res.data.text);

        // Delay navigation and reload by 4 seconds
        setTimeout(() => {
          window.location.href = '/service'; // Navigate and reload the page
        }, 1000); // 4000ms = 4 seconds
      } else {
        ErrorAlert(res.text);
      }

    } catch (error) {
      ErrorAlert('An unexpected error occurred. Please try again.');
      console.log(error)
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Layout>
      <div className="bg-gray w-full xl:h-[20rem]">
        <div className="text-center py-10 xl:pt-24">
          <p className='font-[500] text-4xl mb-3'>Login</p>
          <span className='flex items-center gap-4 font-[500] justify-center'>
            <p className="text-primary">Home</p>
            <span className="bg-[#6C757D] w-3 py-0.5"></span>
            <p className="text-secondary">Login</p>
          </span>
        </div>
      </div>
      <div className="md:flex my-14 items-center w-11/12 mx-auto justify-center">
        <div className=""><img src={login} alt="" className="md:w-[27rem] md:rounded-tl-md md:rounded-bl-md md:h-[33rem] object-cover" /></div>
        <div className="bg-white md:w-[27rem] md:rounded-tr-md rounded-br-md md:h-[33rem] shadow-2xl py-5 px-6">
          <div className="text-center text-[#4B5563] font-[400] text-lg mb-4">Welcome back!</div>
          <div className="flex items-center mb-3 justify-center gap-10">
            <div className="w-24 h-0.5 bg-[#E5E7EB]"></div>
            <p className="text-xs text-primary">LOGIN</p>
            <div className="w-24 h-0.5 bg-[#E5E7EB]"></div>
          </div>

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
                  <Link to='/reset-password' className='text-[#6B7280]'>Forgot Password?</Link>
                </div>
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className={`input border ${errors.password ? 'border-red-600' : 'border'}`}
                />
                {errors.password && <div className="text-red-600">{errors.password.message}</div>}
              </div>
            </div>
            <div className="md:mt-10 mt-5">
              <button className='bg-[#374151] w-full text-center py-3 rounded-md text-white text-lg' disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
              <div className="text-sm my-5 font-[500] text-center mt-2">DON'T HAVE AN ACCOUNT? <Link to='/signup' className='text-secondary'>SIGN UP</Link></div>
              <GoogleOAuthProvider
              >
                <Signin />
              </GoogleOAuthProvider>

            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;