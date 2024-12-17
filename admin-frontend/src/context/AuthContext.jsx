import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

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

	useEffect(() => {
		const storedToken = localStorage.getItem("token");
		const storedUserData = localStorage.getItem("userData");

		if (storedToken && storedUserData) {
			const parsedUserData = JSON.parse(storedUserData);
			setToken(storedToken);
			setUserData(parsedUserData);
			setIsLoggedIn(true);
			axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
		}
		setIsLoading(false);
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
