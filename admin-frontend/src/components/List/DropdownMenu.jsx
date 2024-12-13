import React, { useState, useEffect, useRef } from "react";

const DropdownMenu = ({
	onViewProfile,
	onDelete,
	dangerAction,
	action1,
	hideDropDown,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const handleClickOutside = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className={`relative ${hideDropDown}`} ref={dropdownRef}>
			<div className="inline-flex items-center overflow-hidden rounded-md border bg-white">
				<button
					onClick={onViewProfile}
					className="border-e px-4 py-2 text-sm/none text-gray-600 hover:bg-gray-50 hover:text-gray-700"
				>
					{action1}
				</button>

				<button
					onClick={toggleDropdown}
					className="h-full p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-700"
				>
					<span className="sr-only">Menu</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-4 w-4"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
							clipRule="evenodd"
						/>
					</svg>
				</button>
			</div>

			{isOpen && (
				<div
					className="absolute  end-0 z-10 mt-2 w-56 rounded-md border border-gray-100 bg-white shadow-lg"
					role="menu"
				>
					<div className="p-2">
						<button
							onClick={onDelete}
							className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
							role="menuitem"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								/>
							</svg>
							{dangerAction}
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default DropdownMenu;
