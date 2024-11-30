import axios from 'axios';
import Cookies from 'js-cookie';

export const frontendServer = 'http://localhost:5173';
export const offlineServer = 'https://backend.taskcolony.com/';
export const offline = 'https://backend.taskcolony.com/api';

const user = 'user';
const admin = 'admin';
const user_urls = {
    register: `${user}/auth/register_user`,
    login: `${user}/auth/loginapp`,
    get_user_profile: `${user}/profile/get_user_detail`,
    fund_wallet: `${user}/profile/fundwallet`,
    fund_history: `${user}/profile/get_fund_history`,
    change_profile_pass: `${user}/profile/update_profile_password`,
    edit_user_profile: `${user}/profile/update_profile_data`,
    get_all_services: `${user}/services/get_all_services`,
    favourite_services: `${user}/profile/update_profile_favorite_service`,
    all_notification: `${user}/profile/get_user_notifications`,
    kyc_form: `${user}/kyc/kyc_level_1_form`,
    send_verify: `${user}/auth/send_email_or_pno_verification_code`,
    otp_verify: `${user}/auth/verify_email_or_pno_verification_code`,
    get_booking: `${user}/bookings/get_all_bookings`,
    update_bookings: `${user}/bookings/update_booking`,
    create_bookings: `${user}/bookings/update_booking`,
    cancel_bookings: `${user}/bookings/assign_booking`,
    delete_bookings: `${user}/bookings/delete_booking`,
    get_system: `${user}/system/get_system_data`,
    get_testimonial: `${user}/testimonials/get_all_testimonials`,
};
const admin_urls = {
    get_admin_dashboard: `${admin}/dashboard/all_stat`,
    get_admin_earning: `${admin}/earning/earning_stat`,
    get_admin_profile: `${admin}/profile/get_user_details  `,

    //booking
    get_booking: `${admin}/bookings/get_all_bookings`,
    update_bookings: `${admin}/bookings/update_booking`,
    assign_bookings: `${admin}/bookings/assign_booking`,
    delete_bookings: `${admin}/bookings/delete_booking`,

    //user
    get_user: `${admin}/users/get_all_users`,
    user_update: `${admin}/users/update_user`,
    user_delete: `${admin}/users/delete_user`,

    //admin
    get_admin: `${admin}/admins/get_all_admin`,
    update_admin: `${admin}/admins/update_admin`,
    delete_admin: `${admin}/admins/delete_admin`,

    //taex
    get_admin_taxes: `${admin}/tax/get_all_taxs`,
    create_admin_taxes: `${admin}/tax/create_tax`,
    update_admin_taxes: `${admin}/tax/update_tax`,
    delete_admin_taxes: `${admin}/tax/delete_tax`,

    //coupon
    get_admin_coupon: `${admin}/coupon/get_all_coupon`,
    create_admin_coupon: `${admin}/coupon/create_coupons`,
    update_admin_coupon: `${admin}/coupon/update_coupon`,
    delete_admin_coupon: `${admin}/coupon/delete_coupon`,

    //slider
    get_admin_slider: `${admin}/slider/get_all_slider`,
    create_admin_slider: `${admin}/slider/create_sliders`,
    update_admin_slider: `${admin}/slider/update_slider`,
    delete_admin_slider: `${admin}/slider/delete_slider`,

    //services
    get_admin_services: `${admin}/services/get_all_services`,
    create_admin_services: `${admin}/services/create_services`,
    update_admin_services: `${admin}/services/update_service`,
    delete_admin_gallery: `${admin}/services/delete_gallery_image_service`,
    delete_admin_services: `${admin}/services/delete_service`,

    //reviews
    get_admin_reviews: `${admin}/reviews/get_all_reviews`,
    update_admin_reviews: `${admin}/reviews/update_reviews`,
    delete_admin_reviews: `${admin}/reviews/delete_reviews`,

    //provider
    get_provider: `${admin}/providers/get_all_providers`,
    get_provider_payout: `${admin}/providers/get_all_provider_payout`,
    update_providers: `${admin}/providers/update_provider`,
    update_providers_docs: `${admin}/providers/update_provider_doc_status`,
    delete_providers: `${admin}/providers/delete_provider`,

    //category
    get_categories: `${admin}/categories/get_all_categories`,
    create_categories: `${admin}/categories/create_category`,
    update_categories: `${admin}/categories/update_category`,
    delete_categories: `${admin}/categories/delete_category`,

    //admin
    login_admin: `${admin}/auth/login`,
    forgetpass_admin: `${admin}/auth/forgot_password`,
    create_admin: `${admin}/admins/create_admin`,
};

export const Apis = {
    users: user_urls,
    admins: admin_urls,
};

// Unauthenticated POST request
export const Posturl = async (endpoint, data) => {
    const urlEncodedData = new URLSearchParams(data).toString();
    try {
        const response = await axios.post(`${offline}/${endpoint}`, urlEncodedData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response;
    } catch (error) {
        return error.response ? error.response.data : { status: false, text: 'Network error' };
    }
};

// Unauthenticated DELETE request
export const Deleteurl = async (endpoint, data) => {
    try {
        const response = await axios.delete(`${offline}/${endpoint}`, { data });
        return response.data;
    } catch (error) {
        return error.response ? error.response.data : { status: false, text: 'Network error' };
    }
};

// Unauthenticated GET request
export const Geturl = async (endpoint) => {
    try {
        const response = await axios.get(`${offline}/${endpoint}`);
        return response.data;
    } catch (error) {
        return error.response ? error.response.data : { status: false, text: 'Network error' };
    }
};

// Authenticated POST request
export const AuthPosturl = async (endpoint, data) => {
    const token = Cookies.get('taskcolony');
    try {
        const response = await axios.post(`${offline}/${endpoint}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',

            },
        });
        return response.data;
    } catch (error) {
        return error.response ? error.response.data : { status: false, text: 'Network error' };
    }
};

// Authenticated DELETE request
export const AuthDeleteurl = async (endpoint, data) => {
    const token = Cookies.get('taskcolony');
    try {
        const response = await axios.delete(`${offline}/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',

            },
            data, // Attach data to delete request if necessary
        });
        return response.data;
    } catch (error) {
        return error.response ? error.response.data : { status: false, text: 'Network error' };
    }
};

// Authenticated GET request
export const AuthGeturl = async (endpoint) => {
    const token = Cookies.get('taskcolony');
    try {
        const response = await axios.get(`${offline}/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',

            },
        });
        return response.data;
    } catch (error) {
        return error.response ? error.response.data : { status: false, text: 'Network error' };
    }
};
