import { createContext, useReducer, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        id: action.payload.id,
        data: action.payload.data,
        isAuthenticated: true,
      };
    case "LOGOUT":
      return {
        id: null,
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
    data: null,
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const data = jwtDecode(token);
        const storedTeacherData = localStorage.getItem("teacherData");
        if (data.id && storedTeacherData) {
          dispatch({
            type: "LOGIN",
            payload: { id: data.id, data: JSON.parse(storedTeacherData) },
          });
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/v1/employee/login`,
      credentials
    );
    
    const responseData = response.data.data;
    if (responseData.token) {
      localStorage.setItem("token", responseData.token);
      localStorage.setItem("teacherData", JSON.stringify(responseData.data));
      const { id } = jwtDecode(responseData.token);
      dispatch({
        type: "LOGIN",
        payload: { id: id, data: responseData.data },
      });
    }
    return { message: response.message, success: response.data.success };
    
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("teacherData");
    dispatch({ type: "LOGOUT" });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        id: state.id,
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
