import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./modules/loginSignup/Login";
import Signup from "./modules/loginSignup/Signup";
import ProtectedRoute from "./auth/ProtectedRoute/ProtectedRoute";
import Dashboard from "./modules/teacher/Dashboard";
import HomePage from "./modules/teacher/pages/HomePage";
import ClassRoom from "./modules/teacher/pages/ClassRoom";
import LeavePage from "./modules/teacher/pages/LeavePage";
import Library from "./modules/teacher/pages/Library";
import TimeTable from "./modules/teacher/pages/TimeTable";
import SupportPage from "./modules/teacher/pages/SupportPage";
import Marks from "./modules/teacher/pages/ProvideMarks";
import Lessonplan from "./modules/teacher/pages/Lessonplan";

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
			path: "/lessonplan",
			element: <Lessonplan />,
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
					path: "/class",
					element: (
						<ProtectedRoute>
							<ClassRoom />
						</ProtectedRoute>
					),
				},
				{
					path: "/leave",
					element: (
						<ProtectedRoute>
							<LeavePage />
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
					path: "/timeTable",
					element: (
						<ProtectedRoute>
							<TimeTable />
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
					path: "/marks",
					element: (
						<ProtectedRoute>
							<Marks />
						</ProtectedRoute>
					),
				},
			],
		},
	],
	{
		basename: "/employee-frontend",
	}
);

function App() {
	console.log("here")
	return (
		<div className="flex">
			<RouterProvider router={router} />
		</div>
	);
}

export default App;
