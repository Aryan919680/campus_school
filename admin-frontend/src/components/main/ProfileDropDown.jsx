import React, { useState, useEffect, useRef } from "react";
import AdminProfileModal from "./AdminProfileModal";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
const ProfileDropDown = ({ logout, userData, setUserData }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
	const dropdownRef = useRef(null);
	const [adminData, setAdminData] = useState(null);
	const defaultPhoto =
		"https://res.cloudinary.com/duyau9qkl/image/upload/v1717910208/images/w7y88n61dxedxzewwzpn.png";

	const toggleDropdown = () => setIsOpen(!isOpen);

	const handleClickOutside = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		if (isOpen) {
			fetchAdminData();
		}
	}, [isOpen]);

	const fetchAdminData = async () => {
		//setLoading(true);
		try {
			const response = await axios.get(API_ENDPOINTS.ADMIN_PROFILE());
			setAdminData(response.data.data);
		} catch (err) {
			console.error("Failed to fetch admin profile:", err);
			setError("Something went wrong");
		}
	};
	const handleProfileClick = () => {
		setIsProfileModalOpen(true);
		setIsOpen(false);
	};

	const handleSaveProfile = (updatedProfile) => {
		setUserData(updatedProfile);
		localStorage.setItem("userData", JSON.stringify(updatedProfile));
	};

	return (
		<>
			<div ref={dropdownRef} className="hs-dropdown relative inline-flex">
				<button
					id="hs-dropdown-custom-trigger"
					type="button"
					className="hs-dropdown-toggle py-1 ps-1 pe-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
					onClick={toggleDropdown}
				>
					<img
						className="w-8 h-auto rounded-full"
						src={userData.photo || defaultPhoto}
						alt={userData?.name || "User"}
					/>
					<span className="text-gray-600 font-medium truncate max-w-[7.5rem]">
						{userData?.name || "User"}
					</span>
					<svg
						className={`hs-dropdown-open:rotate-180 size-4 transition-transform ${
							isOpen ? "rotate-180" : ""
						}`}
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="m6 9 6 6 6-6" />
					</svg>
				</button>

				<div
					className={`hs-dropdown-menu absolute top-10 right-0 transition-[opacity,margin] duration ${
						isOpen
							? "hs-dropdown-open:opacity-100 opacity-100"
							: "opacity-0 hidden"
					} min-w-60 bg-linear-black shadow-md rounded-lg p-2 mt-2`}
					aria-labelledby="hs-dropdown-custom-trigger"
				>
					<button
						className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-white hover:bg-linear-blue focus:outline-none focus:bg-linear-blue"
						onClick={handleProfileClick}
					>
						Profile
					</button>
					<button
						className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-white hover:bg-linear-blue focus:outline-none focus:bg-linear-blue w-full"
						onClick={logout}
					>
						Sign Out
					</button>
				</div>
			</div>
			{isProfileModalOpen && (
				<AdminProfileModal
					isOpen={isProfileModalOpen}
					onClose={() => setIsProfileModalOpen(false)}
					adminData={adminData}
					onSave={handleSaveProfile}
				/>
			)}
		</>
	);
};

export default ProfileDropDown;
