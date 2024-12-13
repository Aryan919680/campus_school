import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";

// Define the function to get user ID from localStorage
const getUserIdFromLocalStorage = () => {
	const userData = JSON.parse(localStorage.getItem("userData"));
	return userData && userData.id ? userData.id : null;
};

const Support = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		option: "Feedback",
		message: "",
	});
	const [responseMessage, setResponseMessage] = useState("");
	const [complaintNo, setComplaintNo] = useState("");

	const userId = getUserIdFromLocalStorage();

	// Fetch user details and autofill form
	useEffect(() => {
		if (userId) {
			const fetchUserDetails = async () => {
				try {
					const response = await axios.get(
						API_ENDPOINTS.FETCH_ADMIN_BY_ID(userId)
					);
					const { name, email } = response.data.data; // Adjusting based on the actual API response structure
					setFormData({
						...formData,
						name: name || "",
						email: email || "",
						phone: "", // If your API doesn't provide phone, leave it as an empty string or adjust based on your needs
					});
				} catch (error) {
					console.error("Error fetching user details:", error);
				}
			};
			fetchUserDetails();
		}
	}, [userId]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const queryData = {
			name: formData.name,
			email: formData.email,
			contactNo: formData.phone,
			query: `${formData.option}: ${formData.message}`,
		};

		console.log("Submitting query data:", queryData); // Log the payload for debugging

		try {
			const response = await axios.post(
				API_ENDPOINTS.CREATE_SUPPORT,
				queryData
			);
			console.log("API Response:", response.data);
			setResponseMessage(response.data.message);
			setComplaintNo(response.data.queryData?.complaintNo || "N/A");
		} catch (error) {
			console.error("Error sending query:", error);
			if (error.response) {
				console.error(
					"Server responded with a status code:",
					error.response.status
				);
				console.error("Response data:", error.response.data);
			} else if (error.request) {
				console.error("No response received:", error.request);
			} else {
				console.error("Error setting up the request:", error.message);
			}
			setResponseMessage("An error occurred. Please try again later.");
		}
	};

	return (
		<section className="bg-gray-100">
			<div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
					<div className="lg:col-span-2 lg:py-12">
						<h6 className="text-black font-bold text-4xl">Need Assistance?</h6>
						<h6 className="text-black font-bold text-2xl">
							We're Here to Help!
						</h6>
						<p className="max-w-xl text-md my-8">
							If you need assistance with any aspect of our School ERP system,
							we're here to help. Whether you have questions about navigating
							the platform, troubleshooting issues, or providing feedback, our
							support team is ready to assist you.
						</p>
						<p>For immediate assistance, feel free to contact us at:</p>
						<div>
							<Link
								to="tel:7030983208"
								className="text-2xl font-bold text-[#ec407a]"
							>
								+91-7030983208
							</Link>

							<div>
								<Link
									to="mailto:websystemshelpcenter@gmail.com"
									className="mt-2 text-lg text-[#ec407a] font-semibold"
								>
									websystemshelpcenter@gmail.com
								</Link>
							</div>
						</div>
						<p className="max-w-xl text-md mt-8">
							Alternatively, you can use the form on the right to send us your
							queries, feedback, or complaints. Our team will get back to you as
							soon as possible.
						</p>
					</div>

					<div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
						<form className="space-y-4" onSubmit={handleSubmit}>
							<div>
								<label className="sr-only" htmlFor="name">
									Name
								</label>
								<input
									className="w-full rounded-lg border-gray-200 p-3 text-sm"
									placeholder="Name"
									type="text"
									id="name"
									name="name"
									value={formData.name}
									onChange={handleChange}
								/>
							</div>

							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div>
									<label className="sr-only" htmlFor="email">
										Email
									</label>
									<input
										className="w-full rounded-lg border-gray-200 p-3 text-sm"
										placeholder="Email address"
										type="email"
										id="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
									/>
								</div>

								<div>
									<label className="sr-only" htmlFor="phone">
										Phone
									</label>
									<input
										className="w-full rounded-lg border-gray-200 p-3 text-sm"
										placeholder="Phone Number"
										type="tel"
										id="phone"
										name="phone"
										value={formData.phone}
										onChange={handleChange}
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
								<div>
									<label
										htmlFor="Option3"
										className="block w-full cursor-pointer rounded-lg border border-gray-200 p-3 text-gray-600 hover:border-black has-[:checked]:border-black has-[:checked]:bg-black has-[:checked]:text-white"
										tabIndex="0"
									>
										<input
											className="sr-only"
											id="Option3"
											type="radio"
											tabIndex="-1"
											name="option"
											value="Feedback"
											checked={formData.option === "Feedback"}
											onChange={handleChange}
										/>

										<span className="text-sm"> Feedback </span>
									</label>
								</div>

								<div>
									<label
										htmlFor="Option1"
										className="block w-full cursor-pointer rounded-lg border border-gray-200 p-3 text-gray-600 hover:border-black has-[:checked]:border-black has-[:checked]:bg-black has-[:checked]:text-white"
										tabIndex="0"
									>
										<input
											className="sr-only"
											id="Option1"
											type="radio"
											tabIndex="-1"
											name="option"
											value="Enquiry"
											checked={formData.option === "Enquiry"}
											onChange={handleChange}
										/>

										<span className="text-sm"> Enquiry </span>
									</label>
								</div>

								<div>
									<label
										htmlFor="Option2"
										className="block w-full cursor-pointer rounded-lg border border-gray-200 p-3 text-gray-600 hover:border-black has-[:checked]:border-black has-[:checked]:bg-black has-[:checked]:text-white"
										tabIndex="0"
									>
										<input
											className="sr-only"
											id="Option2"
											type="radio"
											tabIndex="-1"
											name="option"
											value="Complaint"
											checked={formData.option === "Complaint"}
											onChange={handleChange}
										/>

										<span className="text-sm"> Complaint </span>
									</label>
								</div>
							</div>

							<div>
								<label className="sr-only" htmlFor="message">
									Message
								</label>

								<textarea
									className="w-full rounded-lg border-gray-200 p-3 text-sm"
									placeholder="Message"
									rows="8"
									id="message"
									name="message"
									value={formData.message}
									onChange={handleChange}
								></textarea>
							</div>

							<div className="mt-4">
								<button
									type="submit"
									className="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
								>
									Send Enquiry
								</button>
							</div>
						</form>
						{responseMessage && (
							<div className="mt-4 text-center">
								<p className="text-green-500">{responseMessage}</p>
								{complaintNo && (
									<p className="text-green-500">
										Your {formData.option} number is: {complaintNo}
									</p>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
};

export default Support;
