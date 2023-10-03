import { useState, useEffect } from "react";
import { setUser } from "@/store/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

function useAutoLogin() {
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    (async function autoLoginApiCall() {
      try {
        const response = await axios.get(
            "http://localhost:8000/refresh",
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          // 1. setUser
          const user = {
            _id: response.data.user._id,
            email: response.data.user.email,
            name: response.data.user.name,
            auth: response.data.auth,
            message: response.data.message
          };

          dispatch(setUser(user));
        }
      } catch (error) {
        //
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return loading;
}

export default useAutoLogin;