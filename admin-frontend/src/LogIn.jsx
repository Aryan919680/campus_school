import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import API_ENDPOINTS from "./API/apiEndpoints";
import { AuthContext } from "./context/AuthContext";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Mail } from "lucide-react";


const LogIn = ({ onSchoolOnboarding,onCollegeOnboarding }) => {
	const { setIsLoggedIn, setToken, setUserData, refreshAuthState } =
		useContext(AuthContext);
	const [credentials, setCredentials] = useState({ email: "", password: "" });
	const [campusType, setCampusType] = useState("school");
	const [userType, setUserType] = useState("ADMIN");
	const [errorMessage, setErrorMessage] = useState("");
	const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
	const [showForgotPassword, setShowForgotPassword] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		const storedUserData = localStorage.getItem("userData");
		const storedUserType = localStorage.getItem("userType");
		const storedCampusType = localStorage.getItem("campusType");
		if (token && storedUserData) {
			const decodedToken = jwtDecode(token);
			if (decodedToken.exp * 1000 > Date.now()) {
				setIsLoggedIn(true);
				setToken(token);
				setUserData(JSON.parse(storedUserData));
				if (storedCampusType === "college") {
					navigate("/college-dashboard");
				} else if (storedUserType === "finance") {
					navigate("/fees");
				} else if (storedUserType === "admin") {
					navigate("/");
				} else {
					setErrorMessage(
						`Unauthorized role: ${storedUserType}. Please log in with the appropriate role.`
					);
					navigate("/login");
				}
			} else {
				localStorage.clear();
				navigate("/login");
			}
		}
	}, [setIsLoggedIn, setToken, setUserData, navigate]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setCredentials({ ...credentials, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			let endpoint = API_ENDPOINTS.ADMIN_LOGIN;
			

			const response = await axios.post(endpoint, { ...credentials, userType });
			if (response.data.success) {
				// const userRole = response.data.data.role.toLowerCase();

				setIsLoggedIn(true);
				setToken(response.data.token);
				localStorage.setItem("token", response.data.data.token);
				localStorage.setItem("userData", JSON.stringify(response.data.data));
				localStorage.setItem("userType", userType);
				localStorage.setItem("campusType", response.data.data.data.campusType);
				window.dispatchEvent(new Event("userDataUpdated"));
				setUserData(response.data.data);

				refreshAuthState();

				if (campusType === "college") {
					navigate("/college-dashboard");
				} else if (userType === "finance") {
					navigate("/fees");
				} else {
					navigate("/");
				}
			}
		} catch (error) {
			console.error("Login error:", error);
			setErrorMessage(
				error.response?.data?.message ||
					"An error occurred. Please try again later."
			);
		}
	};
	window.addEventListener("userDataUpdated", () => {
	  });
	const handleForgotPassword = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(API_ENDPOINTS.ADMIN_FORGOT_PASSWORD, {
				email: forgotPasswordEmail,
			});
			if (response.data.success) {
				setForgotPasswordMessage("Password reset link sent to your email.");
			}
		} catch (error) {
			console.error("Forgot Password error:", error);
			setForgotPasswordMessage(
				"An error occurred. Please try again later or contact support."
			);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md">
				<form
					className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
					onSubmit={handleSubmit}
				>
					<h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

				<div className="mb-4">
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Email
  </label>

  <div className="relative group">
    
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-sky-500 transition-colors">
      <Mail size={18} />
    </div>

    <input
      type="email"
      name="email"
      value={credentials.email}
      onChange={handleChange}
      placeholder="Enter your email"
      required
      className="
        w-full
        pl-10 pr-3
        py-2.5
        border border-gray-300
        rounded-lg
        bg-gray-50
        text-gray-800
        placeholder-gray-400
        focus:outline-none
        focus:ring-2
        focus:ring-sky-500
        focus:border-sky-500
        focus:bg-white
        transition-all duration-200
      "
    />
  </div>
</div>

<div className="mb-6">
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Password
  </label>

  <div className="relative group">
    
    {/* Lock Icon */}
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-sky-500 transition-colors">
      <Lock size={18} />
    </div>

    {/* Input */}
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={credentials.password}
      onChange={handleChange}
      placeholder="Enter your password"
      required
      className="
        w-full
        pl-10 pr-10
        py-2.5
        border border-gray-300
        rounded-lg
        bg-gray-50
        text-gray-800
        placeholder-gray-400
        focus:outline-none
        focus:ring-2
        focus:ring-sky-500
        focus:border-sky-500
        focus:bg-white
        transition-all duration-200
      "
    />

    {/* Eye Toggle */}
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="
        absolute inset-y-0 right-0 flex items-center pr-3
        text-gray-400 hover:text-sky-600
        transition-colors duration-200
      "
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>

  </div>
</div>



					<div className="flex items-center justify-between">
						<button
							className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							type="submit"
						>
							Sign In
						</button>
						<button
							className="inline-block align-baseline font-bold text-sm text-sky-500 hover:text-sky-800"
							onClick={() => setShowForgotPassword(true)}
							type="button"
						>
							Forgot Password?
						</button>
					</div>
				</form>

				{errorMessage && (
					<div
						className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
						role="alert"
					>
						<span className="block sm:inline">{errorMessage}</span>
					</div>
				)}
 
				<div className="text-center">
					<p className="text-gray-600 text-sm">Don't have an account?</p>
	
				</div> 

				<div className="mt-4 text-center">
					<Link to="/" className="text-sm text-sky-500 hover:text-sky-700 font-semibold">
						Click Here To Register
					</Link>
				</div>
			</div>

			{showForgotPassword && (
				<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
					<div className="bg-white p-8 rounded-md shadow-xl max-w-md w-full">
						<h3 className="text-xl font-semibold mb-4">Reset Password</h3>
						<form onSubmit={handleForgotPassword}>
							<input
								type="email"
								value={forgotPasswordEmail}
								onChange={(e) => setForgotPasswordEmail(e.target.value)}
								placeholder="Enter your email"
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 mb-4"
								required
							/>
							<div className="flex justify-end">
								<button
									type="button"
									onClick={() => setShowForgotPassword(false)}
									className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="px-4 py-2 text-sm font-medium text-white bg-sky-500 rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
								>
									Reset Password
								</button>
							</div>
						</form>
						{forgotPasswordMessage && (
							<p className="mt-4 text-sm text-green-600">
								{forgotPasswordMessage}
							</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default LogIn;
