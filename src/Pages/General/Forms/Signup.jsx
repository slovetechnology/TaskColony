import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../../../Components/User/Layout';
import signup from '../../../assets/form.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { Apis, AuthPosturl, Geturl, Posturl } from '../../../Components/General/Api';
import { ErrorAlert, ToastAlert } from '../../../Components/General/Utils';
import VerifyEmail from './VerifyEmail';
import Cookies from 'js-cookie';
import { FcGoogle } from 'react-icons/fc';

const Signup = () => {
  const [selected, setSelected] = useState('User');
  const [view, setView] = useState(1);
  const [pass1, setPass1] = useState(false);
  const [pass2, setPass2] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState(null); // State to hold the token
  const [email, setEmail] = useState(null); // State to hold the email
  const [googleLoginUrl, setGoogleLoginUrl] = useState(null); // State to hold Google login URL
  const Icon1 = pass1 ? FaEye : FaEyeSlash;
  const Icon2 = pass2 ? FaEye : FaEyeSlash;
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState(''); // State for selected state
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const { register, setValue, handleSubmit, formState: { errors } } = useForm();
  const [showStateHelp, setShowStateHelp] = useState(false);

  const toggleStateHelp = () => {
    setShowStateHelp((prev) => !prev); // Toggle the visibility
  };
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const dataToSend = {
      firstname: data.firstname,
      zipcode: data.zipcode,
      state: data.state,
      city: selectedState,
      lastname: data.lastname,
      email: data.email,
      phone: data.phone,
      password: data.password,
      country_tid: "UKYT",
      registervia: "Web",
      devicetype: "Web",
      hearfrom: "Social Media",
      username: data.username,
      userType: selected,
      referedby: data.referedby,
    };

    try {
      const res = await Posturl(Apis.users.register, dataToSend);
      if (res.data.status === true) {
        const token = res.data.data[0].access_token;
        Cookies.set('taskcolony', token);
        setToken(token);
        setEmail(data.email);
        setView(2);
        ToastAlert(res.data.text);
      } else {
        ErrorAlert(res.text || 'Registration failed');
      }
    } catch (error) {
      console.error('Error during sign up:', error);
      ErrorAlert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const stateResponse = await Geturl(Apis.users.get_system);
      if (stateResponse.status === true) {
        setStates(stateResponse.data.cities);
      } else {
        console.error("Failed to fetch states");
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);



  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    if (view === 2) {
      window.scrollTo(0, 0); // Scrolls to the top of the page
    }
  }, [view]);
  const GoogleLogin = async () => {
    try {
      const res = await AuthPosturl(Apis.users.google_verify);
      if (res.status === true) {
        const url = res.data[0].url;
        setGoogleLoginUrl(url); // Set the Google login URL
        window.location.href = url; // Redirect the current window to the URL
      } else {
        ErrorAlert('Failed to fetch Google login URL.');
      }
    } catch (error) {
      console.error('Error during Google login:', error);
      ErrorAlert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="bg-gray w-full h-[10rem]">
        <div className="text-center py-10 pt-10">
          <p className='font-[500] text-4xl mb-3'>Sign Up</p>
          <span className='flex items-center gap-4 font-[500] justify-center'>
            <p className="text-primary">Home</p>
            <span className="bg-[#6C757D] w-3 py-0.5"></span>
            <p className="text-secondary">Sign Up</p>
          </span>
        </div>
      </div>
      {view === 1 && (
        <div className="flex items-center justify-center">
          <div className="md:flex my-14 mx-2">
            <img src={signup} alt="Signup" className="md:w-[27rem] rounded-tl-md rounded-bl-md object-cover" />
            <div className="bg-white rounded-tr-md md:w-[27rem] rounded-br-md shadow-2xl py-5 px-6">
              <div className="text-center text-[#4B5563] font-[400] text-lg mb-4">Welcome to TaskColony</div>
              <div className="flex items-center mb-3 justify-center gap-10">
                <div className="w-24 h-0.5 bg-[#E5E7EB]"></div>
                <p className="text-xs text-primary">SIGN UP</p>
                <div className="w-24 h-0.5 bg-[#E5E7EB]"></div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="text-sm text-[#374151]">
                  <div className="mb-3">
                    <label>First Name</label>
                    <input
                      {...register('firstname', { required: 'First name is required' })}
                      type="text"
                      className={`input border ${errors.firstname ? 'border-red-600' : 'border'}`}
                    />
                    {errors.firstname && <div className="text-red-600">{errors.firstname.message}</div>}
                  </div>

                  <div className="mb-3">
                    <label>Last Name</label>
                    <input
                      {...register('lastname', { required: 'Last name is required' })}
                      type="text"
                      className={`input border ${errors.lastname ? 'border-red-600' : 'border'}`}
                    />
                    {errors.lastname && <div className="text-red-600">{errors.lastname.message}</div>}
                  </div>

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

                  <div className="mb-3">
                    <label>Username</label>
                    <input
                      {...register('username', { required: 'Username is required' })}
                      type="text"
                      className={`input border ${errors.username ? 'border-red-600' : 'border'}`}
                    />
                    {errors.username && <div className="text-red-600">{errors.username.message}</div>}
                  </div>

                  <div className="mb-5">
                    <label className="text-xs font-semibold">Select State</label>
                    <select
                      className={`inputs border ${errors.state ? 'border-red-600' : 'border'}`}
                      {...register('state', { required: 'State is required' })}
                      onChange={(e) => {
                        const selectedStateId = e.target.value;
                        const state = states.find(state => state.trackid === selectedStateId);
                        setSelectedState(state ? state.name : ''); // Set selected state name
                        setValue('state', selectedStateId); // Set the state ID in the form
                      }}
                    >
                      <option value="">Select State</option>
                      {states.length > 0 ? (
                        states.map((state) => (
                          <option key={state.trackid} value={state.trackid}>
                            {state.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No states available</option>
                      )}
                    </select>
                    {errors.state && (
                      <div className="text-red-600">{errors.state.message}</div>
                    )}
                  </div>

                  <div className="mb-5">
                    <label className="text-xs font-semibold">City</label>
                    <input
                      {...register('city')}
                      type="text"
                      placeholder="City"
                      className={`inputs border ${errors.city ? 'border' : 'border'}`}
                      value={selectedState} // Display selected state name
                      onChange={(e) => setSelectedState(e.target.value)} // Allow user to edit
                    />
                  </div>

                  <div className="mb-3">
                    <label>Zip Code</label>
                    <input
                      {...register('zipcode', { required: 'Zip code is required' })}
                      type="text"
                      className={`input border ${errors.zipcode ? 'border-red-600' : 'border'}`}
                    />
                    {errors.zipcode && <div className="text-red-600">{errors.zipcode.message}</div>}
                  </div>

                  <div className="mb-3">
                    <label>Referral Code</label>
                    <input
                      {...register('referedby')}
                      type="text"
                      className={`input border ${errors.referedby ? 'border-red-600' : 'border'}`}
                    />
                  </div>

                  <div className="mb-3">
                    <label>Company <span>(Optional)</span></label>
                    <input {...register('company')} type="text"
                      className={`input border ${errors.company ? 'border-red-600' : 'border'}`} />
                  </div>

                  <div className="mb-3">
                    <label>Contact Number</label>
                    <input
                      {...register('phone', {
                        required: 'Phone number is required',
                        minLength: { value: 10, message: 'Phone number must be at least 10 digits' },
                        maxLength: { value: 11, message: 'Phone number must not exceed 11 digits' },
                        pattern: { value: /^[0-9]*$/, message: 'Only numbers are allowed' }
                      })}
                      type="text"
                      className={`input border ${errors.phone ? 'border-red-600' : 'border'}`}
                    />
                    {errors.phone && <div className="text-red-600">{errors.phone.message}</div>}
                  </div>

                  <div className="mb-4 relative">
                    <div onClick={() => setPass1(!pass1)} className="absolute top-9 right-4 cursor-pointer text-xl text-primary">
                      <Icon1 />
                    </div>
                    <label>Password</label>
                    <input
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                      })}
                      type={pass1 ? 'text' : 'password'}
                      className={`input border ${errors.password ? 'border-red-600' : 'border'}`}
                    />
                    {errors.password && <div className="text-red-600">{errors.password.message}</div>}
                  </div>

                  <div className="mb-4 relative">
                    <div onClick={() => setPass2(!pass2)} className="absolute top-8 right-3 cursor-pointer text-slate-600 text-xl">
                      <Icon2 />
                    </div>
                    <label>Retype Password</label>
                    <input
                      {...register('confirm_password', { required: 'Confirm your password' })}
                      type={pass2 ? 'text' : 'password'}
                      className={`input border ${errors.password ? 'border-red-600' : 'border'}`}
                    />
                  </div>
                  <div className="text-secondary  cursor-pointer" onClick={toggleStateHelp}>
                    Can't see your state?
                  </div>
                  {showStateHelp && (
                    <div className="mt-2 text-sm text-gray-600 ">If your state is not listed, TaskColony is currently not offering services in your area. You will be notified once TaskColony expands operations to your state.</div>
                  )}
                  <div className="mt-6 space-y-3">
                    <label className="flex items-center">
                      <input {...register('agree_terms', { required: true })} type="checkbox" className="accent-secondary mr-2" />
                      <span className="text-secondary underline">Terms And Conditions</span>
                    </label>
                    <label className="flex items-center">
                      <input {...register('agree_privacy', { required: true })} type="checkbox" className="accent-secondary mr-2" />
                      <span className="text-secondary underline">Privacy Policy</span>
                    </label>
                  </div>

                  <div className="mt-6 mb-3">
                    <button
                      type="submit"
                      className="bg-[#374151] w-full py-3 rounded-full text-white"
                    >
                      {isSubmitting ? 'Processing...' : 'Sign Up'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={GoogleLogin}
                    className="bg-white w-full py-3 rounded-md border flex items-center justify-center"
                  >
                    <FcGoogle className="mr-2" /> Sign up with Google
                  </button>

                  <div className="mt-4 text-center">
                    <span>Already have an account? </span>
                    <Link to="/login" className="text-secondary">Log In</Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {view === 2 && <VerifyEmail email={email} token={token} />}
    </Layout>
  );
};

export default Signup;