import React, { useState, useEffect } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
import CreateEventForm from "./CreateEventForm";

const EventManagement = () => {
	const [showCreateEventForm, setShowCreateEventForm] = useState(false);
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const response = await axios.get(API_ENDPOINTS.FETCH_ALL_EVENTS);
				const sortedEvents = response.data.data.sort(
					(a, b) => new Date(b.created_at) - new Date(a.created_at)
				);
				setEvents(sortedEvents);
			} catch (error) {
				console.error("Error fetching events:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchEvents();
	}, []);

	useEffect(() => {
		if (showCreateEventForm) {
			document.body.classList.add("overflow-hidden");
		} else {
			document.body.classList.remove("overflow-hidden");
		}
	}, [showCreateEventForm]);

	const handleCreateEventClick = (event) => {
		event.preventDefault();
		setShowCreateEventForm(true);
	};

	const handleCloseForm = () => {
		setShowCreateEventForm(false);
	};

	const handleAddEvent = (newEvent) => {
		setEvents((prevEvents) => [newEvent, ...prevEvents]);
		setShowCreateEventForm(false);
	};

	const handleDeleteEvent = async (eventId) => {
		try {
			await axios.delete(API_ENDPOINTS.DELETE_EVENT(eventId));
			const updatedEvents = events.filter((event) => event.id !== eventId);
			setEvents(updatedEvents);
			console.log("Event deleted successfully.");
		} catch (error) {
			console.error("Error deleting event:", error);
		}
	};

	return (
		<>
			<div>
				<h2 className="font-bold text-4xl">Event Management</h2>
				<div className="my-4">
					<div className="flex justify-between items-center pe-8">
						<h4 className="font-bold text-2xl">Current Events</h4>
						<div className="my-4">
							<button
								className="bg-linear-blue px-4 py-2 rounded-lg w-full md:w-fit ml-4"
								onClick={handleCreateEventClick}
							>
								Create New Event
							</button>
						</div>
					</div>
					{loading ? (
						<p className="text-sm my-8">Loading...</p>
					) : events.length > 0 ? (
						<div className=" flex flex-wrap justify-between">
							{events.map((event) => (
								<div key={event.id} className="my-2 w-1/3 flex">
									<div className="px-4 py-4 bg-white border border-slate-600 w-96 h-fit rounded-lg mb-4">
										<div className="flex flex-col justify-center items-center gap-16 ">
											{event.photo && (
												<img
													src={event.photo}
													alt={event.title}
													className="w-80 h-80"
												/>
											)}
											<div className="flex flex-col justify-between w-full">
												<div>
													<h5 className="font-bold text-2xl">{event.title}</h5>

													<p className="text-sm font-semibold pb-8">
														{new Date(event.date).toLocaleDateString()} -{" "}
														{new Date(event.created_at).toLocaleDateString()}
													</p>
													<p>{event.description}</p>
												</div>
												<button
													onClick={() => handleDeleteEvent(event.id)}
													className="text-sm w-full text-white transition duration-150 font-semibold py-2 px-4 my-4 h-fit bg-linear-red rounded"
												>
													Delete
												</button>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<p className="text-sm my-8">No Event Available</p>
					)}
				</div>

				{showCreateEventForm && (
					<div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
						<div className="w-fit bg-linear-black p-8 rounded-xl">
							<CreateEventForm
								onClose={handleCloseForm}
								onAddEvent={handleAddEvent}
							/>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default EventManagement;
