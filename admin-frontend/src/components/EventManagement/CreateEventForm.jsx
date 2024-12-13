import React, { useState } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";

const CreateEventForm = ({ onClose, onAddEvent }) => {
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		date: "",
		photo: "",
	});

	const [photoLoading, setPhotoLoading] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handlePhotoUpload = async (e) => {
		setPhotoLoading(true);
		const file = e.target.files[0];
		const photoFormData = new FormData();
		photoFormData.append("file", file);
		photoFormData.append(
			"upload_preset",
			import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
		);

		try {
			const response = await axios.post(
				`https://api.cloudinary.com/v1_1/${
					import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
				}/image/upload`,
				photoFormData
			);
			console.log("Cloudinary response:", response.data);
			setFormData((prevData) => ({
				...prevData,
				photo: response.data.secure_url,
			}));
			console.log("Form data after photo upload:", {
				...formData,
				photo: response.data.secure_url,
			});
		} catch (error) {
			console.error(
				"Error uploading photo:",
				error.response?.data || error.message
			);
		} finally {
			setPhotoLoading(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.title || !formData.description || !formData.date) {
			alert("Please fill out all fields.");
			return;
		}

		const formattedDate = new Date(formData.date).toISOString();

		// Safely parse and access userData from localStorage
		let campusId = null;
		try {
			const userData = JSON.parse(localStorage.getItem("userData"));
			campusId = userData?.id; // Assuming id is the campusId
		} catch (error) {
			console.error("Error parsing user data from localStorage:", error);
			alert("There was an error accessing your user data.");
			return;
		}

		if (!campusId) {
			alert("User data not found. Please check your login status.");
			return;
		}

		// Log the form data before submitting
		console.log("Form data being submitted:", {
			title: formData.title,
			description: formData.description,
			date: formattedDate,
			photo: formData.photo,
			campusId: campusId,
		});

		try {
			const response = await axios.post(API_ENDPOINTS.CREATE_EVENT, {
				title: formData.title,
				description: formData.description,
				date: formattedDate,
				photo: formData.photo,
				campusId: campusId,
			});
			const newEvent = response.data.data; // Assuming the API response contains the new event data
			onAddEvent(newEvent);
			console.log("Event created successfully:", response.data);
		} catch (error) {
			console.error("Error creating event:", error);
			if (error.response) {
				console.error("Error response data:", error.response.data);
				console.error("Error response status:", error.response.status);
				console.error("Error response headers:", error.response.headers);
			} else if (error.request) {
				console.error("Error request data:", error.request);
			} else {
				console.error("Error message:", error.message);
			}
		}
	};

	return (
		<div className="w-full h-full">
			<form onSubmit={handleSubmit} className="text-black">
				<div className="flex flex-col my-2">
					<label className="text-white">Event Name</label>
					<input
						name="title"
						className="my-2 rounded-lg p-4"
						type="text"
						placeholder="e.g., Annual function, football match"
						value={formData.title}
						onChange={handleChange}
					/>
				</div>
				<div className="flex flex-col my-2">
					<label className="text-white">Event Date</label>
					<input
						name="date"
						className="my-2 rounded-lg p-4"
						type="date"
						value={formData.date}
						onChange={handleChange}
					/>
				</div>
				<div className="flex flex-col my-2">
					<label className="text-white">Event Details</label>
					<textarea
						name="description"
						className="my-2 rounded-lg p-4"
						rows="4"
						cols="50"
						placeholder="Let everyone know why you're collecting money, and what you'll do with it. This is your chance to tell your story."
						value={formData.description}
						onChange={handleChange}
					/>
				</div>
				<div className="flex flex-col my-2">
					<label className="text-white">Event Photo</label>
					<input
						type="file"
						accept="image/*"
						onChange={handlePhotoUpload}
						disabled={photoLoading}
					/>
					{photoLoading && <p>Uploading...</p>}
					{formData.photo && (
						<div className="flex-1 mt-2">
							<p>Photo Preview:</p>
							<img src={formData.photo} alt="Event Photo" width="100" />
						</div>
					)}
				</div>
				<div className="flex justify-end items-center">
					<button
						className="px-4 py-2 me-4 text-white border-red-500 border-2 rounded-lg"
						type="button"
						onClick={onClose}
					>
						Cancel
					</button>
					<button
						className="px-4 py-2 ms-4 text-white bg-linear-blue rounded-lg"
						type="submit"
					>
						Submit
					</button>
				</div>
			</form>
		</div>
	);
};

export default CreateEventForm;
