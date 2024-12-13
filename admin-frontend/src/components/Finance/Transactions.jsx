import React from "react";

const Transactions = () => {
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
	return (
		<>
			<div className="flex justify-between px-16">
				<h3 className="font-bold">Transaction History</h3>
				<div>
					<button className="px-6 py-2 border-2 border-indigo-500 rounded-full mx-2">
						Date
					</button>
					<button className="px-6 py-2 border-2 border-indigo-500 rounded-full mx-2">
						Status
					</button>
					<button className="px-6 py-2 border-2 border-indigo-500 rounded-full mx-2">
						Class
					</button>
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
										<button className="bg-green-500 w-fit px-8 py-2 rounded-full text-white">
											{data.actions}
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</>
	);
};

export default Transactions;
