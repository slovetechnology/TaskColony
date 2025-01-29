export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: '2-digit', day: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-US', options).replace(/\//g, '-');
};

import img1 from "assets/new/img1.svg"
import img3 from "assets/new/img3.svg"
import img2 from "assets/new/img2.svg"
import logo from "assets/new/logo.svg"
import img4 from "assets/new/img4.svg"
import img5 from "assets/new/img5.svg"
import img6 from "assets/new/img6.svg"
import img7 from "assets/new/img7.svg"
import img8 from "assets/new/img8.svg"
import img9 from "assets/new/img9.svg"
import img10 from "assets/new/img10.svg"
import img11 from "assets/new/img11.svg"
import img12 from "assets/new/img12.svg"
import img13 from "assets/new/img13.svg"
import img14 from "assets/new/img14.png"
import img15 from "assets/new/img15.svg"
import img16 from "assets/new/img16.svg"
import img17 from "assets/new/img17.svg"
import img18 from "assets/new/img18.svg"
import img19 from "assets/new/img19.svg"
import img20 from "assets/new/img20.svg"
import img21 from "assets/new/img21.svg"
import img23 from "assets/new/img23.svg"
import img24 from "assets/new/img24.svg"
import img25 from "assets/electric.png"
import img26 from "assets/new/img26.svg"
import img27 from "assets/new/img27.svg"
import img28 from "assets/new/img28.svg"
import img22 from "assets/new/img22.svg"
import img29 from "assets/new/img29.svg"
import img30 from "assets/new/img30.svg"
import img31 from "assets/new/img31.svg"
import img32 from "assets/new/img32.svg"
import img33 from "assets/new/img33.svg"
import img34 from "assets/new/img34.svg"
import img35 from "assets/new/img35.svg"
import img36 from "assets/new/img36.svg"
import img37 from "assets/new/img37.svg"
import img38 from "assets/new/img38.svg"
import img39 from "assets/new/img39.svg"
import img41 from "assets/new/img41.svg"
import img43 from "assets/new/img43.svg"
import review from "../../src/assets/review.png"


import team1 from "assets/new/team1.svg"
import team2 from "assets/new/team2.svg"
import team3 from "assets/new/team3.svg"
import team4 from "assets/new/tam4.svg"
import team5 from "assets/new/team5.svg"
import team6 from "assets/new/team6.svg"
import team7 from "assets/new/team7.svg"
import team8 from "assets/new/team8.svg"

import newhome from "../assets/newhome.jpg"
import pet from "../assets/pet.jpg"
import home from "../assets/homeowner.jpeg"
import student from "../assets/student.jpg"
import Busy from "../assets/busy.png"
import freelancer from "../assets/Freelancer.png"
import Handyman from "../assets/handyman.jpg"

export const NavLinks = [
    { title: 'Home', link: '/' },
    { title: 'AC service & repair', link: '' },
    { title: 'cleaning', link: '' },
    { title: 'pest control', link: '' },
    { title: 'plumbing', link: '' },
    { title: 'salon for women', link: '' },
    { title: 'security cctv', link: '' },
    { title: 'smart home', link: '' },
]

export const FooterLinks = [
    { title: 'About us', link: '/about' },
    { title: 'Contact us', link: '/contact' },
    { title: 'Privacy', link: '/privacy' },
    { title: 'Terms and Condition', link: '/terms' },
    { title: 'Career', link: '' },
    { title: 'Team', link: '/team' },
]

export const TopNavsLinks = [
    { title: 'home', link: '/' },
    { title: 'categories', link: '/category' },
    { title: 'services', link: '/service' },
    { title: 'my booking', link: '/booking-list' },
]

