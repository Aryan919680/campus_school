import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For redirection
import PageSkeleton from "../components/Skeleton/PageSkeleton";

const AuthContext = createContext({
  userData: null,
  token: null,
  isLoggedIn: false,
  isLoading: true,
  handleLogin: () => {},
  handleLogout: () => {},
  setIsLoggedIn: () => {},
  setToken: () => {},
  setUserData: () => {},
  refreshAuthState: () => {},
});

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Used for redirection

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserData = localStorage.getItem("userData");

    if (storedToken && storedUserData) {
      setToken(storedToken);
      setUserData(JSON.parse(storedUserData));
      setIsLoggedIn(true);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Axios interceptor for handling token expiration
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.message.toLowerCase() === "jwt expired" && error.response.status === 400) {
          console.error("JWT expired. Logging out...");
          handleLogout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const handleLogin = ({ token, userData }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userData", JSON.stringify(userData));
    setToken(token);
    setUserData(userData);
    setIsLoggedIn(true);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setToken(null);
    setUserData(null);
    setIsLoggedIn(false);
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login"); // Redirect to login page
  };

  const refreshAuthState = () => {
    const storedToken = localStorage.getItem("token");
    const storedUserData = localStorage.getItem("userData");

    if (storedToken && storedUserData) {
      setToken(storedToken);
      setUserData(JSON.parse(storedUserData));
      setIsLoggedIn(true);
    }
  };

  // Show PageSkeleton during initial load
  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <AuthContext.Provider
      value={{
        userData,
        token,
        isLoggedIn,
        isLoading,
        handleLogin,
        handleLogout,
        setIsLoggedIn,
        setToken,
        setUserData,
        refreshAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
