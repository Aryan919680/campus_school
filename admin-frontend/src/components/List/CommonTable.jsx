import React from "react";
import DropdownMenu from "./DropdownMenu";

const CommonTable = ({
	profile,
	name,
	role,
	id,
	onViewProfile,
	onDelete,
	action1,
	action2,
	dangerAction,
	responsiveWidth,
	hideDropDown,
	buttonHide,
}) => {
	return (
		<tr>
			<td className="px-2 py-5 bg-white text-sm md:text-base">
				{/* <div className="flex justify-start items-center">
					<div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden">
						<img
							src={profile}
							className="w-full h-full object-cover"
							alt={`${name}'s profile`}
							onError={(e) => {
								e.target.src = "default-image-url";
							}}
						/>
					</div> */}
					<div className="ml-3">
						<p className="text-gray-900 whitespace-no-wrap">{name}</p>
					</div>
				{/* </div> */}
			</td>
			<td className="px-2 py-5 bg-white text-center text-sm md:text-base">
				<p className="text-gray-900 whitespace-no-wrap">{role}</p>
			</td>
			<td className="px-2 py-5 bg-white text-center text-sm md:text-base">
				<p className="text-gray-900 whitespace-no-wrap">{id}</p>
			</td>
			{/* <td className="px-2 py-5 bg-white text-center text-sm md:text-base">
				<DropdownMenu
					onViewProfile={onViewProfile}
					onDelete={onDelete}
					dangerAction={dangerAction}
					action1={action1}
					responsiveWidth={responsiveWidth}
					hideDropDown={hideDropDown}
				/>
				<button
					onClick={onViewProfile}
					className={`border rounded-md px-4 py-2 text-sm/none text-gray-600 hover:bg-gray-50 hover:text-gray-700 ${buttonHide}`}
				>
					View Profile
				</button>
			</td> */}
			<td className="px-2 py-5 bg-white text-center text-sm md:text-base">
				{/* <DropdownMenu
					onViewProfile={onViewProfile}
					onDelete={onDelete}
					dangerAction={dangerAction}
					action1={action1}
					responsiveWidth={responsiveWidth}
					hideDropDown={hideDropDown}
				/> */}
				<button
					onClick={onDelete}
					className={`border rounded-md px-4 py-2 text-sm/none text-gray-600 hover:bg-gray-50 hover:text-gray-700`}
				>
					Remove
				</button>
			</td>
		</tr>
	);
};

export default CommonTable;
