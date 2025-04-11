import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";
import NavItems from "./NavItems";
import API_ENDPOINTS from "../../API/apiEndpoints";

const Navigation = ({ isSidebarExpanded, toggleSidebar }) => {
	const [schoolName, setSchoolName] = useState("");
	const [campusLogo, setCampusLogo] = useState("");
	const [campusId, setCampusId] = useState(null);
	const [campusType,setCampusType] = useState();
	const [campusDetails, setCampusDetails] = useState({
		id: null,
		name: "",
		logo: "",
		location: "",
		foundedYear: null,
	});

	useEffect(() => {
		// Fetch userData from localStorage
		const storedUserData = window.localStorage.getItem("userData");
		if (storedUserData) {
			const userData = JSON.parse(storedUserData);
			setSchoolName(userData.schoolName);
			setCampusId(userData.data.campusId);
            setCampusType(userData.data.campusType)
			// Fetch campus details by campusId
			if (userData.campusId) {
				fetchCampusDetails(userData.campusId);
			}
		}

		// Save sidebar state to localStorage
		window.localStorage.setItem(
			"isSidebarExpanded",
			JSON.stringify(isSidebarExpanded)
		);
	}, [isSidebarExpanded]);

	const fetchCampusDetails = (campusId) => {
		const url = API_ENDPOINTS.FECTH_CAMPUS_BY_ID(campusId);
		console.log("Fetching from URL:", url); // Log the URL to verify it
		fetch(url)
			.then((response) => {
				if (!response.ok) {
					throw new Error(
						`Failed to fetch campus details: ${response.statusText}`
					);
				}
				return response.json();
			})
			.then((data) => {
				console.log("Fetched Campus Data:", data);
				if (data.data) {
					setCampusDetails(data.data);
					setCampusLogo(data.data.logo);
				} else {
					console.error("Invalid data received:", data);
				}
			})
			.catch((error) => {
				console.error("Error fetching campus details:", error);
			});
	};

	const handleLogoClick = () => {
		document.getElementById("fileInput").click();
	};

	const handleFileChange = async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("file", file);
		formData.append(
			"upload_preset",
			import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
		);
		formData.append("api_key", import.meta.env.VITE_API_KEY);
		formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

		try {
			const response = await axios.post(
				`https://api.cloudinary.com/v1_1/${
					import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
				}/image/upload`,
				formData
			);

			if (response.data.secure_url) {
				const newLogoUrl = response.data.secure_url;
				setCampusLogo(newLogoUrl);
				console.log("Uploaded logo URL:", newLogoUrl);
				updateCampusLogo(newLogoUrl);
			}
		} catch (error) {
			console.error("Error uploading logo:", error);
		}
	};

	const updateCampusLogo = (logoUrl) => {
		if (!campusDetails.id) {
			console.error("Campus ID not available");
			return;
		}

		const requestBody = {
			...campusDetails,
			logo: logoUrl,
		};

		fetch(API_ENDPOINTS.UPDATE_CAMPUS, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Failed to update campus: ${response.statusText}`);
				}
				return response.json();
			})
			.then((data) => {
				console.log("Campus updated successfully:", data);
				// Optionally update the state or perform further actions
			})
			.catch((error) => {
				console.error("Error updating campus:", error);
			});
	};

	return (
		<aside
			className={`fixed top-0 left-0 h-full text-gray-300 bg-linear-black transition-transform duration-200 ease-in-out overflow-hidden z-50 ${
				isSidebarExpanded
					? "translate-x-0"
					: "-translate-x-full sm:translate-x-0"
			} ${isSidebarExpanded ? "w-64" : "w-20"} w-20`}
		>
			<div className="border-b border-gray-700 px-2 py-4 font-medium bg-[#F5F6F8]">
				<div className="flex items-center justify-end px-3 text-white hover:bg-sky-600 hover:bg-opacity-25 rounded-lg transition-colors duration-150 ease-in-out focus:outline-none focus:shadow-outline">
					<button className="flex items-center " onClick={toggleSidebar}>
						{isSidebarExpanded ? (
							<Icon
								icon="mdi:hamburger-open"
								className="h-6 w-6 flex-shrink-0 text-black"
							/>
						) : (
							<Icon
								icon="mdi:hamburger-close"
								className="h-6 w-6 flex-shrink-0 text-black"
							/>
						)}
					</button>
				</div>
				<div className=" duration-100 ease-in-out flex flex-col justify-center mt-4 items-center">
					<div onClick={handleLogoClick} style={{ cursor: "pointer" }}>
						{campusLogo ? (
							<div
								className={` w-fit h-fit flex items-center justify-center rounded-3xl ${
									isSidebarExpanded ? "p-2" : "p-0 "
								}`}
							>
								<img
									src={campusLogo}
									alt="Campus Logo"
									className="h-auto w-full max-w-20  "
									onError={(e) => {
										e.target.onerror = null;
										e.target.src = "fallback-image-url";
									}}
								/>
							</div>
						) : (
							<Icon
								icon="emojione:school"
								className="h-16 w-16 text-gray-400"
							/>
						)}
					</div>
					<input
						type="file"
						id="fileInput"
						accept="image/*"
						style={{ display: "none" }}
						onChange={handleFileChange}
					/>
					<div
						className={`ml-2 duration-100 ease-in-out flex flex-col items-center text-black ${
							isSidebarExpanded ? "my-2" : "hidden"
						}`}
					>
						{schoolName}
					</div>
				</div>
			</div>
			{
				campusType === "SCHOOL" && <nav className="p-4 space-y-2 font-medium h-full flex flex-col mt-4">
				{/* <NavItems
					to="/"
					icon="ic:round-dashboard"
					title="Dashboard"
					isSidebarExpanded={isSidebarExpanded}
				/> */}
				<NavItems
					to="/Classes"
					icon="mingcute:department-fill"
					title="Classes"
					isSidebarExpanded={isSidebarExpanded}
				/>
				
				 <NavItems
					to="/Employees"
					icon="clarity:employee-group-solid"
					title="Employees"
					isSidebarExpanded={isSidebarExpanded}
				/>
					<NavItems
					to="/Role"
						icon="material-symbols:event"
					title="HR functions"
					isSidebarExpanded={isSidebarExpanded}
				/>
				<NavItems
					to="/Students"
					icon="solar:square-academic-cap-bold"
					title="Students"
					isSidebarExpanded={isSidebarExpanded}
				/>
<NavItems
					to="/Attendance"
					icon="fluent:task-list-square-add-24-filled"
					title="Attendance"
					isSidebarExpanded={isSidebarExpanded}
				/>
				<NavItems
					to="/Finance"
					icon="material-symbols:finance-mode-rounded"
					title="Finance"
					isSidebarExpanded={isSidebarExpanded}
				/>
                <NavItems
					to="/Timetable"
					icon="mingcute:calendar-fill"
					title="Timetable"
					isSidebarExpanded={isSidebarExpanded}
				/>

			{/*	<NavItems
					to="/Finance"
					icon="material-symbols:finance-mode-rounded"
					title="Finance"
					isSidebarExpanded={isSidebarExpanded}
				/>
				<NavItems
					to="/Department"
					icon="mingcute:department-fill"
					title="Department"
					isSidebarExpanded={isSidebarExpanded}
				/>
			
				<NavItems
					to="/Event"
					icon="material-symbols:event"
					title="Event Management"
					isSidebarExpanded={isSidebarExpanded}
				/>
				<NavItems
					to="/Support"
					icon="material-symbols:support-agent-rounded"
					title="Support"
					isSidebarExpanded={isSidebarExpanded}
				/> */}
			</nav>
			}
		{	
		campusType === "COLLEGE" &&
			<nav className="p-4 space-y-2 font-medium h-full flex flex-col mt-4">
				{/* <NavItems
					to="/"
					icon="ic:round-dashboard"
					title="Dashboard"
					isSidebarExpanded={isSidebarExpanded}
				/> */}
				<NavItems
					to="/Department"
					icon="mingcute:department-fill"
					title="Department"
					isSidebarExpanded={isSidebarExpanded}
				/>
				
				<NavItems
					to="/Employees"
					icon="clarity:employee-group-solid"
					title="Employees"
					isSidebarExpanded={isSidebarExpanded}
				/>
	<NavItems
					to="/Role"
				icon="material-symbols:event"
					title="HR functions"
					isSidebarExpanded={isSidebarExpanded}
				/>
				 <NavItems
					to="/Students"
					icon="solar:square-academic-cap-bold"
					title="Students"
					isSidebarExpanded={isSidebarExpanded}
				/>
	<NavItems
					to="/Attendance"
					icon="fluent:task-list-square-add-24-filled"
					title="Attendance"
					isSidebarExpanded={isSidebarExpanded}
				/>
				<NavItems
					to="/Finance"
					icon="material-symbols:finance-mode-rounded"
					title="Finance"
					isSidebarExpanded={isSidebarExpanded}
				/>
				     <NavItems
					to="/Timetable"
					icon="mingcute:calendar-fill"
					title="Timetable"
					isSidebarExpanded={isSidebarExpanded}
				/>

			{/*	<NavItems
					to="/Department"
					icon="mingcute:department-fill"
					title="Department"
					isSidebarExpanded={isSidebarExpanded}
				/>
				<NavItems
					to="/Attendance"
					icon="fluent:task-list-square-add-24-filled"
					title="Attendance"
					isSidebarExpanded={isSidebarExpanded}
				/>
				<NavItems
					to="/Event"
					icon="material-symbols:event"
					title="Event Management"
					isSidebarExpanded={isSidebarExpanded}
				/>
				<NavItems
					to="/Support"
					icon="material-symbols:support-agent-rounded"
					title="Support"
					isSidebarExpanded={isSidebarExpanded}
				/> */}
			</nav>}
		</aside>
	);
};

export default Navigation;
