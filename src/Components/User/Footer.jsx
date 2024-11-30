import React from 'react'
import { FaGreaterThan } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import apple from '../../assets/apple1.png'
import google from '../../assets/google1.jpg'
import facebook from '../../assets/facebook.png'
import instagram from '../../assets/instagram.png'
import twitter from '../../assets/twitter.png'
import linkdin from '../../assets/linkedin.png'
import youtube from '../../assets/youtube.png'

const Footer = () => {
    const handleNavigation = (path) => {
        window.location.href = path;
    };
    return (
        <div>
            <div className="bg-black ">
                <div className="xl:w-[80%] px-5 h-full mx-auto">
                    <div className="">
                        <div className="text-secondary font-[500] pt-12">Why choose Task Colony</div>
                        <div className="xl:flex items-top justify-between gap-20 mt-8">
                            <div className=" text-white font-[400] text-xs">
                                <div className="grid grid-cols-3 gap-4">
                                    <div onClick={() => handleNavigation('/about')} className='hover:text-secondary flex cursor-pointer items-center gap-1'> <FaGreaterThan /> About us</div>
                                    <div onClick={() => handleNavigation('/')} className='hover:text-secondary flex cursor-pointer items-center gap-1'> <FaGreaterThan /> Contact us</div>
                                    <div onClick={() => handleNavigation('/privacy')} className='hover:text-secondary flex cursor-pointer items-center gap-1'> <FaGreaterThan /> Privacy</div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mt-11">
                                    <div onClick={() => handleNavigation('/terms')} className='hover:text-secondary flex cursor-pointer items-center gap-1'> <FaGreaterThan /> Terms & Condition</div>
                                    <div onClick={() => handleNavigation('/')} className='hover:text-secondary flex cursor-pointer items-center gap-1'> <FaGreaterThan /> Careers</div>
                                    <div onClick={() => handleNavigation('/')} className='hover:text-secondary flex cursor-pointer items-center gap-1'> <FaGreaterThan /> Team</div>
                                </div>
                            </div>
                            <div className="text-white mt-10">
                                <div className="text-sm font-[500]">DOWNLOAD THE APP ON</div>
                                <div className="flex gap-3 mt-4">
                                    <img src={apple} alt="" className="w-28" />
                                    <img src={google} alt="" className="w-28" />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="">
                        <div className="border-t border-secondary w-full xl:flex justify-between mt-10  xl:mt-24">
                            <div className="py-10">
                                <p className="text-white font-[700] text-xs pb-3">For enquiries, reach us on :</p>
                                <div className="flex gap-3">
                                    <img src={facebook} alt="" className="w-7" />
                                    <img src={twitter} alt="" className="w-7" />
                                    <img src={linkdin} alt="" className="w-7" />
                                    <img src={youtube} alt="" className="w-7" />
                                    <img src={instagram} alt="" className="w-7" />
                                </div>
                            </div>
                            <div className="xl:flex gap-6 pb-5 text-xs items-center">
                                <span className="">
                                    <p className="text-secondary">Careers</p>
                                    <p className="text-white">Jobs@taskcolony.com</p>
                                </span>
                                <span className="text-primary">|</span>
                                <span className="">
                                    <p className="text-secondary">Careers</p>
                                    <p className="text-white">Jobs@taskcolony.com</p>
                                </span>
                                <span className="">
                                    <p className="text-secondary">Careers</p>
                                    <p className="text-white">+144  1234 56789</p>
                                </span>
                            </div>
                        </div>
                        <div className="border-b border-secondary"></div>
                    </div>
                    <div className="text-center text-secondary xl:text-sm text-xs pb-4 pt-7">© 2024 All Rights Reserved by Task Colony</div>
                </div>
            </div>
        </div>
    )
}

export default Footer
