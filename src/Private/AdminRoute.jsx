import { useNavigate } from 'react-router-dom';
import { Apis, AuthGeturl } from '../Components/General/Api';
import { useDispatch } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { dispatchAdmin, dispatchAdminLoggedIn } from '../app/reducer';

const AdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);
  const dispatch = useDispatch();

  const fetchUser = useCallback(async () => {
    try {
      const res = await AuthGeturl(Apis.admins.get_admin_profile);

      if (res.status === true) {
        setAllowed(true);
        dispatch(dispatchAdmin(res.data.data));
        dispatch(dispatchAdminLoggedIn(true))

      } else {
        navigate('/auth/admin/login');
      }
    } catch (error) {
      navigate('/auth/admin/login');
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    const token = Cookies.get('taskcolony');
    if (token) {
      fetchUser();
    } else {
      navigate('/auth/admin/login');
    }
  }, [fetchUser, navigate]);

  if (allowed) return children;

  return null;
};

export default AdminRoute;
