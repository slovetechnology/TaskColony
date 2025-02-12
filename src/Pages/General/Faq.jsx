import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../../Components/User/Layout';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Apis, Geturl } from '../../Components/General/Api';

const Faq = () => {
    const [isOpen, setIsOpen] = useState({});
    const [faq, setFaq] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAllHome = useCallback(async () => {
        setLoading(true);
        try {
            const res = await Geturl(Apis.users.get_system);

            if (res.status === true) {
                setFaq(res.data.faqs);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllHome();
    }, [fetchAllHome]);

    const toggleFaq = (index) => {
        setIsOpen((prevState) => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

    return (
        <Layout>
            <div className="bg-gray w-full xl:h-[10rem]">
                <div className="text-center py-1 pt-10">
                    <p className="font-[500] text-4xl mb-3">FAQs</p>
                    <span className="flex items-center gap-4 font-[500] justify-center">
                        <p className="text-primary">Home</p>
                        <span className="bg-[#6C757D] w-3 py-0.5"></span>
                        <p className="text-secondary">FAQs</p>
                    </span>
                </div>
            </div>
            <div className="mb-20">
                <div className="lg:flex items-start justify-between lg:mx-28 mx-5 mt-10 lg:mt-20">
                    <div className='w-full'>
                        <p className="text-xl font-medium">FAQs For Users & Providers</p>
                        <p className="text-base mt-2">We have answers to your Questions!</p>
                        <div className="border rounded-md py-2 px-5 w-fit border-primary mt-4">
                            <Link to="/contact" className="text-primary">Contact</Link>
                        </div>
                    </div>
                    <div>
                        <div className="mt-10">
                            {faq.map((item, i) => (
                                <div key={i}>
                                    <div className="lg:w-[50vw]">
                                        <div
                                            className="flex items-center justify-between cursor-pointer"
                                            onClick={() => toggleFaq(i)}
                                        >
                                            <p className="text-lg font-semibold">{item.title}</p>
                                            <button className="p-1.5">
                                                {isOpen[i] ? <FaChevronUp /> : <FaChevronDown />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <AnimatePresence>
                                            {isOpen[i] && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="flex items-center lg:w-[50vw] gap-2.5 mt-2"
                                                >
                                                        <div dangerouslySetInnerHTML={{ __html: item.details }} />
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