import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
	
	const { data, isAuthenticated } = useContext(AuthContext);
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
console.log(isAuthenticated,data)
	useEffect(() => {
		if (data === null && !isAuthenticated) {
			navigate("/login", { replace: true });
		} else {
			setLoading(false);
		}
	}, [data, isAuthenticated, navigate]);

	if (loading) {
		return <div>Loading...</div>;
	}

	return children;
};

export default ProtectedRoute;
