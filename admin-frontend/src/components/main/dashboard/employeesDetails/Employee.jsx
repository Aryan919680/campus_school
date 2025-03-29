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
import UpdateEmployee from "../../../Employees/UpdateEmployee";
const Employee = () => {
	const [teachers, setTeachers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);
	const [formModalOpen, setFormModalOpen] = useState(false);
	const [selectedProfile, setSelectedProfile] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [editData,setEditData] = useState([]);
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
			const response = await fetch(API_ENDPOINTS.FETCH_ALL_TEACHERS() ,
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
			const response = await fetch(`${API_ENDPOINTS.DELETE_EMPLOYEE()}/${id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` }
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(`Network response was not ok: ${errorData.message}`);
			}
			await fetchTeachers();
			
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


	const handleChange = (e) => {
		const { name, value } = e.target;
		setSelectedProfile((prevProfile) => ({
			...prevProfile,
			[name]: value,
		}));
	};

	const handleUpdateProfile = (teacher) =>{
		console.log(teacher)
          setIsEditing(true);
		  setEditData(teacher);
	}

	return (
		<>
			{isLoading ? (
				<ContentSkeleton />
			) : (
				<div className="bg-white p-8 rounded-md w-full">
					<div className="flex items-center justify-between pb-6 ">
						<h2 className="text-gray-600 font-semibold  text-2xl">Employee Details</h2>
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
						ListRole={"Contact"}
						ListDepartment={"Email"}
						ListAction={"Actions"}
						showDataList={teachers.map((teacher) => (
							<CommonTable
								key={teacher.id}
								name={teacher.name}
								role={teacher.additional_details.contactNumber}
								id={teacher.email}
								actions={[
									{
										type: "button",
										label: "Remove",
										onClick: () => handleDeleteProfile(teacher.employeeId),
									},
									
										{
											type: "button",
											label: "Update",
											onClick: () => handleUpdateProfile(teacher),
										},
									
								]}
							/>
						))}
					/>
					
					)}

					
					<Modal
						modalOpen={formModalOpen}
						setModalOpen={setFormModalOpen}
						responsiveWidth={"md:w-fit"}
					>
						{formModalOpen && 
						<CreateEmployee setFormModalOpen={setFormModalOpen} onEmployeeAdded={handleEmployeeAdded}/>
}

				{/* <EmployeeAddForm onEmployeeAdded={handleEmployeeAdded} /> */}
					</Modal>
					{
	isEditing && <UpdateEmployee setIsEditing={setIsEditing} editData={editData} onEmployeeAdded={handleEmployeeAdded}/>
}
		
				</div>
				
			)}
		</>
	);
};

export default Employee;
