import React from "react";

const ModalDetails = ({ modalTitle, modalDesc }) => {
	return (
		<>
			<div className="flex justify-start items-center gap-4 my-4 capitalize">
				<p className="text-gray-800 font-bold">{modalTitle}</p>
				<p className="text-gray-600">{modalDesc}</p>
			</div>
		</>
	);
};

export default ModalDetails;
