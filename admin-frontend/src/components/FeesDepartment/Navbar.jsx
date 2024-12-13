import React, { useState, useRef, useEffect } from "react";
import API_ENDPOINTS from "../../API/apiEndpoints";
import { Icon } from "@iconify/react";
import ProfileDropDown from "../main/ProfileDropDown";
import FloatingInput from "../Forms/FloatingInput";
import axios from "axios";

const Navbar = ({ logout, userData, toggleSidebar }) => {
	const [formData, setFormData] = useState({
		name: "",
		role: "",
		email: "",
		password: "",
		schoolName: "",
	});

	const [isFormVisible, setIsFormVisible] = useState(false);
	const formRef = useRef(null);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(API_ENDPOINTS.CREATE_ADMIN, formData);
			console.log(response.data);
		} catch (error) {
			console.error("Error submitting form:", error);
		}
	};

	const toggleFormVisibility = () => {
		setIsFormVisible(!isFormVisible);
		if (!isFormVisible) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
	};

	const handleClickOutside = (event) => {
		if (formRef.current && !formRef.current.contains(event.target)) {
			setIsFormVisible(false);
			document.body.style.overflow = "auto";
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		if (isFormVisible) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
	}, [isFormVisible]);

	return (
		<section className="flex items-center justify-between mt-0 mb-4 mx-0 p-2 glassmorphism w-full relative z-10">
			<div className="bg-linear-black p-2 rounded-full block lg:hidden">
				<Icon icon="mdi:hamburger-close" height={24} onClick={toggleSidebar} />
			</div>

			<div className="flex items-center w-full justify-end">
				<div className="flex items-center justify-center">
					<ProfileDropDown
						logout={logout}
						userData={userData}
						toggleForm={toggleFormVisibility}
					/>
				</div>
			</div>
			{isFormVisible && (
				<div className="absolute glassmorphism-dark w-screen h-screen top-0 right-0 z-[999999999] flex justify-center items-center">
					<div ref={formRef} className="w-fit bg-white p-8 rounded-xl">
						<h3 className="text-center text-4xl mb-12 font-semibold">
							Create user form:
						</h3>
						<form onSubmit={handleSubmit}>
							<FloatingInput
								type="text"
								id="name"
								formTitle="Name"
								value={formData.name}
								handleChange={handleChange}
								formName="name"
								xtraClass="w-fit"
							/>
							<FloatingInput
								type="text"
								id="role"
								formTitle="Role"
								value={formData.role}
								handleChange={handleChange}
								formName="role"
								xtraClass="w-fit"
							/>
							<FloatingInput
								type="email"
								id="email"
								formTitle="Email"
								value={formData.email}
								handleChange={handleChange}
								formName="email"
								xtraClass="w-fit"
							/>
							<FloatingInput
								type="password"
								id="password"
								formTitle="Password"
								value={formData.password}
								handleChange={handleChange}
								formName="password"
								xtraClass="w-fit"
							/>
							<FloatingInput
								type="text"
								id="schoolName"
								formTitle="School Name"
								value={formData.schoolName}
								handleChange={handleChange}
								formName="schoolName"
								xtraClass="w-fit"
							/>
							<button
								type="submit"
								className="mt-4 p-2 bg-linear-blue text-white rounded-lg bg-linear-blue w-full"
							>
								Submit
							</button>
						</form>
					</div>
				</div>
			)}
		</section>
	);
};

export default Navbar;
