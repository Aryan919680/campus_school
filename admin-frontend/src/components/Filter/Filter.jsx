import React, { useState } from "react";
import SearchBar from "./SearchBar";
import FilterOptions from "./FilterOptions";
import TransactionTable from "./TransactionTable";

const Filter = ({ data, filterFields }) => {
	const [filters, setFilters] = useState({});
	const [searchQuery, setSearchQuery] = useState("");

	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		setFilters((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSearchChange = (e) => {
		setSearchQuery(e.target.value.toLowerCase());
	};

	const handleSearchSubmit = (e) => {
		e.preventDefault();
	};

	const filteredData = data.filter((item) => {
		const matchesSearchQuery = filterFields.some((field) =>
			item[field].toLowerCase().includes(searchQuery)
		);

		const matchesFilters = Object.keys(filters).every((key) =>
			filters[key] === ""
				? true
				: item[key].toLowerCase() === filters[key].toLowerCase()
		);

		return matchesSearchQuery && matchesFilters;
	});

	const uniqueOptions = (key) => [...new Set(data.map((item) => item[key]))];

	return (
		<div className="container mx-auto p-4">
			<SearchBar
				searchQuery={searchQuery}
				onSearchChange={handleSearchChange}
				onSearchSubmit={handleSearchSubmit}
			/>
			<FilterOptions
				filters={filters}
				onFilterChange={handleFilterChange}
				uniqueOptions={uniqueOptions}
				filterFields={filterFields}
			/>
			<TransactionTable data={filteredData} />
		</div>
	);
};

export default Filter;
