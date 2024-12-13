import React, { useState } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";

const PaymentModal = ({ selectedStudent, onClose, onUpdate }) => {
	const [amount, setAmount] = useState(0);
	const [status, setStatus] = useState("pending");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [selectedPaymentId, setSelectedPaymentId] = useState("");
	const [selectedTitle, setSelectedTitle] = useState("");

	const handlePaymentSelection = (e) => {
		const selectedPayment = selectedStudent.payments.find(
			(payment) => payment.id === parseInt(e.target.value)
		);
		setSelectedPaymentId(selectedPayment.id);
		setSelectedTitle(selectedPayment.title);
		setAmount(selectedPayment.amount);
		setStatus(selectedPayment.status);
	};

	const handleUpdate = async () => {
		setLoading(true);
		try {
			await axios.put(
				API_ENDPOINTS.UPDATE_PAYMENT_DETAILS(
					selectedPaymentId,
					selectedStudent.studentId
				),
				{
					id: selectedPaymentId,
					studentId: selectedStudent.studentId,
					amount,
					status,
				}
			);
			onUpdate();
			onClose();
		} catch (err) {
			setError("Error updating payment details");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white rounded-lg p-6 w-1/3">
				<h2 className="text-xl font-bold mb-4">Update Payment Details</h2>
				{error && <p className="text-red-500 mb-4">{error}</p>}
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700">
						Select Fees to Pay
					</label>
					<select
						value={selectedPaymentId}
						onChange={handlePaymentSelection}
						className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					>
						<option value="">Select Fees</option>
						{selectedStudent.payments.map((payment) => (
							<option key={payment.id} value={payment.id}>
								{payment.title}
							</option>
						))}
					</select>
				</div>
				{selectedPaymentId && (
					<>
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700">
								Amount
							</label>
							<input
								type="number"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							/>
						</div>
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700">
								Status
							</label>
							<select
								value={status}
								onChange={(e) => setStatus(e.target.value)}
								className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							>
								<option value="paid">Paid</option>
								<option value="pending">Pending</option>
							</select>
						</div>
					</>
				)}
				<div className="flex justify-end">
					<button
						onClick={onClose}
						className="bg-gray-500 text-white py-2 px-4 rounded-md mr-2"
					>
						Cancel
					</button>
					<button
						onClick={handleUpdate}
						className="bg-linear-green text-white py-2 px-4 rounded-md"
						disabled={loading || !selectedPaymentId}
					>
						{loading ? "Updating..." : "Update"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default PaymentModal;
