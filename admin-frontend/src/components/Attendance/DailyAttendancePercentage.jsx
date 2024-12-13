import React, { useMemo } from "react";

const DailyAttendancePercentage = ({ attendanceStatus, selectedDate }) => {
	const { presentPercentage, absentPercentage } = useMemo(() => {
		if (!attendanceStatus || attendanceStatus.length === 0) {
			return { presentPercentage: 0, absentPercentage: 0 };
		}
		const totalTeachers = attendanceStatus.length;
		const presentTeachers = attendanceStatus.filter(
			(teacher) => teacher.status === "Present"
		).length;
		const presentPercentage = (presentTeachers / totalTeachers) * 100;
		const absentPercentage = 100 - presentPercentage;
		return { presentPercentage, absentPercentage };
	}, [attendanceStatus]);

	return (
		<div className="my-4 p-4 bg-linear-black shadow rounded-lg w-full h-auto">
			<h2 className="text-lg font-medium ">
				{selectedDate.toLocaleDateString("en-US", {
					year: "numeric",
					month: "long",
					day: "numeric",
				})}
			</h2>
			{attendanceStatus && attendanceStatus.length > 0 ? (
				<>
					<p className="text-green-300">
						Present: {presentPercentage.toFixed(2)}%
					</p>
					<p className="text-red-300">Absent: {absentPercentage.toFixed(2)}%</p>
				</>
			) : (
				<p>No attendance data available for this date.</p>
			)}
		</div>
	);
};

export default DailyAttendancePercentage;
