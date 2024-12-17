import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { Apis, AuthGeturl } from '../Components/General/Api';
import { dispatchLoggedIn, dispatchUser } from '../app/reducer';

const AppWrapper = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = Cookies.get('taskcolony');
            if (token) {
                try {
                    const res = await AuthGeturl(Apis.users.get_user_profile);
                    if (res.status) {
                        dispatch(dispatchUser(res.data)); // Populate Redux with user details.
                        dispatch(dispatchLoggedIn(true)); // Set login status.
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, []);

    return <>{children}</>;
};

export default AppWrapper;
