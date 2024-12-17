import React from "react";

const PageSkeleton = () => {
	return (
		<div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
			{/* Sidebar - Collapses to top bar on mobile */}
			<div className="md:w-16 w-full h-16 md:h-screen bg-gray-800 flex md:flex-col justify-between md:justify-start items-center p-4 md:py-4 md:space-y-6">
				{/* Menu Toggle */}
				<div className="w-8 h-8 bg-gray-700 rounded-lg animate-pulse" />

				{/* Navigation Icons - Hidden on mobile */}
				<div className="hidden md:flex md:flex-col md:space-y-6 items-center">
					{[...Array(6)].map((_, i) => (
						<div
							key={i}
							className="w-8 h-8 bg-gray-700 rounded-lg animate-pulse"
						/>
					))}
				</div>
			</div>

			<div className="flex-1">
				{/* Navbar */}
				<div className="h-16 bg-white border-b flex items-center justify-between px-4">
					{/* Left section */}
					<div className="flex items-center space-x-4">
						<div className="w-32 h-8 bg-gray-200 rounded animate-pulse hidden md:block" />
					</div>

					{/* Right section */}
					<div className="flex items-center space-x-4">
						<div className="w-32 h-8 bg-gray-200 rounded animate-pulse" />
						<div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
						<div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
					</div>
				</div>

				{/* Main Content */}
				<div className="p-4 md:p-6">
					{/* Stats Cards */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
						{[...Array(4)].map((_, i) => (
							<div key={i} className="bg-white p-4 md:p-6 rounded-lg shadow">
								<div className="flex items-center space-x-4">
									<div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
									<div className="flex-1">
										<div className="w-16 h-6 bg-gray-200 rounded animate-pulse mb-2" />
										<div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Date Section */}
					<div className="bg-gray-900 p-4 rounded-lg mb-6">
						<div className="w-48 h-6 bg-gray-800 rounded animate-pulse mb-2" />
						<div className="w-64 h-4 bg-gray-800 rounded animate-pulse" />
					</div>

					{/* Employee Section */}
					<div className="bg-white rounded-lg p-4 md:p-6">
						<div className="flex justify-between items-center mb-6">
							<div className="w-40 h-6 bg-gray-200 rounded animate-pulse" />
							<div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
						</div>
						<div className="flex justify-center items-center py-8 md:py-12">
							<div className="text-center">
								<div className="w-48 h-4 bg-gray-200 rounded animate-pulse mx-auto mb-4" />
								<div className="w-32 h-10 bg-gray-200 rounded animate-pulse mx-auto" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PageSkeleton;
