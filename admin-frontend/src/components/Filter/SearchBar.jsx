import React from "react";
import { Icon } from "@iconify/react";

const SearchBar = ({ searchQuery, onSearchChange, onSearchSubmit }) => {
	return (
		<div className="flex w-fit mb-4" id="search">
			<form
				id="search-form"
				onSubmit={onSearchSubmit}
				className="flex bg-white rounded-full p-2 border"
			>
				<Icon icon="ic:round-search" height={48} />
				<input
					className="form-control w-full px-4 py-2 border-none focus:border-none focus:outline-none"
					style={{
						outline: "none",
						boxShadow: "none",
					}}
					type="text"
					placeholder="Search"
					value={searchQuery}
					onChange={onSearchChange}
				/>
				<button
					type="submit"
					className="w-fit bg-linear-blue  text-white py-2 px-8 rounded-full"
				>
					Search
				</button>
			</form>
		</div>
	);
};

export default SearchBar;
