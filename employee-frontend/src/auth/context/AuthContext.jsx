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

    const fetchData = async (id, campusId) => {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/teacher/${campusId}/fetch/${id}`
      );
      return response.data.data;
    };

    if (token) {
      try {
        const data = jwtDecode(token);
        const storedCampusId = localStorage.getItem("campusId"); // Store the campusId when logging in

        if (data.id && storedCampusId) {
          fetchData(data.id, storedCampusId)
            .then((teacherData) => {
              dispatch({
                type: "LOGIN",
                payload: { id: data.id, data: teacherData },
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
      `${import.meta.env.VITE_BASE_URL}/api/v1/teacher/login`,
      credentials
    );
    const responseData = response.data;
    if (responseData.token) {
      console.log('Base URL:', import.meta.env.VITE_BASE_URL);

      localStorage.setItem("token", responseData.token);
      localStorage.setItem("campusId", responseData.teacherData.campusId); // Save campusId in localStorage
      const { id } = jwtDecode(responseData.token);
      const teacherData = await axios
        .get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/teacher/${responseData.teacherData.campusId}/fetch/${responseData.teacherData.id}`
        )
        .then((res) => res.data.data);
      dispatch({
        type: "LOGIN",
        payload: { id: id, data: teacherData },
      });
    }
    return { message: responseData.message, success: responseData.success };
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("campusId"); // Remove campusId on logout
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
