import React from "react";
import moment from "moment";

const AttendanceForm = ({
	teachers,
	selectedDate,
	attendance,
	selectAll,
	attendanceMarked,
	handleSelectAllChange,
	handleAttendanceChange,
	postAttendance,
}) => (
	<div>
		<fieldset>
			<div className="text-lg font-medium text-gray-900 mb-2">
				Selected Date: {moment(selectedDate).format("MMMM D, YYYY")}
			</div>
			<div className="mt-4 space-y-2">
				<label
					htmlFor="select-all"
					className="flex cursor-pointer items-start gap-4"
				>
					<div className="flex items-center">
						<input
							type="checkbox"
							className="size-4 rounded border-gray-300"
							id="select-all"
							checked={selectAll}
							onChange={handleSelectAllChange}
							disabled={teachers.length === 0}
						/>
					</div>
					<div>
						<strong className="font-medium text-gray-900">Select All</strong>
					</div>
				</label>
				{teachers.map((teacher) => (
					<label
						key={teacher.id}
						htmlFor={`teacher-${teacher.id}`}
						className="flex cursor-pointer items-start gap-4"
					>
						<div className="flex items-center">
							<input
								type="checkbox"
								className="size-4 rounded border-gray-300"
								id={`teacher-${teacher.id}`}
								checked={!!attendance[teacher.id]}
								onChange={() => handleAttendanceChange(teacher.id)}
							/>
						</div>
						<div>
							<strong className="font-medium text-gray-900">
								{teacher.name}
							</strong>
						</div>
					</label>
				))}
			</div>
		</fieldset>
		<button
			onClick={postAttendance}
			className={`mt-4 px-4 py-2 rounded ${
				attendanceMarked
					? "bg-gray-400 cursor-not-allowed"
					: "bg-red-500 text-white hover:bg-red-600"
			}`}
			disabled={attendanceMarked}
		>
			Submit Attendance
		</button>
	</div>
);

export default AttendanceForm;
