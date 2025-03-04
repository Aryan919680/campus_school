import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import API_ENDPOINTS from "../../API/apiEndpoints";

const EmployeeCard = ({
	employee,
	attendance,
	onAttendanceChange,
	selectedDate,
}) => {
	const [attendanceStatus, setAttendanceStatus] = useState([]);
	const [selectedOption, setSelectedOption] = useState(attendance);

	const defaultMalePhoto =
		"https://res.cloudinary.com/duyau9qkl/image/upload/v1717910208/images/w7y88n61dxedxzewwzpn.png";
	const defaultFemalePhoto =
		"https://res.cloudinary.com/duyau9qkl/image/upload/v1717910872/images/dxflhaspx3rm1kcak2is.png";

	useEffect(() => {
		if (employee && employee.id) {
			fetchAttendanceStatus();
		}
	}, [employee, selectedDate]);

	useEffect(() => {
		setSelectedOption(attendance);
	}, [attendance]);

	const handleRadioChange = (value) => {
		setSelectedOption(value);
		onAttendanceChange(employee.id, value);
	};

	const fetchAttendanceStatus = async () => {
		try {
			const today = moment(selectedDate);
			const yesterday = moment(selectedDate).subtract(1, "day");

			const [todayResponse, yesterdayResponse] = await Promise.all([
				axios.get(
					API_ENDPOINTS.FACULTY_ATTENDANCE_BY_DATE_ID(
						today.format("YYYY-MM-DD"),
						employee.id
					)
				),
				axios.get(
					API_ENDPOINTS.FACULTY_ATTENDANCE_BY_DATE_ID(
						yesterday.format("YYYY-MM-DD"),
						employee.id
					)
				),
			]);

			const todayStatus = todayResponse.data.status || "Absent";
			const yesterdayStatus = yesterdayResponse.data.status || "Absent";

			setAttendanceStatus([yesterdayStatus, todayStatus]);
		} catch (error) {
			console.error("Error fetching attendance status:", error);
			setAttendanceStatus(["Unknown", "Unknown"]);
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "Present":
				return "bg-green-700";
			case "Absent":
				return "bg-red-700";
			case "Leave":
				return "bg-orange-700";
			default:
				return "bg-gray-400";
		}
	};

	const getEmployeePhoto = () => {
		if (employee.photo) {
			return employee.photo;
		}
		return employee.gender === "Male" ? defaultMalePhoto : defaultFemalePhoto;
	};

	if (!employee) {
		return <div>No employee data available</div>;
	}

	return (
		<div className="bg-white shadow-md rounded-lg p-6 mb-6">
			<div className="flex items-start">
				<div className="w-24 h-24 rounded-full overflow-hidden mr-6">
					<img
						src={getEmployeePhoto()}
						alt={employee.name}
						className="w-full h-full object-cover"
					/>
				</div>
				<div>
					<h2 className="text-2xl font-bold text-gray-800">{employee.name}</h2>
					<p className="text-gray-600">{employee.contactNumber}</p>
					<p className="text-gray-600">{employee.email}</p>
				</div>
			</div>
			<footer className="mt-4">
				<div className="flex justify-between">
					<div>
						<p className="text-sm text-gray-500 mb-2">
							{moment(employee.created_at).isAfter(
								moment(selectedDate).subtract(2, "days")
							)
								? "No last two days attendance"
								: "Last two days attendance:"}
						</p>
						{!moment(employee.created_at).isAfter(
							moment(selectedDate).subtract(2, "days")
						) && (
							<div className="flex space-x-2">
								{attendanceStatus.map((status, index) => (
									<div
										key={index}
										className={`h-5 w-5 rounded-full ${getStatusColor(status)}`}
										title={`${index === 0 ? "Yesterday" : "Today"}: ${status}`}
									></div>
								))}
							</div>
						)}
					</div>
					<div>
						<p className="text-sm text-gray-500 mb-2">Mark Attendance</p>
						<div className="flex gap-2 justify-end">
							<div className="flex items-center">
								<input
									id={`absent-radio-${employee.employeeId}`}
									type="radio"
									name={`attendance-${employee.employeeId}`}
									className="hidden"
									value="Absent"
									checked={selectedOption === "Absent"}
									onChange={() => handleRadioChange("Absent")}
								/>
								<label
									htmlFor={`absent-radio-${employee.employeeId}`}
									className={`flex items-center justify-center w-8 h-8 border-2 rounded-full text-red-500 font-bold cursor-pointer ${
										selectedOption === "Absent"
											? "bg-red-500 border-red-500 text-white"
											: "bg-white border-gray-300 text-gray-800"
									}`}
								>
									A
								</label>
							</div>
							<div className="flex items-center">
								<input
									id={`present-radio-${employee.employeeId}`}
									type="radio"
									name={`attendance-${employee.employeeId}`}
									className="hidden"
									value="Present"
									checked={selectedOption === "Present"}
									onChange={() => handleRadioChange("Present")}
								/>
								<label
									htmlFor={`present-radio-${employee.employeeId}`}
									className={`flex items-center justify-center w-8 h-8 border-2 rounded-full text-green-500 font-bold cursor-pointer ${
										selectedOption === "Present"
											? "bg-green-500 border-green-500 text-white"
											: "bg-white border-gray-300 text-gray-800"
									}`}
								>
									P
								</label>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default EmployeeCard;
