import React, { useState, useEffect, useCallback } from "react";
import moment from "moment";

const AttendanceModal = ({ event, onClose, onSave }) => {
	const [editedAttendance, setEditedAttendance] = useState([]);
	const [isEditMode, setIsEditMode] = useState(false);

	useEffect(() => {
		setEditedAttendance([...event.presentEmployees, ...event.absentEmployees]);
	}, [event]);

	const handleAttendanceEdit = useCallback((employeeId) => {
		setEditedAttendance((prevAttendance) =>
			prevAttendance.map((employee) =>
				employee.id === employeeId
					? {
							...employee,
							status: employee.status === "Present" ? "Absent" : "Present",
					  }
					: employee
			)
		);
	}, []);

	const handleSaveEdit = async (requestBody) => {
		try {
			const apiUrl = API_ENDPOINTS.UPDATE_ATTENDANCE(userId);
			await axios.put(apiUrl, requestBody);
			alert("Attendance updated successfully!");
			setShowModal(false);
			fetchAttendanceData();
		} catch (error) {
			console.error("Error updating attendance:", error);
			alert(`Error updating attendance: ${error.message}`);
		}
	};

	return (
		<div className="fixed z-10 inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
			<div className="bg-white p-5 border w-96 shadow-lg rounded-md">
				<h3 className="text-lg font-medium text-gray-900 mb-4">
					Attendance for {moment(event.start).format("MMMM D, YYYY")}
				</h3>
				<div className="mb-4">
					<p className="text-sm text-gray-500">
						Present:{" "}
						{editedAttendance.filter((e) => e.status === "Present").length}
					</p>
					<p className="text-sm text-gray-500">
						Absent:{" "}
						{editedAttendance.filter((e) => e.status === "Absent").length}
					</p>
				</div>
				<div className="mb-4">
					<h4 className="text-md font-medium text-gray-700 mb-2">Employees:</h4>
					<div className="max-h-60 overflow-y-auto">
						{editedAttendance.map((employee) => (
							<div
								key={employee.id}
								className="flex items-center justify-between mb-2"
							>
								<span className="text-sm">{employee.name}</span>
								{isEditMode ? (
									<button
										onClick={() => handleAttendanceEdit(employee.id)}
										className={`px-2 py-1 rounded ${
											employee.status === "Present"
												? "bg-green-500 text-white"
												: "bg-red-500 text-white"
										}`}
									>
										{employee.status}
									</button>
								) : (
									<div
										className={`w-3 h-3 rounded-full ${
											employee.status === "Present"
												? "bg-green-500"
												: "bg-red-500"
										}`}
									></div>
								)}
							</div>
						))}
					</div>
				</div>
				{isEditMode ? (
					<div className="flex justify-between">
						<button
							className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
							onClick={handleSaveEdit}
						>
							Save Changes
						</button>
						<button
							className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
							onClick={() => setIsEditMode(false)}
						>
							Cancel
						</button>
					</div>
				) : (
					<div className="flex justify-between">
						<button
							className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
							onClick={() => setIsEditMode(true)}
						>
							Edit Attendance
						</button>
						<button
							className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
							onClick={onClose}
						>
							Close
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default AttendanceModal;
