import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../popup/Modal";
import ModalDetails from "../popup/ModalDetails";
import API_ENDPOINTS from "../../API/apiEndpoints";

const AdminProfileModal = ({ isOpen, onClose, adminData, onSave }) => {
	const [state, setState] = useState({
		isEditing: false,
		editedProfile: adminData || {},
		photoLoading: false,
	});

	const defaultPhoto =
		"https://res.cloudinary.com/duyau9qkl/image/upload/v1717910208/images/w7y88n61dxedxzewwzpn.png";

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
			fetchAdminDetails();
		} else {
			document.body.style.overflow = "auto";
		}
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [isOpen]);

	const fetchAdminDetails = async () => {
		const userId = getUserIdFromLocalStorage();
		try {
			const response = await axios.get(API_ENDPOINTS.ADMIN_PROFILE());
			setState((prevState) => ({ ...prevState, editedProfile: response.data }));
			console.log(state)
		} catch (error) {
			console.error("Error fetching admin details:", error);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setState((prevState) => ({
			...prevState,
			editedProfile: {
				...prevState.editedProfile,
				[name]: value,
			},
		}));
	};

	const handlePhotoChange = async (e) => {
		const file = e.target.files[0];
		if (file) {
			const formData = new FormData();
			formData.append("file", file);
			formData.append(
				"upload_preset",
				import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
			);
			formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

			setState((prevState) => ({ ...prevState, photoLoading: true }));
			try {
				const response = await axios.post(
					`https://api.cloudinary.com/v1_1/${
						import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
					}/image/upload`,
					formData
				);
				setState((prevState) => ({
					...prevState,
					editedProfile: {
						...prevState.editedProfile,
						photo: response.data.secure_url,
					},
					photoLoading: false,
				}));
			} catch (error) {
				console.error("Error uploading photo:", error);
				setState((prevState) => ({ ...prevState, photoLoading: false }));
			}
		}
	};

	const handleRemovePhoto = () => {
		setState((prevState) => ({
			...prevState,
			editedProfile: {
				...prevState.editedProfile,
				photo: "",
			},
		}));
	};

	const handleSave = async () => {
		const userId = getUserIdFromLocalStorage();
		try {
			const response = await fetch(API_ENDPOINTS.UPDATE_ADMIN(userId), {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(state.editedProfile),
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(`Network response was not ok: ${errorData.message}`);
			}
			onSave(state.editedProfile);
			localStorage.setItem("userData", JSON.stringify(state.editedProfile));
			setState((prevState) => ({ ...prevState, isEditing: false }));
			onClose();
		} catch (error) {
			console.error("Error updating admin:", error);
		}
	};

	const getUserIdFromLocalStorage = () => {
		const userData = JSON.parse(localStorage.getItem("userData"));
		return userData && userData.id ? userData.id : null;
	};

	return (
		<Modal
			modalOpen={isOpen}
			setModalOpen={onClose}
			responsiveWidth={"md:w-fit"}
		>
			<div className="flex">
				<div className="mx-4">
					<img
						src={state.editedProfile.photo || defaultPhoto}
						alt={state.editedProfile.data.name}
						className="w-32 h-32 mx-auto rounded-full"
					/>
					<h3 className="text-xl font-semibold my-4">
						{state.editedProfile.data.name}
					</h3>
					{state.isEditing && (
						<div className="my-2">
							<label
								className="block text-gray-700 text-sm font-bold mb-2"
								htmlFor="photo"
							>
								Profile Photo:
							</label>
							<input
								type="file"
								name="photo"
								onChange={handlePhotoChange}
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								disabled={state.photoLoading}
							/>
							{state.photoLoading && <p>Uploading...</p>}
							<button
								onClick={handleRemovePhoto}
								className="bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
							>
								Remove Photo
							</button>
						</div>
					)}
				</div>
				<div className="mx-4">
					{state.isEditing ? (
						<>
							<div className="my-2">
								<label
									className="block text-gray-700 text-sm font-bold mb-2"
									htmlFor="name"
								>
									Name:
								</label>
								<input
									type="text"
									name="name"
									value={state.editedProfile.data.name || ""}
									onChange={handleChange}
									className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								/>
							</div>
							<div className="my-2">
								<label
									className="block text-gray-700 text-sm font-bold mb-2"
									htmlFor="role"
								>
									Role:
								</label>
								<input
									type="text"
									name="role"
									value={state.editedProfile.data.role || ""}
									onChange={handleChange}
									className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								/>
							</div>
							<div className="my-2">
								<label
									className="block text-gray-700 text-sm font-bold mb-2"
									htmlFor="email"
								>
									Email:
								</label>
								<input
									type="email"
									name="email"
									value={state.editedProfile.data.email || ""}
									onChange={handleChange}
									className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								/>
							</div>
							<button
								onClick={handleSave}
								className="bg-linear-green text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							>
								Save
							</button>
						</>
					) : (
						<>
							<ModalDetails
								modalTitle={"Name : "}
								modalDesc={state.editedProfile.data.name}
							/>
							{/* <ModalDetails
								modalTitle={"Role : "}
								modalDesc={state.editedProfile.data.role}
							/> */}
							<ModalDetails
								modalTitle={"Email : "}
								modalDesc={state.editedProfile.data.email}
							/>
							{/* <button
								onClick={() =>
									setState((prevState) => ({ ...prevState, isEditing: true }))
								}
								className="bg-linear-blue hover:bg-linear-blue text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							>
								Edit
							</button> */}
						</>
					)}
				</div>
			</div>
		</Modal>
	);
};

export default AdminProfileModal;
