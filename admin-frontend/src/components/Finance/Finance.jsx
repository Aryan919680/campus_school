import React, { useEffect } from "react";
import {
	Link,
	Routes,
	Route,
	useLocation,
	useNavigate,
	Navigate,
} from "react-router-dom";
import Summary from "./Summary";
import Transactions from "./Transactions";
// import StudentFees from "./student/StudentFees";
import StudentWithPaymentStatus from "../Fees/StudentsWithPaymentStatus";
import Payroll from "./Payroll";

const Finance = () => {
	const tabs = ["summary", "transactions", "student-fees", "payroll"];
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const currentTab = location.pathname.split("/")[2] || "summary";
		if (!tabs.includes(currentTab)) {
			navigate("/finance/summary");
		}
	}, [location, navigate, tabs]);

	return (
		<>
			<h3 className="font-bold text-2xl">Finance</h3>
			<div className="flex my-8">
				{tabs.map((tab, ind) => (
					<Link
						key={ind}
						to={`/finance/${tab}`}
						className={`border-2 rounded-full cursor-pointer px-4 py-2 mx-2 ${
							location.pathname.includes(tab) ? "active" : ""
						}`}
					>
						{tab.charAt(0).toUpperCase() + tab.slice(1)}
					</Link>
				))}
			</div>
			<div>
				<Routes>
					<Route path="/" element={<Navigate to="summary" />} />
					<Route path="summary" element={<Summary />} />
					<Route path="transactions" element={<Transactions />} />
					<Route path="student-fees" element={<StudentWithPaymentStatus />} />
					<Route path="payroll" element={<Payroll />} />
				</Routes>
			</div>
		</>
	);
};

export default Finance;
