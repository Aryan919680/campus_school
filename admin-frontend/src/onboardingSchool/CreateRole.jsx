import React, { useState, useEffect } from "react";
import axios from "axios";

import API_ENDPOINTS from "../API/apiEndpoints";

const CreateRole = ({ onPrevious, onSubmit }) => {
    const [roleData, setRoleData] = useState({
        email: localStorage.getItem("adminEmail") || "",
        branchId: Number(localStorage.getItem("branchId")) || "",
        role: "admin",
        photo: null,
    });
    const [isValid, setIsValid] = useState(false);
    const [password, setPassword] = useState(localStorage.getItem("adminPassword") || "");
    const [selectedOption, setSelectedOption] = useState(localStorage.getItem("selectedOption") || "");
    // const [photoPreview, setPhotoPreview] = useState(localStorage.getItem("adminPhoto") || "");

    const options = [
        { value: "director", label: "Director" },
        { value: "manager", label: "Manager" },
        { value: "principal", label: "Principal" }
    ];

    const handleSelect = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoleData((prevData) => ({ ...prevData, [name]: value }));
    };

    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     setRoleData((prevData) => ({ ...prevData, photo: file }));

    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //         setPhotoPreview(reader.result);
    //     };
    //     reader.readAsDataURL(file);
    // };

    const validatePassword = (value) => {
        const conditions = {
            hasUpperCase: /[A-Z]/.test(value),
            hasLowerCase: /[a-z]/.test(value),
            hasNumber: /\d/.test(value),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
            isLongEnough: value.length > 8,
        };

        const allValid = Object.values(conditions).every(Boolean);
        setIsValid(allValid);
        return allValid;
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        validatePassword(value);
    };
    const handleNext =  () => {
        // try {
        //     let photoUrl = localStorage.getItem("adminPhoto");

        //     if (roleData.photo) {
        //         const formData = new FormData();
        //         formData.append("file", roleData.photo);
        //         formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

        //         const uploadResponse =  axios.post(
        //             `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        //             formData
        //         );

        //         photoUrl = uploadResponse.data.secure_url;
        //         localStorage.setItem("adminPhoto", photoUrl);
        //     }

            localStorage.setItem("adminEmail", roleData.email);
            localStorage.setItem("adminRole", roleData.role);
            localStorage.setItem("adminPassword", password);

			const schoolData = {
				name: localStorage.getItem("schoolName") || "",
				type: "SCHOOL",
				location: localStorage.getItem("schoolLocation") || "",
				campus_details: {
					school: {
						board: localStorage.getItem("selectedOptionBoard") || "",
						code: localStorage.getItem("schoolCode") || "",
						address: localStorage.getItem("schoolLocation") || "",
						branch_name: localStorage.getItem("schoolBranchName") || "",
						director: localStorage.getItem("schoolDirectorName") || "",
						year: Number(localStorage.getItem("schoolFoundedYear")) || 0,
					}
				},
				admin: {
					role: "admin",
					email: localStorage.getItem("adminEmail"),
					password: password,
					name : ""
				}
			};
            handleSubmit(schoolData);
        // } catch (error) {
        //     console.error("Error uploading photo:", error);
        // }
    };

    const handleSubmit = async (schoolData) => {
      

        try {
            const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
            };

            const schoolResponse = await axios.post(
                API_ENDPOINTS.CREATE_CAMPUS,
                schoolData,
                { headers }
            );

            if (schoolResponse) {
                const schoolId = schoolResponse.data.data.id;
                localStorage.setItem("schoolId", schoolId);
                localStorage.setItem("otpVerified", "true");
                onSubmit();
            }
        } catch (error) {
            console.error("Error details:", error.response?.data || error.message);
            alert(`Submission failed: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <form>
            <h2 className="text-2xl font-semibold mb-6 text-center">Create Admin Account</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                    <select value={selectedOption} onChange={handleSelect} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                        <option value="" disabled>-- Select an option --</option>
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input id="email" name="email" type="email" value={roleData.email} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input id="password" name="password" type="password" value={password} onChange={handlePasswordChange} className={`mt-1 block w-full border rounded-md p-2 ${isValid ? "text-green-500 border-green-500" : "text-red-500 border-red-500"}`} required />
                </div>
            </div>
            <div className="flex justify-between mt-8">
                <button type="button" onClick={onPrevious} className="py-2 px-4 bg-gray-600 text-white rounded-md">Previous</button>
                <button type="button" onClick={handleNext} className="py-2 px-4 bg-green-600 text-white rounded-md">Submit</button>
            </div>
        </form>
    );
};

export default CreateRole;
