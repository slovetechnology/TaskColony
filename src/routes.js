import AllAdmin from "./Pages/Admin/Admin.jsx/AllAdmin"
import CreateAdmin from "./Pages/Admin/Admin.jsx/CreateAdmin"
import AdminLogin from "./Pages/Admin/AdminForms/AdminLogin"
import AllCoupon from "./Pages/Admin/Coupon/AllCoupon"
import NewCoupon from "./Pages/Admin/Coupon/NewCoupon"
import Dashboard from "./Pages/Admin/Dashboard"
import AllServices from "./Pages/Admin/Services/AllServices"
import NewServices from "./Pages/Admin/Services/NewServices"
import AllTaxes from "./Pages/Admin/Taxes/AllTaxes"
import NewTax from "./Pages/Admin/Taxes/NewTaxes"
import NewSlider from './Pages/Admin/Sliders/NewSlider'
import AllSlider from "./Pages/Admin/Sliders/AllSlider"
import AllCategories from "./Pages/Admin/Categories/AllCategories"
import NewCategory from "./Pages/Admin/Categories/NewCategory"
import AllBookings from "./Pages/Admin/Bookings/AllBookings"
import AllUser from "./Pages/Admin/Users/AllUser"
import AllEarning from "./Pages/Admin/Earning/AllEarning"
import SingleUser from "./Pages/Admin/Users/SingleUser/SingleUser"
import FormTest from "./FormTest"
import Home from "./Pages/General/Home"
import User from "./Pages/User/Profiles/User"
import Terms from "./Pages/General/Terms"
import Privacy from "./Pages/General/Privacy"
import Aboutus from "./Pages/General/Aboutus"
import BookingList from "./Pages/User/Service/BookingList"
import Category from "./Pages/General/Category"
import Subcategory from "./Pages/General/Subcategory"
import Service from "./Pages/User/Service/Service"
import ServiceDetail from "./Pages/User/Service/ServiceDetail"
import Login from "./Pages/General/Forms/Login"
import Signup from "./Pages/General/Forms/Signup"
import ForgetPassword from "./Pages/General/Forms/ForgetPassword"
import Notification from "./Pages/General/Notification"
import ConfirmBooking from "./Pages/User/Service/ConfirmBooking"
import Contactus from "./Pages/General/Contactus"
import Faq from "./Pages/General/Faq"
import Provider from "./Pages/User/Provider/Provider"
import VerifyEmail from "./Pages/General/Forms/VerifyEmail"



export const GeneralNoAuth = [
    { path: 'login', element: Login },
    { path: 'signup', element: Signup },
    { path: 'forms', element: FormTest },
    { path: '', element: Home },
    { path: 'service', element: Service },
    { path: 'terms', element: Terms },
    { path: 'privacy', element: Privacy },
    { path: 'about', element: Aboutus },
    { path: 'faq', element: Faq },
    { path: 'contact', element: Contactus },
    { path: 'verify', element: VerifyEmail },

]
export const GeneralRoutes = [
    { path: 'user', element: User },
    { path: 'booking-list', element: BookingList },
    { path: 'category', element: Category },
    { path: 'sub-category', element: Subcategory },
    { path: 'service-detail', element: ServiceDetail },
    { path: 'reset-password', element: ForgetPassword },
    { path: 'notification', element: Notification },
    { path: 'confirm-booking', element: ConfirmBooking },
    { path: 'provider', element: Provider },
]

export const AdminRoutes = [
    { path: '', element: Dashboard },
    { path: 'admin', element: AllAdmin },
    { path: 'new-admin', element: CreateAdmin },
    { path: 'service', element: AllServices },
    { path: 'new-service', element: NewServices },
    { path: 'Earning', element: AllEarning },
    { path: 'user', element: AllUser },
    { path: 'user/single/:userId', element: SingleUser },
    { path: 'booking', element: AllBookings },
    { path: 'category', element: AllCategories },
    { path: 'new-category', element: NewCategory },
    { path: 'slider', element: AllSlider },
    { path: 'new-slider', element: NewSlider },
    { path: 'tax', element: AllTaxes },
    { path: 'new-tax', element: NewTax },
    { path: 'new-coupon', element: NewCoupon },
    { path: 'coupon', element: AllCoupon },
]
export const AdminNoRoutes = [
    { path: 'login', element: AdminLogin },

]