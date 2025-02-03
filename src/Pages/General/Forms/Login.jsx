// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
// import Layout from '../../../Components/User/Layout';
// import { FcGoogle } from 'react-icons/fc';
// import login from '../../../assets/form.png';
// import { Link } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import { Apis, Posturl, AuthPosturl, Geturl } from '../../../Components/General/Api';
// import { ErrorAlert, ToastAlert } from '../../../Components/General/Utils';
// import Cookies from 'js-cookie';
// import {decodeToken} from 'react-jwt'

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation()
//   const { register, handleSubmit, formState: { errors } } = useForm();
//   const [searchParams] = useSearchParams()
//   const googleCode = searchParams.get('code')


//   const GoogleLogin = async () => {
//     try {
//       const res = await AuthPosturl(Apis.users.google_url);
//       if (res.status === true) {
//         const url = res.data[0].url;
//         window.open(url, "_blank"); // Open the URL in a new tab
//       } else {
//         ErrorAlert('Failed to fetch Google login URL.');
//       }
//     } catch (error) {
//       console.error('Error during Google login:', error);
//       ErrorAlert('An unexpected error occurred. Please try again.');
//     }
//   };
//   useEffect(() => {
//     (async () => {
//       const search = location?.search 
//       if(search) {
//         const res = await Geturl(`${Apis.users.google_verify}${search}`);
//         if(res.status === true) {
//           navigate('/service')
//         }
//       }
//     })()
//   }, [])

//   const onSubmit = async (data) => {
//     setIsSubmitting(true);
//     const dataToSend = {
//       email: data.email,
//       password: data.password,
//       googlecode: 'wdw',
//     };

//     try {
//       const res = await Posturl(Apis.users.login, dataToSend);
//       if (res.data.status === true) {
//         const token = res.data.data[0].access_token;
//         Cookies.set('taskcolony', token);
//         ToastAlert(res.data.text);

//         setTimeout(() => {
//           window.location.href = '/service'; // Navigate and reload the page
//         }, 1000);
//       } else {
//         ErrorAlert(res.text);
//       }
//     } catch (error) {
//       ErrorAlert('An unexpected error occurred. Please try again.');
//       console.log(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

 

//   return (
//     <Layout>
//       <div className="bg-gray w-full h-[10rem]">
//         <div className="text-center py-10 pt-10">
//           <p className='font-[500] text-4xl mb-3'>Login</p>
//           <span className='flex items-center gap-4 font-[500] justify-center'>
//             <p className="text-primary">Home</p>
//             <span className="bg-[#6C757D] w-3 py-0.5"></span>
//             <p className="text-secondary">Login</p>
//           </span>
//         </div>
//       </div>
//       <div className="md:flex my-14 items-center w-11/12 mx-auto justify-center">
//         <div className="">
//           <img src={login} alt="" className="md:w-[27rem] md:rounded-tl-md md:rounded-bl-md md:h-[33rem] object-cover" />
//         </div>
//         <div className="bg-white md:w-[27rem] md:rounded-tr-md rounded-br-md md:h-[33rem] shadow-2xl py-5 px-6">
//           <div className="text-center text-[#4B5563] font-[400] text-lg mb-4">Welcome back!</div>
//           <div className="flex items-center mb-3 justify-center gap-10">
//             <div className="w-24 h-0.5 bg-[#E5E7EB]"></div>
//             <p className="text-xs text-primary">LOGIN</p>
//             <div className="w-24 h-0.5 bg-[#E5E7EB]"></div>
//           </div>

//           <form onSubmit={handleSubmit(onSubmit)}>
//             <div className="text-sm text-[#374151]">
//               <div className="mb-3">
//                 <label>Email</label>
//                 <input
//                   {...register('email', {
//                     required: 'Email is required',
//                     validate: (value) => value.includes('@') || 'Enter a valid email address'
//                   })}
//                   type="email"
//                   className={`input border ${errors.email ? 'border-red-600' : 'border'}`}
//                 />
//                 {errors.email && <div className="text-red-600">{errors.email.message}</div>}
//               </div>

