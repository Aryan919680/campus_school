import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import API_ENDPOINTS from "../../API/apiEndpoints";
import ClassForm from "./ClassForm";
import ClassFee from "./ClassFee";
import Steps from "./Steps";
// import DepartmentCourse from "./DepartmentCourse";
// import DepartmentForm from "./DepartmentForm";
// import SubjectsModal from "./SubjectsModal";

const Classes = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [departments, setDepartments] = useState([]);
	const [openForm, setOpenForm] = useState(false);
	const [formValues, setFormValues] = useState({
		name: "",
		code: "",
	});
	const [errorMessage, setErrorMessage] = useState("");
	const [showSubjectsModal, setShowSubjectsModal] = useState(false);
	const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [feePage,setFeePage] = useState(false)
	useEffect(() => {
		fetchDepartments();
	}, []);

	const fetchDepartments = async () => {
		try {
			setIsLoading(true);
			const response = await axios.get(API_ENDPOINTS.FETCH_ALL_DEPARTMENTS);
			if (response.status === 200 && Array.isArray(response.data.data)) {
				setDepartments(response.data.data);
			} else {
				console.error("Unexpected data format:", response.data);
				setErrorMessage("Failed to fetch departments. Unexpected data format.");
			}
		} catch (error) {
			console.error("Error fetching departments:", error);
			setErrorMessage("Failed to fetch departments. Please try again later.");
		} finally {
			setIsLoading(false);
		}
	};

	const onClose = useCallback(() => {
		setOpenForm(false);
		setErrorMessage("");
	}, []);

	const handleForm = useCallback(() => {
		setOpenForm(true);
	}, []);

    const handleFee = useCallback(() =>{
        setFeePage(true);
    }, []);

	const handleInputChange = useCallback((e) => {
		const { name, value } = e.target;
		setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
	}, []);

  

	const handleSubmit = useCallback(
		async (e) => {
			e.preventDefault();
			setErrorMessage("");
			try {
				const response = await axios.post(
					API_ENDPOINTS.CREATE_DEPARTMENTS,
					formValues
				);
				if (response.status === 201) {
					setDepartments((prevDepartments) => [
						...prevDepartments,
						response.data.data,
					]);
					onClose();
				} else {
					setErrorMessage("Unexpected response when creating department.");
				}
			} catch (error) {
				if (error.response) {
					if (error.response.status === 409) {
						setErrorMessage(
							"A department with this code or name already exists."
						);
					} else if (error.response.status === 500) {
						setErrorMessage(
							"An internal server error occurred. Please try again later."
						);
					} else {
						setErrorMessage("An unexpected error occurred. Please try again.");
					}
				} else {
					setErrorMessage(
						"Network error. Please check your connection and try again."
					);
				}
			}
		},
		[formValues, onClose]
	);

	const handleDeleteDepartment = useCallback(async (departmentId) => {
		try {
			await axios.delete(API_ENDPOINTS.DELETE_DEPARTMENT(departmentId));
			setDepartments((prevDepartments) =>
				prevDepartments.filter((dept) => dept.id !== departmentId)
			);
		} catch (error) {
			console.error("Error deleting department:", error);
			setErrorMessage("Failed to delete department. Please try again.");
		}
	}, []);

	const handleOpenSubjectsModal = useCallback((department) => {
		console.log("Opening subjects modal for department:", department);
		setSelectedDepartment(department);
		setShowSubjectsModal(true);
	}, []);

	const handleCloseSubjectsModal = useCallback(() => {
		setShowSubjectsModal(false);
		setSelectedDepartment(null);
	}, []);

	return (
		<div className="bg-white p-8 rounded-md w-full">
			<div className="flex items-center justify-between pb-6 flex-wrap gap-2">
				<h2 className="text-gray-600 font-semibold text-2xl">Class, Section, and Fee Management</h2>
               <div className="flex justify-center items-center">
				<button
					onClick={handleForm}
					className="bg-linear-blue text-white font-bold py-2 px-4 rounded w-full md:w-fit"
				>
					Add New Classes and Sections
				</button>
               
			</div>
           </div>
       
			{errorMessage && (
				<div
					className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
					role="alert"
				>
					<strong className="font-bold">Error: </strong>
					<span className="block sm:inline">{errorMessage}</span>
				</div>
			)}

			{isLoading ? (
				<p>Loading departments...</p>
			) : (
				<div className="flex flex-wrap justify-between ">
					{departments.map((department) => (
						<DepartmentCourse
							key={department.id}
							title={department.name}
							code={department.code}
							price={"₹ 1,00,000/-"}
							duration={"3 Months"}
							departmentId={department.id}
							onDelete={handleDeleteDepartment}
							onGoToCourse={() => handleOpenSubjectsModal(department)}
						/>
					))}
				</div>
			)}

			{openForm && (
				<ClassForm
					formValues={formValues}
					onClose={onClose}
					handleInputChange={handleInputChange}
					handleSubmit={handleSubmit}
					errorMessage={errorMessage}
				/>
				
			)}

            {feePage && (
				<ClassFee
					formValues={formValues}
					onClose={onClose}
					handleInputChange={handleInputChange}
					handleSubmit={handleSubmit}
					errorMessage={errorMessage}
                    
				/>
			)}

			{showSubjectsModal && selectedDepartment && (
				<SubjectsModal
					isOpen={showSubjectsModal}
					onClose={handleCloseSubjectsModal}
					departmentId={selectedDepartment.id}
					departmentName={selectedDepartment.name}
				/>
			)}
		</div>
	);
};

export default Classes;
