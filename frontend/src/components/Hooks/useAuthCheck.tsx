import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isNotLoggedIn = !localStorage.getItem('token');
    console.log('isNotLoggedIn', isNotLoggedIn);

    if (isNotLoggedIn) {
      console.log('not logged in');
      navigate('/Login');
    }
  }, [navigate]);
};

export default useAuthCheck;
