import React, { useState, useEffect } from "react";
import axios from "axios";
import DropDownItem from "./DropDownItem";
import API_ENDPOINTS from "../../../API/apiEndpoints";

const DropDown = ({ actions }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [departments, setDepartments] = useState([]);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	useEffect(() => {
		const fetchDepartments = async () => {
			try {
				const response = await axios.get(API_ENDPOINTS.FETCH_ALL_DEPARTMENTS);
				setDepartments(response.data.data);
			} catch (error) {
				console.error("Error fetching departments:", error);
			}
		};

		fetchDepartments();
	}, []);

	return (
		<div className="relative">
			<div className="inline-flex items-center overflow-hidden rounded-md border bg-white">
				<a
					href="#"
					className="border-e px-4 py-2 text-sm/none text-gray-600 hover:bg-gray-50 hover:text-gray-700"
				>
					{actions}
				</a>

				<button
					className="h-full p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-700"
					onClick={toggleMenu}
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
					className="absolute left-0 end-0 z-10 mt-2 w-56 rounded-md border border-gray-100 bg-white shadow-lg"
					role="menu"
				>
					<div className="p-2">
						{departments.map((department) => (
							<DropDownItem key={department.id} item={department.name} />
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default DropDown;
