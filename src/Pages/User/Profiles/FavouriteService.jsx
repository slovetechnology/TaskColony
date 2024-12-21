import React, { useCallback, useEffect, useState } from "react";
import Layout from "../../../Components/User/Layout";
import { useForm } from "react-hook-form";
import { Apis, AuthPosturl, Geturl } from "../../../Components/General/Api";
import { useSelector, useDispatch } from "react-redux";
import { ErrorAlert, ToastAlert } from "../../../Components/General/Utils";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

const UserFavService = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { user } = useSelector((state) => state.data);
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [userFavoriteServices, setUserFavoriteServices] = useState(user.favorite_services || []);

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

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("service_tid", data.service_tid);

    setIsSubmitting(true);

    try {
      const res = await AuthPosturl(Apis.users.favourite_services, formData);
      if (res.status === true) {
        const updatedService = services.find(
          (service) => service.trackid === data.service_tid
        );

        if (updatedService) {
          // Avoid duplicate entries
          const isAlreadyFavorite = userFavoriteServices.some(
            (service) => service.trackid === updatedService.trackid
          );

          if (!isAlreadyFavorite) {
            // Update local state for immediate UI reflection
            const updatedFavorites = [...userFavoriteServices, updatedService];
            setUserFavoriteServices(updatedFavorites);

            // Dispatch updated data to Redux
            const updatedServiceIds = `${user.servicetids},${data.service_tid}`;
            dispatch({ type: "UPDATE_SERVICETIDS", payload: updatedServiceIds });
            dispatch({
              type: "UPDATE_FAVORITE_SERVICES",
              payload: updatedFavorites,
            });

            ToastAlert(res.text);
          } else {
            ToastAlert("Service is already in your favorites!");
          }
        }
      } else {
        ErrorAlert(res.text);
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="bg-gray w-full xl:h-[20rem]">
        <div className="text-center py-10 xl:pt-24">
          <p className="font-[500] xl:text-4xl text-xl mb-3">Favourite Service</p>
          <span className="flex items-center gap-4 font-[500] justify-center">
            <p className="text-primary">Home</p>
            <span className="bg-[#6C757D] w-3 py-0.5"></span>
            <p className="text-secondary">Favourite Service</p>
          </span>
        </div>
      </div>
      <div className="lg:flex items-center mx-5 lg:mx-10 justify-center lg:gap-10 gap-3 my-20">
        <div className="">
          <div className="bg-[#e2e2e2] h-[25rem] py-7">
            <div className="flex overflow-auto scrollsdown mx-5 gap-10">
              {userFavoriteServices.map((item, index) => (
                <div className="flex-shrink-0" key={index}>
                  <div className="">
                    <LazyLoadImage
                      effect="blur"
                      src={item.banner_image[0]}
                      className="h-[15rem] w-[20rem] object-top object-cover"
                    />
                    <div className="py-6 px-6 md:h-[8rem] bg-white rounded-b-3xl shadow-xl -mt-4">
                      <div className="font-medium text-lg">{item.name}</div>
                      <div className="text-sm capitalize text-slate-500 mt-3">{item.description}</div>
                      <Link
                        to={`/service-detail/${item.id}`}
                        className="text-xs font-medium text-secondary"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-[#e2e2e2] w-[40%] h-[25rem] py-5 px-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="text-sm mt text-[#374151]">
              <div className="text-xl font-semibold mb-3">Update Favorite Services</div>
              <div className="mb-5">
                <label className="text-xs font-semibold">Select Categories</label>
                <select
                  className={`inputs border`}
                  {...register("category", { required: false })}
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
                  className={`inputs border ${
                    errors.service_tid ? "border-red-600" : "border"
                  }`}
                  {...register("service_tid", { required: "Service is required" })}
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
                {isSubmitting ? "Processing..." : "Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default UserFavService;  