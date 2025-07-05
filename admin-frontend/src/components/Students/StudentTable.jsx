import React from "react";
import ListTable from "../List/ListTable";
import AllStudents from "./AllStudents";
import ListTableStudent from "../List/ListTableStudent";
import ListTableStudentSchool from "../List/ListTableStudentSchool";

const StudentTable = ({ students, onViewProfile, onDeleteProfile,onUpdateProfile }) => {
  const campusType = localStorage.getItem('campusType');


	return (
		<>
		{
			campusType.toUpperCase() === 'COLLEGE' ?
			<ListTableStudent
			pageTitle={"Student Details"}
			ListName={"Name"}
			ListDepartment={"Department"}
			ListCourse={"Course"}
			ListSem={"Semester"}
			ListRole={"Roll No."}
			ListEmail={"Email"}
			ListAction={"Actions"}
			showDataList={students.map((student, index) => {
				// Ensure that 'photo' exists and fallback to a default photo if undefined
				

				return (
					<AllStudents
						key={student.id || index} // Use index as a fallback key if 'id' is undefined
					    
						name={student.name}
						
						department={student.departmentName ? student.departmentName : "N/A"}
						course={student.courseName}
						sem={student.semesterName}
						rollNo={student.additional_details.rollNumber}
						email={student.email ? student.email : "N/A"}

						dangerAction={"Remove"}
				
				
					    
						onDelete={() => onDeleteProfile(student.studentId)}
						updateProfile ={() => onUpdateProfile(student)}
						gender={student.gender}
					/>
				);
			})}
		/> :
		<ListTableStudentSchool
			pageTitle={"Student Details"}
			ListName={"Name"}
			ListClass={"Class"}
			ListSubClass={"Sub Class"}
			ListRole={"Roll No."}
			ListEmail={"Email"}
			ListAction={"Actions"}
			showDataList={students.map((student, index) => {
				// Ensure that 'photo' exists and fallback to a default photo if undefined
				

				return (
					<AllStudents
						key={student.id || index} // Use index as a fallback key if 'id' is undefined
					    
						name={student.name}
						
						classes={student.className}
						subClass={student.subClassName}
						
						rollNo={student.additional_details.rollNumber}
						email={student.email ? student.email : "N/A"}

						dangerAction={"Remove"}
				
				
					    
						onDelete={() => onDeleteProfile(student.studentId)}
						updateProfile ={() => onUpdateProfile(student)}
						gender={student.gender}
					/>
				);
			})}
		/>
		}
		</>
		
	);
};

export default StudentTable;
