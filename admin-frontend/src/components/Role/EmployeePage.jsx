import React, { useState, useEffect, useRef } from "react";
import ListTable from "../../components/List/ListTable";
import CommonTable from "../../components/List/CommonTable";
import API_ENDPOINTS from "../../API/apiEndpoints";
import { ContentSkeleton } from "../../components/Skeleton/ContentSkeleton";
import AddRolePage from "./AddRolePage";
const EmployeePage = () => {
	const [teachers, setTeachers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);
	const [formModalOpen, setFormModalOpen] = useState(false);
	const [employeeId, setEmployeeId] = useState();
	const dropdownRef = useRef(null);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;

	useEffect(() => {
		fetchTeachers();
	}, []);

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

	const handleFormModal = () => {
		setFormModalOpen(true);
	};


	const openAssignRolePage = (id) =>{
		console.log(id)
		setFormModalOpen(true);
        setEmployeeId(id);
	}


	return (
		<>
			{isLoading ? (
				<ContentSkeleton />
			) : (
				<div className="bg-white p-8 rounded-md w-full">
					<div className="flex items-center justify-between pb-6 ">
						<h2 className="text-gray-600 font-semibold  text-2xl">Employee Details</h2>
						{/* <div>
							<ListTableBtn
								text={"Add Employee"}
								buttonColor={"bg-emerald-600"}
								borderRadius={"rounded-md"}
								onClick={handleFormModal}
							/>
						</div> */}
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
										label: "Give Role",
										onClick: () => openAssignRolePage(teacher.employeeId),
									},
								]}
							/>
						))}
					/>
					
					)}
                    {
						formModalOpen && <AddRolePage employeeId= {employeeId} setFormModalOpen={setFormModalOpen}/>
					}
					
					
				</div>
			)}
		</>
	);
};

export default EmployeePage;
