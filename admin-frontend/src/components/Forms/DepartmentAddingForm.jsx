import React from "react";
import FormItems from "./FormItems";

const DepartmentAddingForm = ({
	onClose,
	formLabel,
	formType,
	formPlaceholder,
}) => {
	return (
		<div className="w-full h-full">
			<form>
				<FormItems
					formLabel={formLabel}
					formType={formType}
					formPlaceholder={formPlaceholder}
				/>
				<div className="flex justify-end items-center">
					<button
						className="px-4 py-2 me-4 text-white border-red-500 border-2 rounded-lg"
						onClick={onClose}
					>
						Cancel
					</button>
					<button
						className="px-4 py-2 ms-4 text-white bg-linear-blue rounded-lg"
						type="submit"
					>
						Submit
					</button>
				</div>
			</form>
		</div>
	);
};

export default DepartmentAddingForm;
