import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../../Components/User/Layout';
import { Link } from 'react-router-dom';
import { ProviderPackages } from '../../utils/utils';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Apis, Geturl } from '../../Components/General/Api';

const Faq = () => {
    const [isOpen, setIsOpen] = useState({}); // Track which items are open
    const [faq, setFaq] = useState([]); // Store FAQs
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state

    // Function to toggle FAQ visibility
    const toggleService = (id) => {
        setIsOpen((prevState) => ({ ...prevState, [id]: !prevState[id] }));
    };

    // Fetch FAQ data from API
    const fetchAllHome = useCallback(async () => {
        setLoading(true);
        try {
            const res = await Geturl(Apis.users.get_system);
            console.log(res.data.faqs);

            if (res.status === true) {
                setFaq(res.data.faqs); // Set fetched FAQs
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (err) {
            setError(err.message); // Set error message
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllHome();
    }, [fetchAllHome]);

    return (
        <Layout>
            <div className="bg-gray w-full xl:h-[10rem]">
                <div className="text-center py-1 pt-10">
                    <p className='font-[500] text-4xl mb-3'>FAQs</p>
                    <span className='flex items-center gap-4 font-[500] justify-center'>
                        <p className="text-primary">Home</p>
                        <span className="bg-[#6C757D] w-3 py-0.5"></span>
                        <p className="text-secondary">FAQs</p>
                    </span>
                </div>
            </div>
            <div className="mb-20">
                <div className="lg:flex items-start justify-between lg:mx-32 mx-5 mt-10 lg:mt-20">
                    <div className="">
                        <p className="text-xl font-medium">FAQs For Users & Providers</p>
                        <p className='text-base mt-2'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.</p>
                        <div className="border rounded-md py-2 px-5 w-fit border-primary mt-4">
                            <Link to='/contact' className='text-primary'>Contact</Link>
                        </div>
                    </div>
                    <div className="">
                        <div className="mt-10">
                            {faq.map((item) => (
                                <div key={item.id}>
                                    <div onClick={() => toggleService(item.id)} className="lg:w-[50vw]">
                                        <div className="flex items-center justify-between cursor-pointer">
                                            <p className='text-lg font-semibold'>{item.title}</p>
                                            <button className='p-1.5'>
                                                {isOpen[item.id] ? <FaChevronUp /> : <FaChevronDown />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="">
                                        <AnimatePresence>
                                            {isOpen[item.id] && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="flex items-center lg:w-[50vw] gap-2.5 mt-2"
                                                >
                                                    <span className="bg-primary-50 p-2 text-base font-medium">{item.details}</span>
                                                
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <div className="border w-full my-5"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


             
            </div>
        </Layout>
    );
};

export default Faq;