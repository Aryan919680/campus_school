import React from "react";

export const ContentSkeleton = () => {
	return (
		<div className="bg-white p-8 rounded-md w-full animate-pulse">
			{/* Header Section */}
			<div className="flex items-center justify-between pb-6">
				<div className="h-8 w-48 bg-gray-200 rounded" />
				<div className="h-10 w-32 bg-gray-200 rounded" />
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				{[...Array(4)].map((_, i) => (
					<div key={i} className="bg-white p-4 rounded-lg shadow">
						<div className="flex items-center space-x-4">
							<div className="w-12 h-12 bg-gray-200 rounded-lg" />
							<div className="flex-1">
								<div className="h-4 w-20 bg-gray-200 rounded mb-2" />
								<div className="h-6 w-16 bg-gray-200 rounded" />
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Table Section */}
			<div className="mt-8">
				<div className="grid grid-cols-4 gap-4 mb-4">
					{[...Array(4)].map((_, i) => (
						<div key={i} className="h-8 bg-gray-200 rounded" />
					))}
				</div>
				{[...Array(5)].map((_, i) => (
					<div key={i} className="grid grid-cols-4 gap-4 mb-4">
						<div className="h-12 bg-gray-100 rounded-lg" />
						<div className="h-12 bg-gray-100 rounded-lg" />
						<div className="h-12 bg-gray-100 rounded-lg" />
						<div className="h-12 bg-gray-100 rounded-lg" />
					</div>
				))}
			</div>
		</div>
	);
};
