import React from "react";

const CommonCard = ({ userDP, userName, userReq, onApprove, onReject }) => {
	return (
		<div className="w-64 flex justify-between flex-col bg-linear-black p-4 my-2 rounded-2xl text-white">
			<div className="flex justify-between items-center w-fit">
				<div className="w-10 h-10 overflow-hidden rounded-full shadow">
					<img src={userDP} alt={userName} />
				</div>
				<p className="px-2 font-bold text-xl">{userName}</p>
			</div>
			<p className="py-4">{userReq}</p>
			<div className="flex flex-wrap justify-between items-center">
				<button
					className="bg-linear-red px-4 py-2 rounded-lg w-full md:w-fit"
					onClick={onReject}
				>
					Reject
				</button>
				<button
					className="bg-linear-green px-4 py-2 rounded-lg w-full md:w-fit"
					onClick={onApprove}
				>
					Accept
				</button>
			</div>
		</div>
	);
};

export default CommonCard;
