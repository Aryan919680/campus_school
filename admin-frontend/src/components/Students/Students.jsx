import React from "react";
import StudentList from "./StudentList";
import ErrorBoundary from "./ErrorBoundary";

const Students = () => {
	return (
		<>
			<ErrorBoundary>
				<StudentList />
			</ErrorBoundary>
		</>
	);
};

export default Students;
