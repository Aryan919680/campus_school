import React, { useContext, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext"; // Changed to named import
import LogIn from "./LogIn";
import Layout from "./Layout";
import FeesDashboard from "./components/Dashboard/FeesDashboard";
import ResetPassword from "./ResetPassword";
import LandingPage from "./LandingPage";
import OnboardingForm from "./onboarding/OnboardingForm";
import CollegeDashboard from "./components/Dashboard/CollegeDashboard";
import "./App.css";
import PageSkeleton from "./components/Skeleton/PageSkeleton";

function App() {
	const { isLoggedIn, userData, isLoading, handleLogout } =
		useContext(AuthContext);
	const [showOnboarding, setShowOnboarding] = useState(false);

	const logout = () => {
		handleLogout();
		localStorage.removeItem("userType");
		localStorage.removeItem("campusType");
	};

	const handleStartOnboarding = () => {
		setShowOnboarding(true);
	};

	if (isLoading) {
		return <PageSkeleton />;
	}

	const userType = localStorage.getItem("userType");
	const campusType = localStorage.getItem("campusType");

	return (
		<>
			<Routes>
				<Route
					path="/login"
					element={
						!isLoggedIn ? (
							<LogIn onStartOnboarding={handleStartOnboarding} />
						) : (
							<Navigate to="/" />
						)
					}
				/>
				<Route
					path="/fees"
					element={
						isLoggedIn && userType === "finance" && campusType === "school" ? (
							<FeesDashboard userData={userData} logout={logout} />
						) : (
							<Navigate to="/" />
						)
					}
				/>
				<Route
					path="/college-dashboard"
					element={
						isLoggedIn && campusType === "college" ? (
							<CollegeDashboard userData={userData} logout={logout} />
						) : (
							<Navigate to="/" />
						)
					}
				/>
				<Route
					path="/reset-password/:token/:userId"
					element={<ResetPassword />}
				/>
				<Route
					path="/"
					element={
						isLoggedIn ? (
							campusType === "college" ? (
								<Navigate to="/college-dashboard" />
							) : userType === "finance" ? (
								<Navigate to="/fees" />
							) : (
								<Layout logout={logout} userData={userData} />
							)
						) : (
							<LandingPage onStartOnboarding={handleStartOnboarding} />
						)
					}
				/>
				<Route
					path="/*"
					element={
						isLoggedIn ? (
							campusType === "college" ? (
								<Navigate to="/college-dashboard" />
							) : userType === "finance" ? (
								<Navigate to="/fees" />
							) : (
								<Layout logout={logout} userData={userData} />
							)
						) : (
							<Navigate to="/" />
						)
					}
				/>
			</Routes>
			{showOnboarding && (
				<OnboardingForm onClose={() => setShowOnboarding(false)} />
			)}
		</>
	);
}

export default App;
