import React, { useState, useEffect, useRef, useCallback } from "react";
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
	const [formModalOpen, setFormModalOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editData,setEditData] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	  const [pageNumber, setPageNumber] = useState(1);
	  const [pageSize] = useState(10); // you can make this dynamic too
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;



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
		console.log(teachers)
       // setTotalPages(response.data.totalPages || 1); // optional
      } else {
        console.error("Unexpected data format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error.response?.data || error.message);
    }finally{
		setIsLoading(false)
	}
  }, [token, searchTerm, pageNumber, pageSize]);

		useEffect(() => {
		fetchTeachers();
	}, [fetchTeachers]);

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
	};

	const handleEmployeeAdded = () => {
		fetchTeachers();
		setFormModalOpen(false);
	};



	const handleUpdateProfile = (teacher) =>{
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
						<div>
							<button
								onClick={handleFormModal}
								    className="bg-linear-blue text-white font-bold py-2 px-4 rounded"
							>
								Add Employees
							</button>
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

					
					{/* <Modal
						modalOpen={formModalOpen}
						setModalOpen={setFormModalOpen}
						responsiveWidth={"md:w-fit"}
					> */}
						{formModalOpen && 
						<CreateEmployee setFormModalOpen={setFormModalOpen} onEmployeeAdded={handleEmployeeAdded}/>
}

				{/* <EmployeeAddForm onEmployeeAdded={handleEmployeeAdded} /> */}
					{/* </Modal> */}
					{
	isEditing && <UpdateEmployee setIsEditing={setIsEditing} editData={editData} onEmployeeAdded={handleEmployeeAdded}/>
}
 <div className="flex justify-between mt-6">
    <button
      onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
      disabled={pageNumber === 1}
      className="bg-gray-200 px-4 py-2 rounded"
    >
      Prev
    </button>
    <span>Page {pageNumber}</span>
    <button
      onClick={() => setPageNumber((prev) => prev + 1)}
      className="bg-gray-200 px-4 py-2 rounded"
    >
      Next
    </button>
  </div>
		
				</div>
				
			)}
		</>
	);
};

export default Employee;
