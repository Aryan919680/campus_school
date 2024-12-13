import React from "react";

const FilterOptions = ({
	filters,
	onFilterChange,
	uniqueOptions,
	filterFields,
}) => {
	return (
		<div className="flex flex-wrap mb-4" id="filter">
			<form className="w-full flex flex-wrap">
				{filterFields.map((field) => (
					<div key={field} className="w-1/4 p-2">
						<select
							name={field}
							className={`w-full px-3 py-2 border rounded ${
								filters[field] ? "bg-sky-100 border-sky-500" : ""
							}`}
							onChange={onFilterChange}
							value={filters[field] || ""}
						>
							<option value="">
								Select {field.charAt(0).toUpperCase() + field.slice(1)}
							</option>
							{uniqueOptions(field).map((option) => (
								<option key={option} value={option}>
									{option}
								</option>
							))}
						</select>
					</div>
				))}
			</form>
		</div>
	);
};

export default FilterOptions;
