import React, { useState } from "react";
import axios from "axios";
import API_ENDPOINTS from "../API/apiEndpoints";

const ReviewPage = ({ onPrevious, onSubmit }) => {
	const [showOtpPopup, setShowOtpPopup] = useState(false);
	const [otp, setOtp] = useState("");
	const [roleId, setRoleId] = useState(null);
	// const apiEndpoints = useApiEndpoints();

	// Get all data from localStorage
	const campusData = {
		logo: localStorage.getItem("campusLogo") || "",
		name: localStorage.getItem("campusName") || "",
		location: localStorage.getItem("campusLocation") || "",
		foundedYear: localStorage.getItem("campusFoundedYear") || "",
	};

	const branchData = {
		name: localStorage.getItem("branchName") || "",
		location: localStorage.getItem("branchLocation") || "",
	};

	const adminData = {
		name: localStorage.getItem("adminName") || "",
		email: localStorage.getItem("adminEmail") || "",
		role: localStorage.getItem("adminRole") || "admin",
		photo: localStorage.getItem("adminPhoto") || "",
		password: localStorage.getItem("adminPassword") || "",
	};

	const handleSubmit = async () => {
		try {
			const headers = {
				"Content-Type": "application/json",
				Accept: "application/json",
			};

			const campusResponse = await axios.post(
				API_ENDPOINTS.CREATE_CAMPUS,
				{
					name: campusData.name,
					location: campusData.location,
					foundedYear: parseInt(campusData.foundedYear),
					logo: campusData.logo,
				},
				{ headers }
			);

			if (!campusResponse.data?.data?.id)
				throw new Error("Campus creation failed");

			const campusId = campusResponse.data.data.id;
			localStorage.setItem("campusId", campusId);

			const branchResponse = await axios.post(
				API_ENDPOINTS.CREATE_BRANCH,
				{
					campusId: Number(campusId),
					location: branchData.location,
					BranchName: branchData.name,
				},
				{ headers }
			);

			if (!branchResponse.data?.data?.id)
				throw new Error("Branch creation failed");

			const branchId = branchResponse.data.data.id;
			localStorage.setItem("branchId", branchId);

			const adminResponse = await axios.post(
				API_ENDPOINTS.CREATE_ADMIN,
				{
					name: adminData.name,
					email: adminData.email,
					password: adminData.password,
					branchId: Number(branchId),
					role: adminData.role,
					photo: adminData.photo,
				},
				{ headers }
			);

			if (!adminResponse.data?.data?.id)
				throw new Error("Admin creation failed");

			setRoleId(adminResponse.data.data.id);
			setShowOtpPopup(true);
		} catch (error) {
			console.error("Error details:", error.response?.data || error.message);
			alert(
				`Submission failed: ${error.response?.data?.message || error.message}`
			);
		}
	};

	const handleVerifyOtp = async () => {
		try {
			const response = await axios.post(API_ENDPOINTS.VERIFY_EMAIL, { otp });

			if (response.data?.success) {
				localStorage.setItem("otpVerified", "true");
				setShowOtpPopup(false);
				onSubmit();
			} else {
				throw new Error("OTP verification failed");
			}
		} catch (error) {
			alert(error.response?.data?.message || "OTP verification failed");
		}
	};

	return (
		<div className="">
			<h2 className="text-2xl font-semibold mb-4">Review Details</h2>

			<div className="mb-4">
				<h3 className="font-semibold my-4 text-center text-xl">
					Campus Information
				</h3>
				<div className="flex justify-between items-start gap-4">
					<div>
						{campusData.logo && (
							<img
								src={campusData.logo}
								alt="Logo"
								className="w-24 h-24 object-contain rounded-full mt-4"
							/>
						)}
					</div>
					<div>
						<div>
							<p>Campus: {campusData.name}</p>
							<p>Location: {campusData.location}</p>
							<p>Founded Year: {campusData.foundedYear}</p>
						</div>

						<div className="my-4">
							<h3 className="font-semibold">Branch Information</h3>
							<p>Branch: {branchData.name}</p>
							<p>Location: {branchData.location}</p>
						</div>
					</div>
				</div>
			</div>

			<div>
				<h3 className="font-semibold my-4 text-center text-xl">
					Admin Information
				</h3>
				<div className="flex justify-between items-start gap-4">
					<div>
						{adminData.photo && (
							<img
								src={adminData.photo}
								alt="Admin Photo"
								className="w-24 h-24 object-contain rounded-full mt-4"
							/>
						)}
					</div>
					<div>
						<p>Admin: {adminData.name}</p>
						<p>Email: {adminData.email}</p>
						<p>Role: {adminData.role}</p>
					</div>
				</div>
			</div>

			<div className="flex justify-between mt-6">
				<button
					type="button"
					onClick={onPrevious}
					className="py-2 px-4 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700"
				>
					Previous
				</button>
				<button
					type="button"
					onClick={handleSubmit}
					className="py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
				>
					Verify & Submit
				</button>
			</div>

			{showOtpPopup && (
				<div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
					<div className="bg-white p-4 rounded shadow-md">
						<h2 className="text-xl font-semibold mb-4">Enter OTP</h2>
						<input
							type="text"
							value={otp}
							onChange={(e) => setOtp(e.target.value)}
							className="border border-gray-300 rounded-md p-2 mb-4 w-full"
							placeholder="Enter OTP"
						/>
						<button
							onClick={handleVerifyOtp}
							className="py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
						>
							Verify OTP
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default ReviewPage;
