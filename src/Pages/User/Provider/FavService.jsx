import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../../../Components/User/Layout';
import { useForm } from 'react-hook-form';
import { Apis, AuthPosturl, Geturl } from '../../../Components/General/Api';
import { useSelector, useDispatch } from 'react-redux';
import { ErrorAlert, ToastAlert } from '../../../Components/General/Utils';

const FavService = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { user } = useSelector((state) => state.data);
    const dispatch = useDispatch(); // We'll use this to update the global state.

    const [selectedCategory, setSelectedCategory] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [userServices, setUserServices] = useState([]); // Local state for user's services

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        try {
            const categoryResponse = await Geturl(Apis.users.get_system);
            if (categoryResponse.status === true) {
                setCategories(categoryResponse.data.categories);
            }

            const serviceResponse = await Geturl(Apis.users.get_system);
            if (serviceResponse.status === true) {
                setServices(serviceResponse.data.all_services);
                setUserServices(
                    serviceResponse.data.all_services.filter(service =>
                        user.servicetids.split(',').includes(service.trackid)
                    )
                );
            }
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    }, [user.servicetids]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('service_tid', data.service_tid);

        setIsSubmitting(true);

        try {
            const res = await AuthPosturl(Apis.users.provider_favservice, formData);
            if (res.status === true) {
                // Update local userServices and user.servicetids
                const updatedService = services.find(service => service.trackid === data.service_tid);

                if (updatedService) {
                    setUserServices((prevServices) => [...prevServices, updatedService]);
                }

                const updatedServiceIds = `${user.servicetids},${data.service_tid}`;
                dispatch({ type: 'UPDATE_SERVICETIDS', payload: updatedServiceIds }); // Assuming you have an action for this
                ToastAlert(res.text);
            } else {
                ErrorAlert(res.text);
            }
        } catch (error) {
            console.error('Error submitting booking:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="bg-gray w-full xl:h-[20rem]">
                <div className="text-center py-10 xl:pt-24">
                    <p className="font-[500] xl:text-4xl text-xl mb-3">Provider Favourite Service</p>
                    <span className="flex items-center gap-4 font-[500] justify-center">
                        <p className="text-primary">Home</p>
                        <span className="bg-[#6C757D] w-3 py-0.5"></span>
                        <p className="text-secondary">Provider Favourite Service</p>
                    </span>
                </div>
            </div>
            <div className="md:flex items-center mx-5 lg:mx-10 justify-center lg:gap-10 gap-3 my-20">
                <div className="">
                    <div className="bg-[#e2e2e2] mb-5 md:mb-0 md:w-[30rem] h-[25rem] py-5 px-4">
                        <div className="flex flex-wrap gap-3 mt-3">
                            {userServices.map((service) => (
                                <div key={service.trackid} className="bg-secondary/45 w-fit text-white rounded-full py-2 px-4 mb-2">
                                    {service.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="bg-[#e2e2e2] md:w-[30rem] h-[25rem] py-5 px-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="text-sm mt text-[#374151]">
                            <div className="text-xl font-semibold mb-3">Update Registered Services</div>
                            <div className="mb-5">
                                <label className="text-xs font-semibold">Select Categories</label>
                                <select
                                    className={`inputs border`}
                                    {...register('category', { required: false })}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">Select Categories</option>
                                    {categories.map((category) => (
                                        <option key={category.trackid} value={category.trackid}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-5">
                                <label className="text-xs font-semibold">Select Service</label>
                                <select
                                    className={`inputs border ${errors.service_tid ? 'border-red-600' : 'border'}`}
                                    {...register('service_tid', { required: 'Service is required' })}
                                >
                                    <option value="">Select Service</option>
                                    {services
                                        .filter((service) => service.cat_tid === selectedCategory)
                                        .map((service) => (
                                            <option key={service.trackid} value={service.trackid}>
                                                {service.name}
                                            </option>
                                        ))}
                                </select>
                                {errors.service_tid && (
                                    <div className="text-red-600">{errors.service_tid.message}</div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-secondary mt-6 mb-3 w-full py-3 rounded-full text-white"
                            >
                                {isSubmitting ? 'Processing...' : 'Post'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default FavService;