import axios from 'axios';
import Cookies from 'js-cookie';

export const frontendServer = 'http://localhost:5173';
export const offlineServer = 'https://backend.taskcolony.com/';
export const offline = 'https://backend.taskcolony.com/api';

const user = 'user';
const admin = 'admin';
const user_urls = {
    register: `${user}/auth/register_user.php`,
    forget_password: `${user}/auth/forgot_password.php`,
    reset_password: `${user}/auth/reset_password.php`,
    login: `${user}/auth/loginapp.php`,
    get_user_profile: `${user}/profile/get_user_detail.php`,
    fund_wallet: `${user}/profile/fundwallet.php`,
    fund_history: `${user}/profile/get_fund_history.php`,
    change_profile_pass: `${user}/profile/update_profile_password.php`,
    edit_user_profile: `${user}/profile/update_profile_data.php`,
    get_all_services: `${user}/services/get_all_services.php`,
    favourite_services: `${user}/profile/update_profile_favorite_service.php`,
    all_notification: `${user}/profile/get_user_notifications.php`,
    kyc_form: `${user}/kyc/kyc_level_1_form.php`,
    
    send_verify: `${user}/auth/send_email_or_pno_verification_code.php`,
    otp_verify: `${user}/auth/verify_email_or_pno_verification_code.php`,

    get_booking: `${user}/bookings/get_all_bookings.php`,
    update_bookings: `${user}/bookings/update_booking.php`,
    create_bookings: `${user}/bookings/create_booking.php`,
    cancel_bookings: `${user}/bookings/assign_booking.php`,
    delete_bookings: `${user}/bookings/delete_booking.php`,
    get_system: `${user}/system/get_system_data.php`,

    get_review: `${user}/reviews/get_all_reviews.php`,
    new_review: `${user}/reviews/create_review.php`,
    delete_review: `${user}/reviews/delete_review.php`,
    update_review: `${user}/reviews/update_review.php`,

    get_testimonial: `${user}/testimonials/get_all_testimonials.php`,
    google_verify: `${user}/auth/login_with_google_verify.php?code=4%2F0AeanS0Y5KLHo2R9a2z93lEVFfmb7vGFjvHEuXlyi73c6OODYE0Rbo0fe9zvbFNNbsSFm_Q&scope=email+profile+openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&authuser=0&prompt=consent&fromcode=2&registervia=1`,
};
const admin_urls = {
    get_admin_dashboard: `${admin}/dashboard/all_stat.php`,
    get_admin_earning: `${admin}/earning/earning_stat.php`,
    get_admin_profile: `${admin}/profile/get_user_details.php`,

    //booking
    get_booking: `${admin}/bookings/get_all_bookings.php`,
    update_bookings: `${admin}/bookings/update_booking.php`,
    assign_bookings: `${admin}/bookings/assign_booking.php`,
    delete_bookings: `${admin}/bookings/delete_booking.php`,

    //user
    get_user: `${admin}/users/get_all_users.php`,
    user_update: `${admin}/users/update_user.php`,
    user_delete: `${admin}/users/delete_user.php`,
    provider_payout: `${admin}/providers/get_all_provider_payout.php`,
    delete_provider: `${admin}/providers/delete_provider.php`,
    update_provider_docs: `${admin}/providers/update_provider_doc_status`,

    //admin
    get_admin: `${admin}/admins/get_all_admin.php`,
    update_admin: `${admin}/admins/update_admin.php`,
    delete_admin: `${admin}/admins/delete_admin.php`,

    //taex
    get_admin_taxes: `${admin}/tax/get_all_taxs.php`,
    create_admin_taxes: `${admin}/tax/create_tax.php`,
    update_admin_taxes: `${admin}/tax/update_tax.php`,
    delete_admin_taxes: `${admin}/tax/delete_tax.php`,

    //coupon
    get_admin_coupon: `${admin}/coupon/get_all_coupon.php`,
    create_admin_coupon: `${admin}/coupon/create_coupons.php`,
    update_admin_coupon: `${admin}/coupon/update_coupon.php`,
    delete_admin_coupon: `${admin}/coupon/delete_coupon.php`,

    //slider
    get_admin_slider: `${admin}/slider/get_all_slider.php`,
    create_admin_slider: `${admin}/slider/create_sliders.php`,
    update_admin_slider: `${admin}/slider/update_slider.php`,
    delete_admin_slider: `${admin}/slider/delete_slider.php`,

    //services
    get_admin_services: `${admin}/services/get_all_services.php`,
    create_admin_services: `${admin}/services/create_services.php`,
    update_admin_services: `${admin}/services/update_service.php`,
    delete_admin_gallery: `${admin}/services/delete_gallery_image_service.php`,
    delete_admin_services: `${admin}/services/delete_service.php`,

    //reviews
    get_admin_reviews: `${admin}/reviews/get_all_reviews.php`,
    update_admin_reviews: `${admin}/reviews/update_reviews.php`,
    delete_admin_reviews: `${admin}/reviews/delete_reviews.php`,

    //provider
    get_provider: `${admin}/providers/get_all_providers.php`,
    get_provider_payout: `${admin}/providers/get_all_provider_payout.php`,
    update_providers: `${admin}/providers/update_provider.php`,
    update_providers_docs: `${admin}/providers/update_provider_doc_status.php`,
    delete_providers: `${admin}/providers/delete_provider.php`,

    //category
    get_categories: `${admin}/categories/get_all_categories.php`,
    create_categories: `${admin}/categories/create_category.php`,
    update_categories: `${admin}/categories/update_category.php`,
    delete_categories: `${admin}/categories/delete_category.php`,

    //admin
    login_admin: `${admin}/auth/login.php`,
    forgetpass_admin: `${admin}/auth/forgot_password.php`,
    create_admin: `${admin}/admins/create_admin.php`,
};

export const Apis = {
    users: user_urls,
    admins: admin_urls,
};

// Unauthenticated POST request
export const Posturl = async (endpoint, data) => {
    const urlEncodedData = new URLSearchParams(data).toString();
    const apiKey = 'AIzaSyAWrGaFeWRxxtjxUCZGG7naNmHtg0RK88o'; // Your API key

    try {
        const response = await axios.post(`${offline}/${endpoint}`, urlEncodedData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${apiKey}`
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
