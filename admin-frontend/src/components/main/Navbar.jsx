import React, { useState, useRef, useEffect } from "react";
import API_ENDPOINTS from "../../API/apiEndpoints";
import { Icon } from "@iconify/react";
import ProfileDropDown from "./ProfileDropDown";
import FloatingInput from "../Forms/FloatingInput";
import axios from "axios";

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
	const [teacherPhotos, setTeacherPhotos] = useState({});
	const [isNotificationOpen, setIsNotificationOpen] = useState(false);
	const formRef = useRef(null);
	const notificationRef = useRef(null);
	const scriptRef = useRef(false);

	useEffect(() => {
		const addGoogleTranslateScript = () => {
			if (!scriptRef.current) {
				const script = document.createElement("script");
				script.type = "text/javascript";
				script.src =
					"https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
				script.async = true;
				document.body.appendChild(script);
				scriptRef.current = true; // Mark script as added
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

			// Apply styles to hide branding
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
				#goog-te-banner-frame {
					display: none !important;
				}
			`;
			document.head.appendChild(style);
		};

		addGoogleTranslateScript();
	}, []);

	// Your existing functions (handleChange, handleSubmit, etc.) remain unchanged

	return (
		<section className="flex items-center justify-between mt-0 mb-4 mx-0 p-2 glassmorphism w-full relative z-10">
			<div className="bg-linear-black p-2 rounded-full block lg:hidden">
				<Icon icon="mdi:hamburger-close" height={24} onClick={toggleSidebar} />
			</div>

			<div className="flex items-center w-full justify-end">
				{/* Updated Google Translate Element */}
				<div className="dropdown relative h-full">
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
						<div className="absolute right-0 top-12 w-80 mt-2 bg-white rounded-md shadow-lg z-50 border border-gray-200">
							<ul className="py-1 max-h-96 overflow-y-auto">
								{pendingRequests.length > 0 ? (
									pendingRequests.map((request, index) => (
										<li
											key={index}
											className="px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
										>
											<div className="flex items-center">
												{teacherPhotos[request.teacherId] ? (
													<img
														src={teacherPhotos[request.teacherId]}
														alt={request.name}
														className="w-10 h-10 rounded-full mr-3 object-cover"
													/>
												) : (
													<div className="w-10 h-10 rounded-full mr-3 bg-gray-200 flex items-center justify-center">
														<Icon
															icon="mdi:user"
															className="text-gray-500"
															height={24}
														/>
													</div>
												)}
												<div>
													<h5 className="font-semibold text-gray-800">
														{request.name}
													</h5>
													<p className="text-sm text-gray-600">
														{request.reason}
													</p>
												</div>
											</div>
										</li>
									))
								) : (
									<li className="px-4 py-3 text-sm text-gray-700">
										No pending requests
									</li>
								)}
							</ul>
						</div>
					)}
				</div>

				{/* Profile Dropdown */}
				<div className="flex items-center justify-center">
					<ProfileDropDown
						logout={logout}
						userData={userData}
						toggleForm={() => setIsFormVisible(!isFormVisible)}
						setUserData={setUserData}
					/>
				</div>
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
