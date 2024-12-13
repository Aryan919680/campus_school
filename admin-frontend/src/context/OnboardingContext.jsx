import React, { createContext, useContext, useState } from "react";

const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
	const [onboardingData, setOnboardingData] = useState({
		step: 1,
		// Education type data
		educationType: "",
		boardType: "",
		// Campus data
		campusName: "",
		campusLocation: "",
		campusFoundedYear: "",
		campusLogo: null,
		campusLogoPreview: null,
		// Branch data
		branchName: "",
		branchLocation: "",
		// Admin data
		adminName: "",
		adminEmail: "",
		adminPassword: "",
		adminPhoto: null,
		adminPhotoPreview: null,
	});

	const updateOnboardingData = (newData) => {
		setOnboardingData((prev) => ({ ...prev, ...newData }));
	};

	const value = {
		onboardingData,
		updateOnboardingData,
	};

	return (
		<OnboardingContext.Provider value={value}>
			{children}
		</OnboardingContext.Provider>
	);
};

export const useOnboarding = () => {
	const context = useContext(OnboardingContext);
	if (!context) {
		throw new Error("useOnboarding must be used within an OnboardingProvider");
	}
	return context;
};

export default OnboardingContext;
