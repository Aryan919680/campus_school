import React, { useCallback } from "react";

const DepartmentCourse = ({
	title,
	code,
	price,
	duration,
	departmentId,
	onDelete,
	onGoToCourse,
}) => {
	const handleDeleteCourse = useCallback(() => {
		onDelete(departmentId);
	}, [onDelete, departmentId]);

	const handleGoToCourse = useCallback(() => {
		onGoToCourse();
	}, [onGoToCourse]);

	return (
		<div className="w-full lg:w-1/3 px-2">
			<div className="bg-slate-200 px-8 py-4 min-w-36 rounded-3xl p-4  flex justify-between flex-col">
				<div className="flex justify-between items-center">
					<h2 className="text-lg md:text-xl font-semibold ">{title}</h2>
					<h6 className="font-semibold uppercase">{code}</h6>
				</div>
				<div className="flex justify-between items-center mt-4">
					<div>
						<h6>Fees</h6>
						<h6 className="font-bold">{price}</h6>
					</div>
					<div>
						<h6>Duration</h6>
						<h6 className="font-bold">{duration}</h6>
					</div>
				</div>
				<div className="flex justify-center w-full flex-wrap">
					<button
						className="bg-linear-blue py-4 px-4 my-2 md:mt-8  lg:rounded-s-full  w-full md:w-1/2"
						onClick={handleGoToCourse}
					>
						Go to course
					</button>
					<button
						className="md:w-1/2 w-full border-rose-600 border-2 hover:bg-rose-600 text-rose-600 hover:text-white py-4 px-4 my-2 md:mt-8 md:rounded-e-full "
						onClick={handleDeleteCourse}
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default DepartmentCourse;
