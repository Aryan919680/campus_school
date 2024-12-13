import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const TransactionsDetails = () => {
	const navigate = useNavigate(); // Initialize useNavigate hook
	const fakeData = [
		{
			status: "Cancelled",
			date: "04/03/2024",
			transactionID: "15X76D98",
			desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
			amount: "₹40,000",
			actions: "View",
		},
		{
			status: "Success",
			date: "04/03/2024",
			transactionID: "20X89F51",
			desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
			amount: "₹40,000",
			actions: "View",
		},
		{
			status: "Pending",
			date: "04/03/2024",
			transactionID: "20X89F51",
			desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
			amount: "₹40,000",
			actions: "View",
		},
	];

	const handleSeeAllTransactions = () => {
		navigate("/finance/transactions"); // Navigate to Transactions route
	};

	return (
		<>
			<div className="bg-white p-8 rounded-md w-fit sm:w-full">
				<div className="flex items-center justify-between pb-6">
					<div>
						<h2 className="text-gray-600 font-semibold">Transactions</h2>
					</div>
					<div className="flex items-center justify-between">
						<div className="flex flex-col gap-2">
							<button
								onClick={handleSeeAllTransactions}
								className="text-sm text-black transition duration-150 hover:text-white hover:bg-indigo-500 font-semibold py-2 px-4 border-2 border-indigo-500 rounded-full"
							>
								See All Transactions
							</button>
						</div>
					</div>
				</div>
				<div className="mt-4">
					<table className="w-fit overflow-auto">
						<thead>
							<tr>
								<th className="w-fit text-center">Status</th>
								<th className="w-fit text-center">Date</th>
								<th className="w-fit text-center">Ref No.</th>
								<th className="w-1/5 text-center">Description</th>
								<th className="w-fit text-center">Amount</th>
								<th className="w-fit text-center">Actions</th>
							</tr>
						</thead>
						<tbody>
							{fakeData.map((data, ind) => {
								return (
									<tr key={ind} className="px-4">
										<td className="w-fit text-center py-4">{data.status}</td>
										<td className="w-fit text-center py-4">{data.date}</td>
										<td className="w-fit text-center py-4">
											{data.transactionID}
										</td>
										<td className="w-1/5 text-center py-4">{data.desc}</td>
										<td className="w-fit text-center py-4">{data.amount}</td>
										<td className="w-fit text-center">
											<button className="bg-green-500 w-full py-2 rounded-full text-white">
												{data.actions}
											</button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
};

export default TransactionsDetails;
