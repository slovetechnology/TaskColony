import { Link } from 'react-router-dom';
import { SlArrowRight } from 'react-icons/sl';
import { FooterContacts, FooterLinks, FooterSocials, img37, img38 } from '../../utils/utils';

function Footer() {
    const date = new Date()
    const year = date.getFullYear()
    return (
        <div className="bg-black py-20 text-white">
            <div className="w-11/12 mx-auto lg:w-10/12">
                <div className="text-3xl text-secondary mb-10">Why choose Task Colony</div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div className="">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                            {FooterLinks.map((item, index) => (
                                <Link to={item.link} key={index} className='text-white py-3 px-3 hover:text-secondary transition-all text-sm flex items-center gap-1'> <SlArrowRight className='text-xs' /> {item.title}</Link>
                            ))}
                        </div>
                    </div>
                    <div className="">
                        <div className="uppercase">dOWNLOAD THE APP ON</div>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                            <a href="https://apps.apple.com/app/task-colony/id6741864955" rel="noreferrer"> <img src={img37} alt="" className="w-10/12" /> </a>
                            <a href="https://play.google.com/store/apps/details?id=com.taskcolony.app" rel="noreferrer"> <img src={img38} alt="" className="w-10/12" /> </a>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-16">
                    <div className="">
                        <div className="">For enquiries, reach us on :</div>
                        <div className="flex flex-row flex-wrap mt-3">
                            {FooterSocials.map((item, index) => (
                                <a
                                    href={item.link}
                                    key={index}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img src={item.img} alt="" className="w-10/12" />
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {FooterContacts.map((item, index) => (
                                <div className="relative" key={index}>
                                    <div className="text-xs text-secondary">{item.title}</div>
                                    <div className="text-xs">{item.content}</div>
                                    {index !== FooterContacts.length - 1 && <div className="absolute top-0 right-3 hidden lg:block w-[0.05rem] h-10 bg-secondary/60"></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-10 text-secondary text-center text-xs">© {year} All Rights Reserved by Task Colony</div>
            </div>
        </div>
    )
}

export default Footer