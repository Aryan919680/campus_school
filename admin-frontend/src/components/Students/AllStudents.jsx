import React from "react";
import DropdownMenu from "../List/DropdownMenu";

const AllStudents = ({
	profile,
	name,
	rollNo,
	department,
	onViewProfile,
	onDelete,
	action1,
	dangerAction,
	responsiveWidth,
	hideDropDown,
	buttonHide,
	gender,
}) => {
	// const getDefaultImage = (gender) => {
	// 	if (gender === "Male") {
	// 		return "https://res.cloudinary.com/duyau9qkl/image/upload/v1717910208/images/w7y88n61dxedxzewwzpn.png";
	// 	} else if (gender === "Female") {
	// 		return "https://res.cloudinary.com/duyau9qkl/image/upload/v1717910872/images/dxflhaspx3rm1kcak2is.png";
	// 	} else {
	// 		return "https://via.placeholder.com/150";
	// 	}
	// };

	return (
		<tr>
		
			
				<td className="px-2 py-5 bg-white text-center text-sm md:text-base">
				<p className="text-gray-900 whitespace-no-wrap">{name}</p>
			
			</td>
			<td className="px-2 py-5 bg-white text-center text-sm md:text-base">
				<p className="text-gray-900 whitespace-no-wrap">{rollNo}</p>
			</td>
			<td className="px-2 py-5 bg-white text-center text-sm md:text-base">
				<p className="text-gray-900 whitespace-no-wrap">{department}</p>
			</td>
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
					className={`border rounded-md px-4 py-2 text-sm/none text-gray-600 hover:bg-gray-50 hover:text-gray-700 ${buttonHide}`}
				>
					Remove
				</button> 
				
			</td>
		</tr>
	);
};

export default AllStudents;
