import React, {useEffect, useState} from "react";
import CollegeStudentList from "./CollegeStudentList";
import ErrorBoundary from "./ErrorBoundary";
import SchoolStudentList from "./SchoolStudentList";

const Students = () => {
	  const [campusType,setCampusType] = useState('');
		useEffect(() => {
			// Fetch userData from localStorage
			const storedUserData = window.localStorage.getItem("userData");
			if (storedUserData) {
				const userData = JSON.parse(storedUserData);
				
				setCampusType(userData.data.campusType)
				// Fetch campus details by campusId
			
			}
	
		
		}, []);
	return (
		<>
			<ErrorBoundary>
				{
					campusType === "SCHOOL" && <SchoolStudentList /> 
					 
				}
				{
					campusType === "COLLEGE" && <CollegeStudentList />
				}
				
			</ErrorBoundary>
		</>
	);
};

export default Students;
