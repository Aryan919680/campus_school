import React from "react";
import Filter from "../../Filter/Filter";

const data = [
	{
		status: "Cancelled",
		date: "04/03/2024",
		transactionID: "15X76D98",
		desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
		amount: "₹40,000",
	},
	{
		status: "Success",
		date: "04/03/2024",
		transactionID: "20X89F51",
		desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
		amount: "₹40,000",
	},
	{
		status: "Pending",
		date: "04/03/2024",
		transactionID: "20X89F51",
		desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
		amount: "₹40,000",
	},
];

const filterFields = ["status", "date", "transactionID", "amount", "desc"];

const StudentFees = () => {
	return (
		<>
			<div className="flex justify-between px-16">
				<h3 className="font-bold">Transaction History</h3>
			</div>
			<Filter data={data} filterFields={filterFields} />
		</>
	);
};

export default StudentFees;
