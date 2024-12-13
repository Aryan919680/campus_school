import React from "react";

const ListTableBtn = ({ text, buttonColor, borderRadius, onClick }) => {
	return (
		<button
			className={`text-sm text-white transition duration-150 font-semibold py-2 w-full px-4 h-fit ${buttonColor} ${borderRadius}`}
			onClick={onClick}
		>
			{text}
		</button>
	);
};

export default ListTableBtn;
