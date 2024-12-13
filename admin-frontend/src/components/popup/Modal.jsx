import React, { useEffect, useRef } from "react";

const Modal = ({ modalOpen, setModalOpen, children, responsiveWidth }) => {
	const modalRef = useRef(null);

	// Close on click outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (modalRef.current && !modalRef.current.contains(event.target)) {
				setModalOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [setModalOpen]);

	// Close if the esc key is pressed
	useEffect(() => {
		const handleEscKey = (event) => {
			if (event.keyCode === 27) {
				setModalOpen(false);
			}
		};

		document.addEventListener("keydown", handleEscKey);
		return () => document.removeEventListener("keydown", handleEscKey);
	}, [setModalOpen]);

	if (!modalOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center glassmorphism-dark z-10 min-h-screen">
			<div ref={modalRef} className={`w-full ${responsiveWidth} text-center `}>
				<div className="flex justify-end mt-4">
					<button
						onClick={() => setModalOpen(false)}
						className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-700"
					>
						Close (X)
					</button>
				</div>
				<div className="bg-white px-8 py-4 md:px-3 md:py-2 rounded-[20px] w-fit min-w-[80%] mx-auto max-h-[80vh] overflow-y-auto hide-scrollbar">
					{children}
				</div>
			</div>
		</div>
	);
};

export default Modal;
