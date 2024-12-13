import React from "react";

const Toast = ({ message, type = "success", onClose }) => {
	const icons = {
		success: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth="1.5"
				stroke="currentColor"
				className="size-6"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
		),
		error: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth="1.5"
				stroke="currentColor"
				className="size-6"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
				/>
			</svg>
		),
	};

	const colors = {
		success: "bg-emerald-700 text-white",
		error: "bg-rose-700 text-white",
	};

	return (
		<div
			role="alert"
			className={`rounded-xl border border-gray-100 p-4 shadow-lg ${colors[type]}`}
		>
			<div className="flex items-start gap-4">
				<span className="text-white">{icons[type]}</span>
				<div className="flex-1">
					<strong className="block font-medium">
						{type === "success" ? "Success" : "Error"}
					</strong>
					<p className="mt-1 text-sm">{message}</p>
				</div>
				<button
					className="text-white transition hover:text-gray-200"
					onClick={onClose}
				>
					<span className="sr-only">Dismiss popup</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="currentColor"
						className="size-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};

export default Toast;
