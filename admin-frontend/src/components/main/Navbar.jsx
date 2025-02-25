import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import ProfileDropDown from "./ProfileDropDown";
import FloatingInput from "../Forms/FloatingInput";
import API_ENDPOINTS from "../../API/apiEndpoints";

const Navbar = ({ logout, userData, toggleSidebar, setUserData }) => {
	const [formData, setFormData] = useState({
		name: "",
		role: "",
		email: "",
		password: "",
		schoolName: "",
	});

	const [isFormVisible, setIsFormVisible] = useState(false);
	const [hasPendingRequests, setHasPendingRequests] = useState(false);
	const [pendingRequests, setPendingRequests] = useState([]);
	const [isNotificationOpen, setIsNotificationOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const formRef = useRef(null);
	const notificationRef = useRef(null);
	const scriptRef = useRef(false);

	// Google Translate setup
	useEffect(() => {
		const addGoogleTranslateScript = () => {
			if (!scriptRef.current) {
				const script = document.createElement("script");
				script.type = "text/javascript";
				script.src =
					"https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
				script.async = true;
				document.body.appendChild(script);
				scriptRef.current = true;
			}
		};

		window.googleTranslateElementInit = () => {
			new window.google.translate.TranslateElement(
				{
					pageLanguage: "en",
					includedLanguages: "en,hi",
				},
				"google_translate_element"
			);

			const style = document.createElement("style");
			style.innerHTML = `
        #google_translate_element .goog-logo-link {
          display: none !important;
        }
        #google_translate_element .goog-logo {
          display: none !important;
        }
        #goog-te-banner-frame {
          display: none !important;
        }
      `;
			document.head.appendChild(style);
		};

		addGoogleTranslateScript();
	}, []);

	// Fetch pending leaves
	// const fetchPendingLeaves = async () => {
	// 	try {
	// 		setIsLoading(true);
	// 		const response = await fetch(API_ENDPOINTS.FETCH_ALL_PENDING_LEAVES, {
	// 			method: "GET",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 				Authorization: `Bearer ${localStorage.getItem("token")}`,
	// 			},
	// 		});

	// 		if (!response.ok) {
	// 			throw new Error("Failed to fetch pending leaves");
	// 		}

	// 		const data = await response.json();
	// 		console.log("API Response:", data); // Debug line

	// 		if (data.success && Array.isArray(data.leaves)) {
	// 			const formattedRequests = data.leaves.map((leave) => ({
	// 				id: leave.teacherId,
	// 				teacherId: leave.teacherId,
	// 				name: leave.name,
	// 				reason: leave.reason,
	// 				startDate: new Date(leave.dateFrom).toLocaleDateString(),
	// 				endDate: new Date(leave.dateTo).toLocaleDateString(),
	// 				status: leave.status,
	// 				applyDate: new Date(leave.applyDate).toLocaleDateString(),
	// 				noOfDays: leave.noOfDays,
	// 			}));

	// 			setPendingRequests(formattedRequests);
	// 			setHasPendingRequests(formattedRequests.length > 0);
	// 		}
	// 	} catch (error) {
	// 		console.error("Error fetching leaves:", error);
	// 	} finally {
	// 		setIsLoading(false);
	// 	}
	// };

	// Set up polling for leaves
	// useEffect(() => {
	// 	//fetchPendingLeaves();
	// 	const interval = setInterval(fetchPendingLeaves, 30000);
	// 	return () => clearInterval(interval);
	// }, []);

	// Handle click outside notification
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				notificationRef.current &&
				!notificationRef.current.contains(event.target)
			) {
				setIsNotificationOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<section className="flex items-center justify-between mt-0 mb-4 mx-0 p-2 glassmorphism w-full relative z-10">
			<div className="bg-linear-black p-2 rounded-full block sm:hidden">
				<Icon icon="mdi:hamburger-close" height={24} onClick={toggleSidebar} />
			</div>

			<div className="flex items-center w-full justify-end">
				{/* Google Translate Element */}
				<div className="dropdown relative h-full hidden md:block">
					<div
						id="google_translate_element"
						className="absolute"
						style={{
							top: "-24px",
							visibility: "visible",
							right: "0px",
							padding: "0px 4px",
							height: "48px",
							overflowY: "hidden",
						}}
					></div>
				</div>

				{/* Notification Button */}
				<div className="relative mr-4">
					<button
						ref={notificationRef}
						className="relative rounded-full border bg-white p-2 h-10 w-10 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
						onClick={() => setIsNotificationOpen(!isNotificationOpen)}
					>
						<Icon
							icon="zondicons:notification"
							className="text-gray-600"
							height={24}
						/>
						{hasPendingRequests && (
							<span className="absolute top-0 right-0 inline-block w-2.5 h-2.5 bg-red-600 rounded-full"></span>
						)}
					</button>

					{/* Notification Dropdown */}
					{isNotificationOpen && (
						<div className="absolute right-0 top-12 w-96 mt-2 bg-white rounded-md shadow-lg z-50 border border-gray-200">
							<div className="p-3 border-b border-gray-200 bg-gray-50">
								<h6 className="text-sm font-semibold text-gray-700">
									Leave Requests
								</h6>
							</div>
							<ul className="py-1 max-h-96 overflow-y-auto">
								{pendingRequests.length > 0 ? (
									pendingRequests.map((request) => (
										<li
											key={request.id}
											className="px-4 py-3 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-0"
										>
											<div className="flex items-start">
												<div className="w-10 h-10 rounded-full mr-3 bg-blue-100 flex items-center justify-center flex-shrink-0">
													<Icon
														icon="mdi:calendar-clock"
														className="text-blue-600"
														height={20}
													/>
												</div>
												<div>
													<div className="flex justify-between items-start">
														<h5 className="font-semibold text-gray-800">
															{request.name}
														</h5>
														<span className="text-xs text-gray-500">
															Applied: {request.applyDate}
														</span>
													</div>
													<p className="text-sm text-gray-600 mt-1">
														{request.reason}
													</p>
													<p className="text-xs text-gray-500 mt-1">
														Duration: {request.startDate} to {request.endDate} (
														{request.noOfDays} days)
													</p>
													<div className="mt-2 flex gap-2">
														<button
															onClick={() =>
																handleLeaveAction(request.teacherId, "approve")
															}
															className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 hover:bg-green-200"
														>
															Approve
														</button>
														<button
															onClick={() =>
																handleLeaveAction(request.teacherId, "reject")
															}
															className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 hover:bg-red-200"
														>
															Reject
														</button>
													</div>
												</div>
											</div>
										</li>
									))
								) : (
									<li className="px-4 py-6 text-sm text-gray-700 text-center">
										{isLoading ? (
											<div className="flex items-center justify-center">
												<Icon
													icon="mdi:loading"
													className="animate-spin mr-2"
													height={20}
												/>
												Loading requests...
											</div>
										) : (
											"No pending requests"
										)}
									</li>
								)}
							</ul>
						</div>
					)}
				</div>

				{/* Profile Dropdown */}
				<ProfileDropDown
					logout={logout}
					userData={userData}
					toggleForm={() => setIsFormVisible(!isFormVisible)}
					setUserData={setUserData}
				/>
			</div>

			{/* Form Modal */}
			{isFormVisible && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999999999]">
					<div
						ref={formRef}
						className="bg-white p-8 rounded-xl w-full max-w-md"
					>
						<h3 className="text-center text-3xl mb-8 font-semibold text-gray-800">
							Create User
						</h3>
						<form onSubmit={handleSubmit} className="space-y-4">
							<FloatingInput
								type="text"
								id="name"
								formTitle="Name"
								value={formData.name}
								handleChange={handleChange}
								formName="name"
								xtraClass="w-full"
							/>
							<FloatingInput
								type="text"
								id="role"
								formTitle="Role"
								value={formData.role}
								handleChange={handleChange}
								formName="role"
								xtraClass="w-full"
							/>
							<FloatingInput
								type="email"
								id="email"
								formTitle="Email"
								value={formData.email}
								handleChange={handleChange}
								formName="email"
								xtraClass="w-full"
							/>
							<FloatingInput
								type="password"
								id="password"
								formTitle="Password"
								value={formData.password}
								handleChange={handleChange}
								formName="password"
								xtraClass="w-full"
							/>
							<FloatingInput
								type="text"
								id="schoolName"
								formTitle="School Name"
								value={formData.schoolName}
								handleChange={handleChange}
								formName="schoolName"
								xtraClass="w-full"
							/>
							<button
								type="submit"
								className="mt-6 p-3 bg-sky-500 text-white rounded-lg w-full hover:bg-sky-600 transition-colors duration-200 font-medium"
							>
								Create User
							</button>
						</form>
					</div>
				</div>
			)}
		</section>
	);
};

export default Navbar;
