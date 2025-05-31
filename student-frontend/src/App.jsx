import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Dashboard from "./modules/student/Dashboard";
import Library from "./modules/student/pages/Library";
import HomePage from "./modules/student/pages/HomePage";
import Academics from "./modules/student/pages/Academics";
import EventsPage from "./modules/student/pages/EventsPage";
import ChatPage from "./modules/student/pages/ChatPage";
import FeesPayment from "./modules/student/pages/FeesPayment";
import Login from "./modules/loginSignup/Login";
import Signup from "./modules/loginSignup/Signup";
import SupportPage from "./modules/student/pages/Support";
import ProtectedRoute from "./auth/ProtectedRoute/ProtectedRoute";
import TimeTablePage from "./modules/student/components/timeTable/TimeTablePage";
import NoticePage from "./modules/student/components/notice/NoticePage";
import ProfilePage from "./modules/student/components/profile/ProfilePage";
import ExamPage from "./modules/student/components/exams/ExamPage";

const router = createBrowserRouter(
	[
		{
			path: "/login",
			element: <Login />,
		},
		{
			path: "/signup",
			element: <Signup />,
		},
		{
			path: "/",
			element: (
				<ProtectedRoute>
					<Dashboard />
				</ProtectedRoute>
			),
			children: [
				{
					path: "/",
					element: (
						<ProtectedRoute>
							<HomePage />
						</ProtectedRoute>
					),
				},
				{
					path: "/library",
					element: (
						<ProtectedRoute>
							<Library />
						</ProtectedRoute>
					),
				},
				{
					path: "/timetable",
					element: (
						<ProtectedRoute>
							<TimeTablePage />
						</ProtectedRoute>
					),
				},
				{
					path: "/academics",
					element: (
						<ProtectedRoute>
							<Academics />
						</ProtectedRoute>
					),
				},
				{
					path: "/events",
					element: (
						<ProtectedRoute>
							<EventsPage />
						</ProtectedRoute>
					),
				},
				{
					path: "/chat",
					element: (
						<ProtectedRoute>
							<ChatPage />
						</ProtectedRoute>
					),
				},
				{
					path: "/fees",
					element: (
						<ProtectedRoute>
							<FeesPayment />
						</ProtectedRoute>
					),
				},
				{
					path: "/notice",
					element: (
						<ProtectedRoute>
							<NoticePage />
						</ProtectedRoute>
					),
				},
				{
					path: "/profile",
					element: (
						<ProtectedRoute>
							<ProfilePage />
						</ProtectedRoute>
					),
				},
				{
					path: "/support",
					element: (
						<ProtectedRoute>
							<SupportPage />
						</ProtectedRoute>
					),
				},
				{
					path: "/exams",
					element: (
						<ProtectedRoute>
							<ExamPage />
						</ProtectedRoute>
					),
				},
			],
		},
	],
	{
		basename: "/student",
	}
);

function App() {
	return (
		<div className="flex">
			<RouterProvider router={router} />
		</div>
	);
}

export default App;
