import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, logout } from "../store/authSlice";
import axiosInstance from "../utils/axios";

function AuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      axiosInstance
        .get("/users/current-user")
        .then((res) => {
          dispatch(setUser(res.data.data));
        })
        .catch(() => {
          dispatch(logout());
        });
    }
  }, []);

  return children;
}

export default AuthProvider;
