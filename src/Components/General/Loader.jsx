import { useEffect, useState } from 'react';

import Lottie from 'react-lottie';
import animationData from '../../Lotties/task-colony';
import { useLocation } from 'react-router-dom';
const Loader = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const {pathname} = useLocation()
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };
    useEffect(() => {
        setLoading(true)
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, [pathname]);

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full h-screen">
                <div className="">
                    <Lottie
                        options={defaultOptions}
                        height={100}
                        width={230}
                    />
                </div>
            </div>
        );
    }

    return <div>{children}</div>;
};

export default Loader;
