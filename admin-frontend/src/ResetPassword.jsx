import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_ENDPOINTS from "./API/apiEndpoints";

const ResetPassword = () => {
	const { token, userId } = useParams();
	const navigate = useNavigate();
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Function to check if both passwords match
	const checkPasswordMatch = () => {
		return password && confirmPassword && password === confirmPassword;
	};

	// Function to handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!checkPasswordMatch()) {
			setErrorMessage("Passwords do not match");
			return;
		}

		if (!userId || !token) {
			setErrorMessage("Invalid user ID or token");
			return;
		}

		setIsSubmitting(true);

		try {
			// Ensure URL is constructed correctly
			const resetPasswordUrl = API_ENDPOINTS.ADMIN_RESET_PASSWORD(
				userId,
				token
			);
			console.log("API URL:", resetPasswordUrl);

			// Sending 'password' in the request body
			const response = await axios.post(resetPasswordUrl, { password });

			if (response.data.success) {
				setSuccessMessage("Password reset successfully");
				// Redirect to the login page after successful reset
				setTimeout(() => {
					navigate("/login");
				}, 2000); // Redirect after 2 seconds
			} else {
				setErrorMessage("Failed to reset password. Please try again later.");
			}
		} catch (error) {
			console.error("Error during password reset:", error);
			setErrorMessage("An error occurred. Please try again later.");
		}

		setIsSubmitting(false);
	};

	return (
		<div className="flex items-center justify-center h-screen bg-gray-100">
			<div className="bg-white p-6 rounded-lg shadow-lg w-80">
				<h2 className="text-center text-2xl font-semibold text-gray-700 mb-6">
					Reset Password
				</h2>
				<form id="resetForm" onSubmit={handleSubmit}>
					<div className="mb-4">
						<label htmlFor="password" className="block text-gray-600 mb-2">
							New Password
						</label>
						<input
							id="password"
							type="password"
							name="password"
							placeholder="Enter new password"
							className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<div className="mb-4">
						<label
							htmlFor="confirmPassword"
							className="block text-gray-600 mb-2"
						>
							Confirm Password
						</label>
						<input
							id="confirmPassword"
							type="password"
							name="confirmPassword"
							placeholder="Confirm new password"
							className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
					</div>
					<button
						type="submit"
						className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
						disabled={!checkPasswordMatch() || isSubmitting}
					>
						{isSubmitting ? "Submitting..." : "Reset Password"}
					</button>
					<p id="message" className="mt-4 text-center text-sm">
						{errorMessage && (
							<span className="text-red-500">{errorMessage}</span>
						)}
						{successMessage && (
							<span className="text-green-500">{successMessage}</span>
						)}
					</p>
				</form>
			</div>
		</div>
	);
};

export default ResetPassword;
