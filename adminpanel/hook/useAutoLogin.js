import { useEffect, useState } from 'react'
import { refresh } from "../pages/api/api";
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/UserSlice';
import axios from 'axios';

const useAutoLogin = () => {
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        (async function autoLoginHandler() {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/refresh",
                  {
                    withCredentials: true,
                  }
                );
                if (response.status === 200) {
                    const user = {
                        _id: response.data.user._id,
                        firstName: response.data.user.firstName,
                        lastName: response.data.user.lastName,
                        email: response.data.user.email,
                        auth: response.data.auth,
                    };

                    dispatch(setUser(user));
                }
            } catch (error) {
                //
            } finally {
                setLoading(false);
            }
        })();
    }, [])

    return loading;
}

export default useAutoLogin;