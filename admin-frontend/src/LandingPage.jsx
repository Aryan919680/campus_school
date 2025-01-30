import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingForm from "./onboarding/OnboardingForm";
import SelectCampus from "./onboarding/SelectCampus";

const LandingPage = () => {
	const navigate = useNavigate();
	const [showOnboarding, setShowOnboarding] = useState(false);

	const handleStartOnboarding = () => {
		setShowOnboarding(true);
	};

	const handleCloseOnboarding = () => {
		setShowOnboarding(false);
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
				<h1 className="text-2xl font-bold mb-6 text-center">
					Welcome to Our Platform
				</h1>
				<div className="space-y-4">
					<button
						onClick={() => navigate("/login")}
						className="block w-full py-2 px-4 bg-sky-600 text-white font-semibold rounded-lg text-center hover:bg-sky-700 transition duration-300"
					>
						Login
					</button>
					<button
						onClick={handleStartOnboarding}
						className="block w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg text-center hover:bg-green-700 transition duration-300"
					>
						Register
					</button>
				</div>
			</div>
			{showOnboarding && <SelectCampus onClose={handleCloseOnboarding} />}
			{/* {showOnboarding && <OnboardingForm onClose={handleCloseOnboarding} />} */}
		</div>
	);
};

export default LandingPage;
