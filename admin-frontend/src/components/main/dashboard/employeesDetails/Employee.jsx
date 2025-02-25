import React, { useState, useEffect, useRef } from "react";
import ListTable from "../../../List/ListTable";
import CommonTable from "../../../List/CommonTable";
import ListTableBtn from "../../../List/ListTableBtn";
import Modal from "../../../popup/Modal";
import ModalDetails from "../../../popup/ModalDetails";
import EmployeeAddForm from "../../../Forms/EmployeeAddForm";
import API_ENDPOINTS from "../../../../API/apiEndpoints";
import axios from "axios";
import { ContentSkeleton } from "../../../Skeleton/ContentSkeleton";
import CreateEmployee from '../../../Employees/CreateEmployee'
const Employee = () => {
	const [teachers, setTeachers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);
	const [formModalOpen, setFormModalOpen] = useState(false);
	const [selectedProfile, setSelectedProfile] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
	const defaultMalePhoto =
		"https://res.cloudinary.com/duyau9qkl/image/upload/v1717910208/images/w7y88n61dxedxzewwzpn.png";
	const defaultFemalePhoto =
		"https://res.cloudinary.com/duyau9qkl/image/upload/v1717910872/images/dxflhaspx3rm1kcak2is.png";

	useEffect(() => {
		fetchTeachers();
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleClickOutside = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setIsDropdownOpen(false);
		}
	};

	const fetchTeachers = async () => {
		try {
			const response = await fetch(API_ENDPOINTS.FETCH_ALL_TEACHERS ,
				{headers: { Authorization: `Bearer ${token}` }}
			);
			if (!response.ok) throw new Error("Network response was not ok");
			const data = await response.json();

			if (Array.isArray(data.data)) {
				setTeachers(data.data);
			} else {
				console.error("Unexpected data format:", data);
			}
		} catch (error) {
			console.error("Error fetching teachers:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleViewProfile = (profile) => {
		setSelectedProfile(profile);
		setModalOpen(true);
	};

	const handleDeleteProfile = async (id) => {
		try {
			const response = await fetch(API_ENDPOINTS.DELETE_TEACHERS(id), {
				method: "DELETE",
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(`Network response was not ok: ${errorData.message}`);
			}
			setTeachers(teachers.filter((teacher) => teacher.id !== id));
		} catch (error) {
			console.error("Error deleting teacher:", error);
		}
	};

	const handleFormModal = () => {
		setFormModalOpen(true);
		setIsDropdownOpen(false);
	};

	const handleEmployeeAdded = () => {
		fetchTeachers();
		setFormModalOpen(false);
	};

	const getDefaultPhoto = (gender) => {
		return gender && gender.toLowerCase() === "female"
			? defaultFemalePhoto
			: defaultMalePhoto;
	};

	const handleEditProfile = () => {
		setIsEditing(true);
	};

	const handleSaveProfile = async () => {
		try {
			const response = await fetch(
				API_ENDPOINTS.UPDATE_TEACHERS(selectedProfile.id),
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(selectedProfile),
				}
			);
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(`Network response was not ok: ${errorData.message}`);
			}
			fetchTeachers();
			setModalOpen(false);
			setIsEditing(false);
		} catch (error) {
			console.error("Error updating teacher:", error);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setSelectedProfile((prevProfile) => ({
			...prevProfile,
			[name]: value,
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

			try {
				const response = await axios.post(
					`https://api.cloudinary.com/v1_1/${
						import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
					}/image/upload`,
					formData
				);
				setSelectedProfile((prevProfile) => ({
					...prevProfile,
					photo: response.data.secure_url,
				}));
			} catch (error) {
				console.error("Error uploading photo:", error);
			}
		}
	};

	return (
		<>
			{isLoading ? (
				<ContentSkeleton />
			) : (
				<div className="bg-white p-8 rounded-md w-full">
					<div className="flex items-center justify-between pb-6 ">
						<h2 className="text-gray-600 font-semibold">Employee Details</h2>
						<div>
							<ListTableBtn
								text={"Add Employee"}
								buttonColor={"bg-emerald-600"}
								borderRadius={"rounded-md"}
								onClick={handleFormModal}
							/>
						</div>
					</div>

					{teachers.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-gray-600 mb-4">No employees registered yet.</p>
							<button
								onClick={handleFormModal}
								className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
							>
								Add Employees
							</button>
						</div>
					) : (
						<ListTable
							ListName={"Name"}
							ListRole={"Role"}
							ListDepartment={"Department"}
							ListAction={"Actions"}
							showDataList={teachers.map((teacher) => (
								<CommonTable
									key={teacher.id}
									profile={teacher.photo || getDefaultPhoto(teacher.gender)}
									name={teacher.name}
									role={teacher.role}
									id={
										Array.isArray(teacher.subject) && teacher.subject.length > 0
											? teacher.subject[0].department.name
											: "N/A"
									}
									dangerAction={"Remove"}
									action1={"View Profile"}
									buttonHide={"hidden"}
									onViewProfile={() =>
										handleViewProfile({
											photo: teacher.photo || getDefaultPhoto(teacher.gender),
											name: teacher.name,
											role: teacher.role,
											id: teacher.id,
											gender: teacher.gender,
											dob: teacher.dob,
											contactNumber: teacher.contactNumber,
											departmentId: teacher.departmentId,
											departmentName:
												Array.isArray(teacher.subject) &&
												teacher.subject.length > 0
													? teacher.subject[0].department.name
													: "N/A",
											permanent_address: teacher.permanent_address,
											currentAddress: teacher.currentAddress,
										})
									}
									onDelete={() => handleDeleteProfile(teacher.id)}
								/>
							))}
						/>
					)}

					{selectedProfile && (
						<Modal
							modalOpen={modalOpen}
							setModalOpen={setModalOpen}
							responsiveWidth={"md:w-fit"}
						>
							<div className="flex justify-center items-center gap-4 flex-wrap">
								<div className="mx-2">
									<img
										src={
											selectedProfile.photo ||
											getDefaultPhoto(selectedProfile.gender)
										}
										alt={selectedProfile.name}
										className="w-32 h-32 mx-auto rounded-full"
									/>
									<h3 className="text-xl font-semibold my-4 capitalize">
										{selectedProfile.name}
									</h3>
								</div>
								<div className="mx-2">
									{isEditing ? (
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
													value={selectedProfile.name}
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
													value={selectedProfile.role}
													onChange={handleChange}
													className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
												/>
											</div>
										
								
											<button
												onClick={handleSaveProfile}
												className="bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
											>
												Save
											</button>
										</>
									) : (
										<>
											<ModalDetails
												modalTitle={"Department: "}
												modalDesc={`${selectedProfile.departmentName} (${selectedProfile.departmentId})`}
											/>
											<ModalDetails
												modalTitle={"ID : "}
												modalDesc={selectedProfile.id}
											/>
											<ModalDetails
												modalTitle={"Gender : "}
												modalDesc={selectedProfile.gender}
											/>
											<ModalDetails
												modalTitle={"Role : "}
												modalDesc={selectedProfile.role}
											/>
											<ModalDetails
												modalTitle={"Date of Birth : "}
												modalDesc={selectedProfile.dob}
											/>
											<ModalDetails
												modalTitle={"Contact Number : "}
												modalDesc={selectedProfile.contactNumber}
											/>
											<ModalDetails
												modalTitle={"Permanent Address : "}
												modalDesc={selectedProfile.permanent_address}
											/>
											<ModalDetails
												modalTitle={"Current Address : "}
												modalDesc={selectedProfile.currentAddress}
											/>
											<button
												onClick={handleEditProfile}
												className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
											>
												Edit
											</button>
										</>
									)}
								</div>
							</div>
						</Modal>
					)}

					<Modal
						modalOpen={formModalOpen}
						setModalOpen={setFormModalOpen}
						responsiveWidth={"md:w-fit"}
					>
						{formModalOpen && 
						<CreateEmployee setFormModalOpen={setFormModalOpen}/>
}
						{/* <EmployeeAddForm onEmployeeAdded={handleEmployeeAdded} /> */}
					</Modal>
				</div>
			)}
		</>
	);
};

export default Employee;
