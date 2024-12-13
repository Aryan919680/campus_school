import React from "react";

const CustomEvent = ({ event }) => (
	<div className="flex flex-col h-full">
		<div className="text-sm font-semibold mb-1">
			{event.attendanceMarked ? (
				<>
					Present: {event.presentCount} | Absent: {event.absentCount}
				</>
			) : (
				"No attendance data"
			)}
		</div>
		{event.attendanceMarked && event.presentEmployees && (
			<div className="flex flex-wrap overflow-hidden">
				{event.presentEmployees.slice(0, 3).map((employee, index) => (
					<div
						key={index}
						className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs text-white mr-1 mb-1"
						title={employee.name}
					>
						{employee.name.charAt(0)}
					</div>
				))}
				{event.presentEmployees.length > 3 && (
					<div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold">
						+{event.presentEmployees.length - 3}
					</div>
				)}
			</div>
		)}
	</div>
);

export default CustomEvent;
