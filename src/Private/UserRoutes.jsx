  import { useNavigate } from 'react-router-dom';
  import { Apis, AuthGeturl } from '../Components/General/Api';
  import { useDispatch } from 'react-redux';
  import { useCallback, useEffect, useState } from 'react';
  import Cookies from 'js-cookie'; 
  import { dispatchLoggedIn, dispatchUser } from '../app/reducer';

  const UserRoute = ({ children }) => {
    const navigate = useNavigate();
    const [allowed, setAllowed] = useState(false);
    const dispatch = useDispatch();

    const fetchUser = useCallback(async () => {
      try {
        const res = await AuthGeturl(Apis.users.get_user_profile);
        if (res.status === true) {
          setAllowed(true);
          dispatch(dispatchUser(res.data));
          dispatch(dispatchLoggedIn(true)) 
        } else {
          navigate('/login'); 
        }
      } catch (error) {
        navigate('/login');
      }
    }, [dispatch, navigate]);

    useEffect(() => {
      const token = Cookies.get('taskcolony');
      if (token) {
        fetchUser(); 
      } else {
        navigate('/login'); 
      }
    }, [fetchUser, navigate]);

    if (allowed) return children; 

    return null; 
  };

  export default UserRoute;
