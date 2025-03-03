import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
	const { data, isAuthenticated } = useContext(AuthContext);
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
    console.log("here 11")
	useEffect(() => {
		console.log(isAuthenticated)
		if (!isAuthenticated) {
			navigate("/login", { replace: true });
		} else {
			console.log(children)
			if (
				children.type.name === "TimeTable" &&
				data.AdditionalRole !== "class teacher"
			) {
				navigate("/");
			} else {
				setLoading(false);
			}
		}
	}, [isAuthenticated, navigate, data, children]);

	if (loading) {
		return <div>Loading...</div>;
	}

	return children;
};

export default ProtectedRoute;
