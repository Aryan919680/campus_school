import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateCampus = ({ onNext }) => {
	const [campusData, setCampusData] = useState({
		campusName: localStorage.getItem("campusName") || "",
		location: localStorage.getItem("campusLocation") || "",
		directorName : localStorage.getItem("directorName") || "",
		foundedYear: localStorage.getItem("campusFoundedYear") || "",
		logo: localStorage.getItem("campusLogo") || "",
	});
	const [logoPreview, setLogoPreview] = useState(
		localStorage.getItem("campusLogo") || null
	);
	const [uploading, setUploading] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setCampusData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleFileChange = async (e) => {
		const file = e.target.files[0];
		if (file) {
			setUploading(true);
			const reader = new FileReader();
			reader.onloadend = () => {
				setLogoPreview(reader.result);
			};
			reader.readAsDataURL(file);

			try {
				const formData = new FormData();
				formData.append("file", file);
				formData.append(
					"upload_preset",
					import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
				);

				const uploadResponse = await axios.post(
					`https://api.cloudinary.com/v1_1/${
						import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
					}/image/upload`,
					formData
				);

				const logoUrl = uploadResponse.data.secure_url;
				setCampusData((prevData) => ({ ...prevData, logo: logoUrl }));
				localStorage.setItem("campusLogo", logoUrl);
			} catch (error) {
				console.error("Error uploading logo:", error);
			} finally {
				setUploading(false);
			}
		}
	};

	const handleNext = () => {
		localStorage.setItem("campusName", campusData.campusName);
		localStorage.setItem("campusLocation", campusData.location);
		localStorage.setItem("campusFoundedYear", campusData.foundedYear);
        localStorage.setItem("directorName", campusData.directorName);
		onNext();
	};

	return (
		<form>
			<h2 className="text-2xl font-semibold mb-4">Create Campus</h2>

			<div>
				<label
					htmlFor="campusName"
					className="block text-sm font-medium text-gray-700"
				>
					College Name
				</label>
				<input
					id="campusName"
					name="campusName"
					type="text"
					value={campusData.campusName}
					onChange={handleChange}
					className="mt-1 block w-full border border-gray-300 rounded-md p-2"
				/>
			</div>

			<div>
				<label
					htmlFor="location"
					className="block text-sm font-medium text-gray-700"
				>
					Address
				</label>
				<input
					id="location"
					name="location"
					type="text"
					value={campusData.location}
					onChange={handleChange}
					className="mt-1 block w-full border border-gray-300 rounded-md p-2"
				/>
			</div>

			<div>
				<label
					htmlFor="foundedYear"
					className="block text-sm font-medium text-gray-700"
				>
					Founded Year
				</label>
				<input
					id="foundedYear"
					name="foundedYear"
					type="number"
					value={campusData.foundedYear}
					onChange={handleChange}
					className="mt-1 block w-full border border-gray-300 rounded-md p-2"
				/>
			</div>

			<div>
				<label
					htmlFor="foundedYear"
					className="block text-sm font-medium text-gray-700"
				>
					Director Name
				</label>
				<input
					id="directorName"
					name="directorName"
					type="name"
					value={campusData.directorName}
					onChange={handleChange}
					className="mt-1 block w-full border border-gray-300 rounded-md p-2"
				/>
			</div>

			<div className="mt-4">
				<label className="block text-sm font-medium text-gray-700">
					Campus Logo
				</label>
				<input
					type="file"
					onChange={handleFileChange}
					className="mt-1 block w-full border border-gray-300 rounded-md p-2"
				/>
				{logoPreview && (
					<img
						src={logoPreview}
						alt="Logo Preview"
						className="mt-4 w-24 h-24"
					/>
				)}
			</div>

			<button
				type="button"
				onClick={handleNext}
				disabled={uploading}
				className="mt-4 w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
			>
				Next
			</button>
		</form>
	);
};

export default CreateCampus;
