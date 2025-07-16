import  { useContext, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import LogIn from "./LogIn";
import Layout from "./Layout";
import ResetPassword from "./ResetPassword";
import LandingPage from "./LandingPage";
import OnboardingForm from "./onboarding/OnboardingForm";
import "./App.css";
import PageSkeleton from "./components/Skeleton/PageSkeleton";
import OnboardingSchoolForm from "./onboardingSchool/OnboardingSchoolForm";

function App() {
	const { isLoggedIn, userData, isLoading, handleLogout } =
		useContext(AuthContext);
	const [showSchoolboarding, setShowSchoolOnboarding] = useState(false);
	const [showCollegeboarding, setShowCollegeOnboarding] = useState(false);

	const logout = () => {
		handleLogout();
		localStorage.removeItem("userType");
		localStorage.removeItem("campusType");
	};

	const handleSchoolOnboarding = () => {
		setShowSchoolOnboarding(true);
	};
	const handleCollegeOnboarding = () => {
		setShowCollegeOnboarding(true);
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
							<LogIn onSchoolOnboarding={handleSchoolOnboarding} onCollegeOnboarding={handleCollegeOnboarding}/>
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
							<LandingPage onStartOnboarding={handleCollegeOnboarding} />
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
			{showCollegeboarding && (
				<OnboardingForm onClose={() => setShowCollegeOnboarding(false)} />
			)}
			{
				showSchoolboarding && (
					<OnboardingSchoolForm onClose={ () => setShowSchoolOnboarding(false)} />
				)
			}
		</>
	);
}

export default App;
