import { createContext, useReducer, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        id: action.payload.id,
        campusId: action.payload.campusId,
        data: action.payload.data,
        isAuthenticated: true,
      };
    case "LOGOUT":
      return {
        id: null,
        campusId: null,
        data: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    id: null,
    campusId: null,
    data: null,
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const campusId = localStorage.getItem("campusId");

    console.log("Stored Token & Campus ID:", token, campusId);

    if (token && campusId) {
      try {
        const decodedToken = jwtDecode(token);
        const studentData = localStorage.getItem("studentData");

        if (decodedToken?.id && studentData) {
          dispatch({
            type: "LOGIN",
            payload: {
              id: decodedToken.id,
              campusId: campusId,
              data: JSON.parse(studentData),
            },
          });
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/student/login`,
        credentials
      );

      const responseData = response.data;
      if (responseData.success && responseData.data?.token) {
        const { token, data } = responseData.data;

        localStorage.setItem("token", token);
        localStorage.setItem("campusId", data.campusId);
        localStorage.setItem("studentData", JSON.stringify(data));

        const decodedToken = jwtDecode(token);

        dispatch({
          type: "LOGIN",
          payload: { id: decodedToken.id, campusId: data.campusId, data },
        });

        return { message: responseData.message, success: true };
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Login error:", error);
      return { message: "Login failed. Please try again.", success: false };
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("campusId");
      localStorage.removeItem("studentData");

      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        id: state.id,
        campusId: state.campusId,
        data: state.data,
        isAuthenticated: state.isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
