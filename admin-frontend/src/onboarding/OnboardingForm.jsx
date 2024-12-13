import React, { useState, useEffect } from "react";
import CreateCampus from "./CreateCampus";
import CreateBranch from "./CreateBranch";
import CreateRole from "./CreateRole";
import ReviewPage from "./ReviewPage";

const OnboardingForm = ({ onClose }) => {
	const [step, setStep] = useState(1);

	useEffect(() => {
		const storedStep = localStorage.getItem("onboardingStep");
		if (storedStep) {
			setStep(parseInt(storedStep, 10));
		}
	}, []);

	const nextStep = () => {
		const newStep = step + 1;
		setStep(newStep);
		localStorage.setItem("onboardingStep", newStep.toString());
	};

	const prevStep = () => {
		const newStep = step - 1;
		setStep(newStep);
		localStorage.setItem("onboardingStep", newStep.toString());
	};

	const renderProgressTracker = () => (
		<div className="mb-8">
			<h2 className="sr-only">Steps</h2>
			<div>
				<ol className="flex items-center justify-between gap-2 text-xs font-medium text-gray-500 sm:gap-4">
					{["Campus", "Branch", "Admin", "Review"].map((label, index) => (
						<li key={label} className="flex items-center justify-center gap-2">
							<span
								className={`size-6 rounded flex justify-center items-center ${
									step > index + 1
										? "bg-green-50 text-green-600"
										: step === index + 1
										? "bg-sky-50 text-sky-600"
										: "bg-gray-50 text-gray-600"
								} text-center text-[10px]/6 font-bold`}
							>
								{step > index + 1 ? (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="size-3 m-auto"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								) : (
									index + 1
								)}
							</span>
							<span className={step === index + 1 ? "text-sky-600" : ""}>
								{label}
							</span>
						</li>
					))}
				</ol>
			</div>
		</div>
	);

	return (
		<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
			<div className="bg-white p-8 rounded-lg shadow-xl md:w-[30vw] w-[90vw] ">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-gray-700">
						School/College Onboarding
					</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700"
					>
						<svg
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
				{renderProgressTracker()}
				{step === 1 && <CreateCampus onNext={nextStep} />}
				{step === 2 && <CreateBranch onNext={nextStep} onPrevious={prevStep} />}
				{step === 3 && <CreateRole onNext={nextStep} onPrevious={prevStep} />}
				{step === 4 && (
					<ReviewPage
						onPrevious={prevStep}
						onSubmit={() => {
							localStorage.removeItem("onboardingStep");
							onClose();
						}}
					/>
				)}
			</div>
		</div>
	);
};

export default OnboardingForm;
