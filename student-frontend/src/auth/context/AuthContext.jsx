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

    async function fetchData(id, campusId) {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/student/${campusId}/fetch/${id}`
      );
      return response.data.data;
    }

    if (token && campusId) {
      try {
        const data = jwtDecode(token);
        if (data.id) {
          fetchData(data.id, campusId)
            .then((studentData) => {
              dispatch({
                type: "LOGIN",
                payload: { id: data.id, campusId: campusId, data: studentData },
              });
              setLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/v1/student/login`,
      credentials
    );
    const data = response.data;

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("campusId", data.data.campusId); // Store campusId in localStorage
      const { id } = jwtDecode(data.token);
      const campusId = data.data.campusId;

      const studentData = await axios
        .get(`${import.meta.env.VITE_BASE_URL}/api/v1/student/${campusId}/fetch/${id}`)
        .then((res) => res.data.data);

      dispatch({
        type: "LOGIN",
        payload: { id: id, campusId: campusId, data: studentData },
      });
    }

    return { message: data.message, success: data.success };
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("campusId"); // Remove campusId from localStorage on logout
    dispatch({ type: "LOGOUT" });
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
