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
					path: "/support",
					element: (
						<ProtectedRoute>
							<SupportPage />
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