export const HomeServices = [
    { img: img5, title: 'The Best For Every Budget', content: 'Affordable, high-quality services tailored to meet your needs without compromising on excellence.' },
    { img: img6, title: 'Quality Work Done Quickly', content: 'Efficient and reliable services delivered promptly without sacrificing quality.' },
    { img: img7, title: '24 Hours Customer Support', content: `We're here for you anytime, providing prompt assistance and ensuring you're satisfied around the clock.` },
]
export const HomeCategories = [
    { img: img8, title: 'handyman' },
    { img: img9, title: 'moving services' },
    { img: img10, title: 'Furniture Assembly' },
    { img: img11, title: 'Mounting & Installation' },
    { img: img12, title: 'cleaning' },
    { img: img13, title: 'Shopping & Delivery' },
]

export const ProviderPackages = [
      {
        droptext: { text: `Yes, your data is secure. We follow stringent privacy and security protocols as outlined in our Privacy Policy to ensure your personal and transactional data is protected.`, },
        text: '11. For Providers',
        id: 11
    },
    {
        droptext: {
            text: `If you encounter any challenges or have further questions, please contact our support team:`,
            subtext: [
                `Email: support@swiftpointsproject.com`,
                `Phone: +1332350929`,
                `Feedback: Available on our app.`
            ]

        },
        text: '12. How to manage jobs/task',
        id: 12
    },
    {
        droptext: {
            text: `If you encounter any challenges or have further questions, please contact our support team:`,
            subtext: [
                `Email: support@swiftpointsproject.com`,
                `Phone: +1332350929`,
                `Feedback: Available on our app.`
            ]

        },
        text: '13. Are the providers verified?',
        id: 12
    },
    {
        droptext: {
            text: `If you encounter any challenges or have further questions, please contact our support team:`,
            subtext: [
                `Email: support@swiftpointsproject.com`,
                `Phone: +1332350929`,
                `Feedback: Available on our app.`
            ]

        },
        text: '13. Is it free?',
        id: 13
    },
];
export const UserPackages = [
    {
        droptext: { text: `Swift Points (SP) are digital rewards mined within the Swift Points Mining App. SP can be earned by users through mining and participating in ecosystem activities, with the potential to convert them to SwiftCoin (SC) in the future.`, },
        text: '1. Trying to Book a service? Do not worry; you are only a few clicks away.',
        id: 1
    },
    {
        droptext: {
            text: `Mining is simple:`,

            subtext: [
                `Open the Swift Points app.`,
                `Tap “Start Mining.”`,
                `Mining rewards are credited every 12 hours. Ensure to reactivate mining sessions regularly to maximize your earnings.`,
            ]
        },
        text: `2. How to manage my bookings`,
        id: 2
    },
    {
        droptext: { text: `Yes, the Swift Points Mining App is completely free to download and use. There are no charges for mining SP.`, },
        text: '3. Is my Location visible to Providers on the app?',
        id: 3
    },
    {
        droptext: {
            text: `Share your unique referral code  available in the app.`,

            subtext: [
                `For every active referral, you receive Swift points (SP) and incentives.`,
                `The referral program includes special milestones where you can earn USDT rewards based on the number of active miners you refer.”`,
            ]
        },
        text: '4. Is it safe to use?',
        id: 4
    },
    {
        droptext: { text: `The buyback program allows users to exchange their mined Swift Points (SP) for USDT during specific periods. The rates are predetermined, e.g., 100 SP = 1 USDT.`, },
        text: '5. Are there any consultation fees?',
        id: 5
    },
    {
        droptext: { text: `Once SwiftCoin (SC) launches, your Swift Points can be converted into SwiftCoin at the standard conversion rate of 1,000 SP = 1 SC, allowing you to participate in the broader cryptocurrency market.`, },
        text: '6. When can I book my service?',
        id: 6
    },
    {
        droptext: { text: `Yes, Swift Points (SP) can be transferred between users! This feature is already integrated into the app, allowing users to exchange SP seamlessly. Whether you’re rewarding someone, engaging in peer-to-peer exchanges, or building a stronger community, transferring SP is fast, secure, and easy to use.`, },
        text: '7. Who are the Providers?',
        id: 7
    },
    {
        droptext: { text: `Mining rates may decrease as more users join the ecosystem. This adjustment is designed to maintain the balance and sustainability of Swift Points over time.`, },
        text: '8. Can I choose a Provider?',
        id: 8
    },
    {
        droptext: {
            text: `Be an early adopter to enjoy higher initial mining rates.`,

            subtext: [
                `Refer friends and participate in special mining rate boosts announced periodically.`,
                `Stay active and log in daily to maximize mining sessions.”`,
                `Engage in our social educational programs to increase your SP.`,
            ]
        },
        text: '9. Can I Book by phone?',
        id: 9
    },
    {
        droptext: { text: `The Social-Fi Wallet Browser is an integrated Web2 and Web3 platform that allows users to explore decentralized applications (DApps), manage cryptocurrencies, and perform transactions securely within the Swift Ecosystem.`, },
        text: '10. How does Payment work?',
        id: 10
    },
    {
        droptext: {
            text: `If you encounter any challenges or have further questions, please contact our support team:`,
            subtext: [
                `Email: support@swiftpointsproject.com`,
                `Phone: +1332350929`,
                `Feedback: Available on our app.`
            ]

        },
        text: '13. Is it free?',
        id: 13
    },
];

