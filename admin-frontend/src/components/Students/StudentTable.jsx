import React from "react";
import ListTable from "../List/ListTable";
import AllStudents from "./AllStudents";

const StudentTable = ({ students, onViewProfile, onDeleteProfile }) => {
	const getDefaultPhoto = (gender) => {
		if (gender === "Male") {
			return "https://res.cloudinary.com/duyau9qkl/image/upload/v1717910208/images/w7y88n61dxedxzewwzpn.png";
		} else if (gender === "Female") {
			return "https://res.cloudinary.com/duyau9qkl/image/upload/v1717910872/images/dxflhaspx3rm1kcak2is.png";
		} else {
			return "https://via.placeholder.com/150";
		}
	};

	return (
		<ListTable
			pageTitle={"Student Details"}
			ListName={"Name"}
			ListRole={"Roll Number"}
			ListDepartment={"Department"}
			ListAction={"Actions"}
			showDataList={students.map((student, index) => {
				// Ensure that 'photo' exists and fallback to a default photo if undefined
				const photo = student.photo
					? student.photo
					: getDefaultPhoto(student.gender);

				return (
					<AllStudents
						key={student.id || index} // Use index as a fallback key if 'id' is undefined
						profile={photo}
						name={student.name}
						rollNo={student.rollNo}
						department={student.department ? student.department.name : "N/A"}
						dangerAction={"Remove"}
						action1={"View Profile"}
						buttonHide={"hidden"}
						onViewProfile={() =>
							onViewProfile(
								{
									photo: photo,
									name: student.name,
									year: student.year,
									rollNo: student.rollNo,
									email: student.email,
									gender: student.gender,
									dob: student.dob,
									contactNumber: student.contactNumber,
									department: student.department
										? student.department.name
										: "N/A",
									permanent_address: student.permanent_address,
									currentAddress: student.currentAddress,
									fatherName: student.fatherName,
									motherName: student.motherName,
									fatherContactNumber: student.fatherContactNumber,
									paymentStatus:
										student.payment && student.payment.length > 0
											? student.payment[0].status
											: "N/A",
								},
								student.id
							)
						}
						onDelete={() => onDeleteProfile(student.id)}
						gender={student.gender}
					/>
				);
			})}
		/>
	);
};

export default StudentTable;
