import React from "react";
import Navbar from "../FeesDepartment/Navbar";
import StudentsWithPaymentStatus from "../Fees/StudentsWithPaymentStatus";

const FeesDashboard = ({ userData, logout }) => {
	return (
		<div className="bg-[#F2F3F5]">
			<Navbar logout={logout} userData={userData} />
			<StudentsWithPaymentStatus />
		</div>
	);
};

export default FeesDashboard;
