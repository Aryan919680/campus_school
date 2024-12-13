import React from "react";

const FormItems = ({ formLabel, formType, formPlaceholder }) => {
	return (
		<div className="flex flex-col my-2">
			<label className="text-white">{formLabel}</label>
			<input
				className="my-2 rounded-lg p-4"
				type={formType}
				placeholder={formPlaceholder}
			/>
		</div>
	);
};

export default FormItems;
