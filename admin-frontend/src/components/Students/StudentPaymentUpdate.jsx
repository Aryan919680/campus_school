import React, { useState } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";

const StudentPaymentUpdate = ({ paymentId, studentId, onUpdate }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleUpdatePayment = async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await axios.put(
				API_ENDPOINTS.UPDATE_PAYMENT_DETAILS(paymentId, studentId)
			);
			if (response.status === 200) {
				onUpdate(); // Callback to update the parent component's state
				alert("Payment status updated successfully.");
			} else {
				setError("Failed to update payment status.");
			}
		} catch (error) {
			setError("An error occurred while updating payment status.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<button
				onClick={handleUpdatePayment}
				disabled={loading}
				className="bg-linear-green text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
			>
				{loading ? "Updating..." : "Update Payment Status"}
			</button>
			{error && <p className="text-red-500">{error}</p>}
		</div>
	);
};

export default StudentPaymentUpdate;