export const Team = [
    { img: team1, title: 'Olivia Rhye', position: 'Founder & CEO', description: "Former co-founder of Opendoor. Early staff at Spotify and Clearbit." },
    { img: team2, title: 'Phoenix Baker', position: 'Engineering Manager', description: "Lead engineering teams at Figma, Pitch, and Protocol Labs." },
    { img: team3, title: 'Lana Steiner', position: 'Product Manager', description: "Former PM for Linear, Lambda School, and On Deck." },
    { img: team4, title: 'Demi Wilkinson', position: 'Frontend Developer', description: "Former frontend dev fpr Linear, Coinbase, and Postscript." },
    { img: team5, title: 'Candice Wu', position: 'Backend Developer', description: "Lead backend dev at Clearbit. Former Clearbit and Loom." },
    { img: team6, title: 'Natali Craig', position: 'Product Designer', description: "Founding design team at Figma. Former Pleo, Stripe, and Tile." },
    { img: team7, title: 'Drew Cano', position: 'UX Researcher', description: "Lead user research for Slack. Contractor for Netflix and Udacity." },
    { img: team8, title: 'Orlando Diggs', position: 'Customer Success', description: "Lead CX at Wealthsimple. Former PagerDuty and Sqreen." },
]
export const Faq = [
    { title: 'Question text goes here', description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere." },

]

export const HomeOurServices = [
    { img: img14, title: 'Painting for Beautiful Homes', tag: 'painting', price: 550.6, rating: 4.8 },
    { img: img15, title: 'Car Wash and Cleaning', tag: 'car wash', price: 550.6, rating: 4.8 },
    { img: img16, title: 'Cleaning & Disinfecting Office', tag: 'painting', price: 550.6, rating: 4.8 },
    { img: img17, title: 'Furniture Assembly', tag: 'car wash', price: 550.6, rating: 4.8 },
    { img: img18, title: 'Home Cleaning', tag: 'painting', price: 550.6, rating: 4.8 },
    { img: img19, title: 'TV Installation', tag: 'car wash', price: 550.6, rating: 4.8 },
    { img: img20, title: 'Electronic Devices', tag: 'painting', price: 550.6, rating: 4.8 },
    { img: img21, title: 'CCTV Installation', tag: 'car wash', price: 550.6, rating: 4.8 },
]

export const HomeBestOffers = [
    { img: img16, title: 'House Cleaning & Disinfecting', tag: '', deal: 75, sub: ' on all items', price: 35 },
    { img: img21, title: 'CCTV Installation', tag: 'Repair Service', deal: false, sub: 'Experts at your door in 1 hour', price: 35 },
    { img: review, title: 'House Cleaning & Disinfecting', tag: 'Best Deal Month', deal: 75, sub: ' on all items', price: 35 },
]


export const HomeTestimonials = [
    {
        title: "“Homeowner“",
        content: `TaskColony made my life so much easier! I found a reliable handyman within minutes, and the service was top-notch. Highly recommend!`,
        name: `Alex P.`,
        img: home,
        date: "One week ago",
        rating: 5
    },
    {
        title: "“Freelancer“",
        content: `I was impressed by how quickly I could book a cleaner. The app is user-friendly, and my home has never looked better. Thank you, TaskColony!`,
        name: `Mark J.`,
        img: freelancer,
        date: "Two weeks ago",
        rating: 4
    },
    {
        title: "“Busy Professional“",
        content: `As a busy professional, I don’t have time for errands. TaskColony helped me find someone to handle my grocery shopping, and the experience was fantastic!`,
        name: `Lisa K.`,
        img: Busy,
        date: "Three days ago",
        rating: 5
    },
    {
        title: "“Excellent Service by Handyman“",
        content: `The flexibility of choosing my own Tasker is great! I felt comfortable knowing I could read reviews and pick the best person for the job.`,
        name: `Tom W.`,
        img: Handyman,
        date: "Yesterday",
        rating: 4
    },
    {
        title: "“Student“",
        content: `I needed help moving last minute, and TaskColony came through! The Tasker was punctual and extremely helpful. I’ll definitely use this service again!`,
        name: `Sophie R.`,
        img: student,
        date: "Five days ago",
        rating: 5
    },
    {
        title: "“Pet Owner“",
        content: `The web app is so easy to navigate! I booked a pet sitter in no time, and my dog loved her. Will definitely use TaskColony again!`,
        name: `Emily S.`,
        img: pet,
        date: "Last week",
        rating: 5
    },
    {
        title: "“New Homeowner“",
        content: `TaskColony saved me during a busy week. I had someone assemble my furniture quickly and efficiently. Great service!`,
        name: `John D.`,
        img: newhome,
        date: "Last month",
        rating: 4
    },
];
export const StoreLinks = [
    { img: img27 },
    { img: img28 },
]

export const HomeGallery = [
    { img: img29 },
    { img: img30 },
    { img: img31 },
    { img: img32 },
]

export const HomeProviders = [
    { img: img33, title: `Leslie Alexander`, tag: 'electrician' },
    { img: img34, title: `Marvin McKinney`, tag: 'painter' },
    { img: img35, title: `Arlene McCoy`, tag: 'carpenter' },
    { img: img36, title: `Courtney Henry`, tag: 'plumber' },
]

export const FooterSocials = [
    { img: img39, link: 'https://www.facebook.com/profile.php?id=61568515424684&mibextid=ZbWKwL' },
    { img: img41, link: 'https://www.linkedin.com/in/task-colony-a90931339?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' },
    { img: img43, link: 'https://www.instagram.com/taskcolony' },
]

export const FooterContacts = [
    { title: `Careers`, content: `Jobs@taskcolony.com` },
    { title: `Business Inquries`, content: `inquries@taskcolony.com` },
    { title: `Helpline Number`, content: `+1 720 573 1900` },
]

export { img1, img2, img3, img4, img23, img25, img37, img38, img26, img22, logo }
export const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 1000,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                infinite: true,
                dots: true,
            },
        },
        {
            breakpoint: 769,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                initialSlide: 2,
                infinite: true,
                dots: true,
            },
        },
        {
            breakpoint: 576,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: true,
            },
        },
    ],
};
// export const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 2, // Show one slide by default for small screens
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 1000,
//     responsive: [
//         {
//           breakpoint: 1024,
//           settings: {
//             slidesToShow: 1,
//             slidesToScroll: 1,
//             infinite: true,
//             dots: true,
//           },
//         },
//         {
//           breakpoint: 769,
//           settings: {
//             slidesToShow: 1,
//             slidesToScroll: 1,
//             initialSlide: 2,
//             infinite: true,
//             dots: true,
//           },
//         },
//         {
//           breakpoint: 576,
//           settings: {
//             slidesToShow: 1,
//             slidesToScroll: 1,
//             infinite: true,
//             dots: true,
//           },
//         },
//       ],
// };