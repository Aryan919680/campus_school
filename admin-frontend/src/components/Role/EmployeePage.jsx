import React, { useState, useEffect, useCallback } from "react";
import ListTable from "../../components/List/ListTable";
import CommonTable from "../../components/List/CommonTable";
import API_ENDPOINTS from "../../API/apiEndpoints";
import { ContentSkeleton } from "../../components/Skeleton/ContentSkeleton";
import AddRolePage from "./AddRolePage";
import axios from "axios";
const EmployeePage = () => {
	const [teachers, setTeachers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [formModalOpen, setFormModalOpen] = useState(false);
	const [employeeId, setEmployeeId] = useState();
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
	const [searchTerm, setSearchTerm] = useState("");
	const [pageNumber, setPageNumber] = useState(1);
	const [pageSize] = useState(10); // you can make this dynamic too

	const fetchTeachers = useCallback(async () => {
		//setIsLoading(true);
		try {
			const response = await axios.get(API_ENDPOINTS.FETCH_ALL_TEACHERS(), {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				params: {
					search: searchTerm,
					pageNumber,
					pageSize,
				},
			});

			if (Array.isArray(response.data.data)) {
				setTeachers(response.data.data);
				// setTotalPages(response.data.totalPages || 1); // optional
			} else {
				console.error("Unexpected data format:", response.data);
			}
		} catch (error) {
			console.error("Error fetching teachers:", error.response?.data || error.message);
		} finally {
			setIsLoading(false)
		}
	}, [token, searchTerm, pageNumber, pageSize]);

	useEffect(() => {
		fetchTeachers();
	}, [fetchTeachers]);

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
					<div className="flex items-center gap-10 pb-6 ">
						<h2 className="text-gray-600 font-semibold  text-2xl">Employee Details</h2>
					
			 <div className="mb-4 w-full sm:w-1/2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Employee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span className="absolute left-3 top-2.5 text-gray-400 pointer-events-none">
                🔍
              </span>
            </div>
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
