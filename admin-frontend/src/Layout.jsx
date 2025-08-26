import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Sidebar/Navigation";
import Navbar from "./components/main/Navbar";
import Employees from "./components/Employees/Employees";
import Students from "./components/Students/Students";
import Support from "./components/Support/Support";
import Classes from "./components/Classes/Classes";
import Departments from "./components/Departments/Department";
import AttendancePage from "./components/Attendance/AttendencePage";
import FeePage from "./components/CollegeFees/FeePage";
import FeePageSchool from "./components/SchoolFees/FeePage";
import EmployeePage from "./components/Role/EmployeePage";
import Timetable from "./components/Timetable/TimeTablePage";
import SchoolTimeTablePage from "./components/Timetable/SchoolTimeTablePage";
import NoticePage from "./components/Notice/NoticePage";
import ExamPage from "./components/Exams/ExamPage";
const Layout = ({ logout }) => {
	const [userData, setUserData] = useState(() => {
		const storedUserData = localStorage.getItem("userData");
		return storedUserData ? JSON.parse(storedUserData) : null;
	});
     
	const [isSidebarExpanded, setIsSidebarExpanded] = useState(
		getSidebarStateFromLocalStorage()
	);

	useEffect(() => {
		window.localStorage.setItem(
			"isSidebarExpanded",
			JSON.stringify(isSidebarExpanded)
		);
	}, [isSidebarExpanded]);

	function getSidebarStateFromLocalStorage() {
		return (
			JSON.parse(window.localStorage.getItem("isSidebarExpanded")) || false
		);
	}

	const toggleSidebar = () => {
		setIsSidebarExpanded(!isSidebarExpanded);
	};
	const campusType = userData.data.campusType;
	const isMobile = window.innerWidth < 768;

	return (
		<div className="flex min-h-screen bg-gray-100">
			<Navigation
				isSidebarExpanded={isSidebarExpanded}
				toggleSidebar={toggleSidebar}
			/>
			<div
				className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
					isSidebarExpanded ? "md:ml-64 ml-0" : "md:ml-20 ml-0"
				} `}
			>
				<Navbar
					logout={logout}
					userData={userData}
					toggleSidebar={toggleSidebar}
					setUserData={setUserData}
				/>

				<main
					className={`flex-1 p-6 ${
						isSidebarExpanded && !isMobile ? "ml-0" : "ml-0"
					} w-full`}
				>
					{
						campusType === "SCHOOL" && 
						<Routes>
						<Route path="/" element={<Classes />} />
						<Route path="/classes" element={<Classes />} />
						<Route path="/employees" element={<Employees />} />
						<Route path="/students" element={<Students />} />
						<Route path="/attendance" element={<AttendancePage />} />
						<Route path="/finance" element={<FeePageSchool />} />
						<Route path='/role' element={<EmployeePage />} />
						<Route path="/timetable" element={<SchoolTimeTablePage /> }/>
						<Route path="/notice" element={<NoticePage /> }/>
						<Route path="/support" element={<Support />} />
						<Route path="/exams" element={<ExamPage />} />
				     	</Routes>
					}
					{
						campusType === "COLLEGE" &&
						<Routes>
								<Route path="/" element={<Departments />} />
							<Route path="/department" element={<Departments />} />
							<Route path="/employees" element={<Employees />} />
							<Route path="/attendance" element={<AttendancePage />} />
							<Route path='/role' element={<EmployeePage />} />
						    <Route path="/students" element={<Students />} />
				        	<Route path="/finance" element={<FeePage />} />
				        	<Route path="/timetable" element={<Timetable />} />
							<Route path="/notice" element={<NoticePage /> }/>
							<Route path="/support" element={<Support />} />
							<Route path="/exams" element={<ExamPage />} />
							{/* <Route path="summary" element={<Summary />} />
							<Route path="transactions" element={<Transactions />} />
							<Route path="student-fees" element={<StudentFees />} />
							<Route path="payroll" element={<Payroll />} /> */}
						{/* 	<Route path="/event" element={<EventManagement />} />
						<Route path="/department" element={<Department />} />
						<Route path="/attendance" element={<Attendance />} />
						<Route path="/support" element={<Support />} />
						<Route path="*" element={<NotFound />} /> */}
					</Routes>
					}
					
				</main>
			</div>
		</div>
	);
};

export default Layout;
