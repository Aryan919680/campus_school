import React from "react";
import DropdownMenu from "../List/DropdownMenu";

const AllStudents = ({
	name,
	rollNo,
	department,
	onDelete,
	updateProfile,
	buttonHide,
	subClass,
	course,
	sem,
	classes,
	email
}) => {
 const campusType = localStorage.getItem('campusType');
	return (
		<>
		{
				campusType.toUpperCase() === 'COLLEGE' ?	<tr>
		
			
				<td className="px-2 py-5 bg-white text-center text-sm md:text-base">
				<p className="text-gray-900 whitespace-no-wrap">{name}</p>
			
			</td>
			
			<td className="px-2 py-5 bg-white text-center text-sm md:text-base">
				<p className="text-gray-900 whitespace-no-wrap">{department}</p>
			</td>
			<td className="px-2 py-5 bg-white text-center text-sm md:text-base">
				<p className="text-gray-900 whitespace-no-wrap">{course}</p>
			</td>
			<td className="px-2 py-5 bg-white text-center text-sm md:text-base">
				<p className="text-gray-900 whitespace-no-wrap">{sem}</p>
			</td>
			<td className="px-2 py-5 bg-white text-center text-sm md:text-base">
				<p className="text-gray-900 whitespace-no-wrap">{rollNo}</p>
			</td>
				<td className="px-2 py-5 bg-white text-center text-sm md:text-base">
				<p className="text-gray-900 whitespace-no-wrap">{email}</p>
			</td>
			<td className="px-2 py-5 bg-white text-center text-sm md:text-base">
				 <button
					onClick={onDelete}
					className={`border rounded-md px-4 py-2 text-sm/none text-gray-600 hover:bg-gray-50 hover:text-gray-700 ${buttonHide}`}
				>
					Remove
				</button> 
				<button
					onClick={updateProfile}
					className={`border rounded-md px-4 py-2 text-sm/none text-gray-600 hover:bg-gray-50 hover:text-gray-700 ${buttonHide}`}
				>
					Update
				</button> 
			</td>
		</tr> :
			<tr>
		
			
				<td className="px-2 py-5 bg-white text-center text-sm md:text-base">
				<p className="text-gray-900 whitespace-no-wrap">{name}</p>
			
			</td>
			
			<td className="px-2 py-5 bg-white text-center text-sm md:text-base">
				<p className="text-gray-900 whitespace-no-wrap">{classes}</p>
			</td>
			<td className="px-2 py-5 bg-white text-center text-sm md:text-base">
				<p className="text-gray-900 whitespace-no-wrap">{subClass}</p>
			</td>
			
			<td className="px-2 py-5 bg-white text-center text-sm md:text-base">
				<p className="text-gray-900 whitespace-no-wrap">{rollNo}</p>
			</td>
				<td className="px-2 py-5 bg-white text-center text-sm md:text-base">
				<p className="text-gray-900 whitespace-no-wrap">{email}</p>
			</td>
			<td className="px-2 py-5 bg-white text-center text-sm md:text-base">
				 <button
					onClick={onDelete}
					className={`border rounded-md px-4 py-2 text-sm/none text-gray-600 hover:bg-gray-50 hover:text-gray-700 ${buttonHide}`}
				>
					Remove
				</button> 
				<button
					onClick={updateProfile}
					className={`border rounded-md px-4 py-2 text-sm/none text-gray-600 hover:bg-gray-50 hover:text-gray-700 ${buttonHide}`}
				>
					Update
				</button> 
			</td>
		</tr>
		}
		</>
	
	);
};

export default AllStudents;
