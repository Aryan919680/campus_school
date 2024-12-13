import React from "react";
import { Icon } from "@iconify/react";
import { NavLink } from "react-router-dom";

const NavItems = ({ to, icon, title, isSidebarExpanded }) => {
	return (
		<NavLink
			to={to}
			className="flex items-center h-10 px-3 text-white hover:bg-sky-600 hover:bg-opacity-25 rounded-lg transition-colors duration-150 ease-in-out focus:outline-none focus:shadow-outline"
		>
			<Icon icon={icon} className="h-6 w-6 flex-shrink-0" />
			<span
				className={`ml-2 duration-0 ease-in-out ${
					isSidebarExpanded ? "opacity-100" : "opacity-0"
				}`}
			>
				{title}
			</span>
		</NavLink>
	);
};

export default NavItems;
