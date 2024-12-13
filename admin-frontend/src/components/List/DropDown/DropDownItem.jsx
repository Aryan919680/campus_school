import React from "react";
import { Link } from "react-router-dom";

const DropDownItem = ({ item }) => {
	return (
		<Link
			to=""
			className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
			role="menuitem"
		>
			{item}
		</Link>
	);
};

export default DropDownItem;