//               <div className="mt-6 relative">
//                 <div onClick={() => setShowPassword(!showPassword)} className="absolute top-9 right-4 cursor-pointer text-xl text-primary">
//                   {showPassword ? <FaEye /> : <FaEyeSlash />}
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <label>Password</label>
//                   <Link to='/reset-password' className='text-[#6B7280]'>Forgot Password?</Link>
//                 </div>
//                 <input
//                   {...register('password', {
//                     required: 'Password is required',
//                     minLength: { value: 6, message: 'Password must be at least 6 characters' }
//                   })}
//                   type={showPassword ? 'text' : 'password'}
//                   className={`input border ${errors.password ? 'border-red-600' : 'border'}`}
//                 />
//                 {errors.password && <div className="text-red-600">{errors.password.message}</div>}
//               </div>
//             </div>
//             <div className="md:mt-10 mt-5">
//               <button className='bg-[#374151] w-full text-center py-3 rounded-md text-white text-lg' disabled={isSubmitting}>
//                 {isSubmitting ? 'Logging in...' : 'Login'}
//               </button>
//               <button
//                 type="button"
//                 onClick={GoogleLogin}
//                 className="bg-white w-full py-3 mt-4 rounded-md border flex items-center justify-center"
//               >
//                 <FcGoogle className="mr-2" /> Sign in with Google
//               </button>
//               <div className="text-sm my-5 font-[500] text-center mt-2">DON'T HAVE AN ACCOUNT? <Link to='/signup' className='text-secondary'>SIGN UP</Link></div>
//             </div>
//           </form>

//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Login;

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../../../Components/User/Layout';
import { FcGoogle } from 'react-icons/fc';
import login from '../../../assets/form.png';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Apis, Posturl, AuthPosturl, Geturl } from '../../../Components/General/Api';
import { ErrorAlert, ToastAlert } from '../../../Components/General/Utils';
import Cookies from 'js-cookie';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [searchParams] = useSearchParams();
  const googleCode = searchParams.get('code');

  const GoogleLogin = async () => {
    try {
      const res = await AuthPosturl(Apis.users.google_url);
      if (res.status === true) {
        const url = res.data[0].url;
        window.open(url, "_blank"); 
      } else {
        ErrorAlert('Failed to fetch Google login URL.');
      }
    } catch (error) {
      console.error('Error during Google login:', error);
      ErrorAlert('An unexpected error occurred. Please try again.');
    }
  };

  useEffect(() => {
    const verifyGoogleCode = async () => {
      if (googleCode) {
        try {
          const res = await Geturl(`${Apis.users.google_verify}?code=${googleCode}`);
          if (res.status === true) {
            navigate('/service');
          } else {
            ErrorAlert('Google verification failed. Please try again.');
          }
        } catch (error) {
          console.error('Error verifying Google code:', error);
          ErrorAlert('An unexpected error occurred during verification. Please try again.');
        }
      }
    };

    verifyGoogleCode();
  }, [googleCode, navigate]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const dataToSend = {
      email: data.email,
      password: data.password,
      googlecode: googleCode || '', 
    };

    try {
      const res = await Posturl(Apis.users.login, dataToSend);
      if (res.data.status === true) {
        const token = res.data.data[0].access_token;
        Cookies.set('taskcolony', token);
        ToastAlert(res.data.text);

        setTimeout(() => {
          window.location.href = '/service'; // Navigate and reload the page
        }, 1000);
      } else {
        ErrorAlert(res.data.text); 
      }
    } catch (error) {
      ErrorAlert('An unexpected error occurred. Please try again.');
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="bg-gray w-full h-[10rem]">
        <div className="text-center py-10 pt-10">
          <p className='font-[500] text-4xl mb-3'>Login</p>
          <span className='flex items-center gap-4 font-[500] justify-center'>
            <p className="text-primary">Home</p>
            <span className="bg-[#6C757D] w-3 py-0.5"></span>
            <p className="text-secondary">Login</p>
          </span>
        </div>
      </div>
      <div className="md:flex my-14 items-center w-11/12 mx-auto justify-center">
        <div className="">
          <img src={login} alt="" className="md:w-[27rem] md:rounded-tl-md md:rounded-bl-md md:h-[33rem] object-cover" />
        </div>
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
              <button
                type="button"
                onClick={GoogleLogin}
                className="bg-white w-full py-3 mt-4 rounded-md border flex items-center justify-center"
              >
                <FcGoogle className="mr-2" /> Sign in with Google
              </button>
              <div className="text-sm my-5 font-[500] text-center mt-2">DON'T HAVE AN ACCOUNT? <Link to='/signup' className='text-secondary'>SIGN UP</Link></div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;