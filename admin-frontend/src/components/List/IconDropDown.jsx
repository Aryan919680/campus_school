import React, { useState } from "react";

const IconDropDown = ({ items }) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className="hs-dropdown relative inline-flex">
			<button
				id="hs-dropdown-custom-icon-trigger"
				type="button"
				onClick={toggleDropdown}
				className="hs-dropdown-toggle flex justify-center items-center size-9 text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
			>
				<svg
					className="flex-none size-4 text-gray-600"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<circle cx="12" cy="12" r="1" />
					<circle cx="12" cy="5" r="1" />
					<circle cx="12" cy="19" r="1" />
				</svg>
			</button>

			<div
				className={`absolute top-8 w-fit hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-1 ${
					isOpen ? "block" : "hidden"
				}  bg-white shadow-md rounded-lg p-2 mt-2`}
				aria-labelledby="hs-dropdown-custom-icon-trigger"
			>
				{items}
			</div>
		</div>
	);
};

export default IconDropDown;
