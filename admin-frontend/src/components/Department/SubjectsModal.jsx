import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";

const SubjectsModal = ({ isOpen, onClose, departmentId, departmentName }) => {
	const [subjects, setSubjects] = useState([]);
	const [teachers, setTeachers] = useState([]);
	const [newSubject, setNewSubject] = useState({
		subjectName: "",
		subjectCode: "",
		teacherId: "",
	});
	const [editingSubject, setEditingSubject] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (isOpen && departmentId) {
			fetchSubjects();
			fetchTeachers();
		}
	}, [isOpen, departmentId]);

	const fetchSubjects = useCallback(() => {
		if (!departmentId) {
			setError("Department ID is missing. Unable to fetch subjects.");
			return;
		}
		axios
			.get(API_ENDPOINTS.FETCH_ALL_SUBJECTS_IN_DEPARTMENT(departmentId))
			.then((response) => {
				setSubjects(response.data.data || []);
				setError(null);
			})
			.catch((error) => {
				console.error("Error fetching subjects:", error);
				setError("Failed to fetch subjects. Please try again.");
			});
	}, [departmentId]);

	const fetchTeachers = useCallback(() => {
		axios
			.get(API_ENDPOINTS.FETCH_ALL_TEACHERS)
			.then((response) => {
				setTeachers(response.data.data || []);
			})
			.catch((error) => {
				console.error("Error fetching teachers:", error);
				setError("Failed to fetch teachers. Please try again.");
			});
	}, []);

	const handleAddSubject = useCallback(() => {
		if (!departmentId) {
			setError("Department ID is missing. Unable to add subject.");
			return;
		}
		const requestData = {
			subjectName: newSubject.subjectName,
			subjectCode: newSubject.subjectCode,
			teacherId: newSubject.teacherId
				? parseInt(newSubject.teacherId, 10)
				: null,
		};

		axios
			.post(API_ENDPOINTS.CREATE_SUBJECT(departmentId), requestData)
			.then((response) => {
				if (response.status === 201) {
					fetchSubjects();
					setNewSubject({ subjectName: "", subjectCode: "", teacherId: "" });
					setError(null);
				}
			})
			.catch((error) => {
				console.error("Error adding subject:", error);
				setError("Failed to add subject. Please try again.");
			});
	}, [newSubject, departmentId, fetchSubjects]);

	const handleEditSubject = useCallback((subject) => {
		setEditingSubject(subject);
	}, []);

	const handleSaveEdit = useCallback(() => {
		if (!editingSubject || !departmentId) return;

		const updatedSubject = {
			subjectName: editingSubject.subjectName,
			subjectCode: editingSubject.subjectCode,
			teacherId: editingSubject.teacherId
				? parseInt(editingSubject.teacherId, 10)
				: null,
		};

		axios
			.put(API_ENDPOINTS.UPDATE_SUBJECT(editingSubject.id), updatedSubject)
			.then((response) => {
				if (response.status === 200) {
					fetchSubjects();
					setEditingSubject(null);
					setError(null);
				}
			})
			.catch((error) => {
				console.error("Error updating subject:", error);
				setError("Failed to update subject. Please try again.");
			});
	}, [editingSubject, departmentId, fetchSubjects]);

	const handleDeleteSubject = useCallback(
		(subjectId) => {
			if (!departmentId) return;
			if (window.confirm("Are you sure you want to delete this subject?")) {
				axios
					.delete(API_ENDPOINTS.DELETE_SUBJECT(subjectId))
					.then((response) => {
						if (response.status === 200) {
							fetchSubjects();
							setError(null);
						}
					})
					.catch((error) => {
						console.error("Error deleting subject:", error);
						setError("Failed to delete subject. Please try again.");
					});
			}
		},
		[departmentId, fetchSubjects]
	);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
			<div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
				<div className="sticky top-0 bg-white p-4 border-b">
					<div className="flex justify-between items-center">
						<h2 className="text-2xl font-bold">{departmentName} Subjects</h2>
						<button
							onClick={onClose}
							className="text-gray-500 hover:text-gray-700 text-2xl"
						>
							&times;
						</button>
					</div>
				</div>

				<div className="p-4">
					{error && (
						<div
							className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
							role="alert"
						>
							<strong className="font-bold">Error: </strong>
							<span className="block sm:inline">{error}</span>
						</div>
					)}

					{departmentId ? (
						<>
							<div className="mb-6 bg-gray-100 p-4 rounded">
								<h3 className="text-lg font-semibold mb-2">Add New Subject</h3>
								<div className="flex justify-center items-center gap-4">
									<input
										type="text"
										placeholder="Subject Name"
										value={newSubject.subjectName}
										onChange={(e) =>
											setNewSubject({
												...newSubject,
												subjectName: e.target.value,
											})
										}
										className="border p-2 rounded w-full"
									/>
									<input
										type="text"
										placeholder="Subject Code"
										value={newSubject.subjectCode}
										onChange={(e) =>
											setNewSubject({
												...newSubject,
												subjectCode: e.target.value,
											})
										}
										className="border p-2 rounded w-full"
									/>
									<select
										value={newSubject.teacherId}
										onChange={(e) =>
											setNewSubject({
												...newSubject,
												teacherId: e.target.value,
											})
										}
										className="border p-2 rounded w-full"
									>
										<option value="">Select Teacher</option>
										{teachers.map((teacher) => (
											<option key={teacher.id} value={teacher.id}>
												{teacher.name}
											</option>
										))}
									</select>
								</div>
								<button
									onClick={handleAddSubject}
									className="mt-4  bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-800 w-full "
								>
									Add Subject
								</button>
							</div>

							{/* Subjects Cards */}
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{subjects.map((subject) => (
									<div
										key={subject.id}
										className="bg-white shadow-md rounded-lg p-4"
									>
										{editingSubject && editingSubject.id === subject.id ? (
											<>
												<input
													type="text"
													value={editingSubject.subjectName}
													onChange={(e) =>
														setEditingSubject({
															...editingSubject,
															subjectName: e.target.value,
														})
													}
													className="border p-2 rounded w-full mb-2"
												/>
												<input
													type="text"
													value={editingSubject.subjectCode}
													onChange={(e) =>
														setEditingSubject({
															...editingSubject,
															subjectCode: e.target.value,
														})
													}
													className="border p-2 rounded w-full mb-2"
												/>
												<select
													value={editingSubject.teacherId}
													onChange={(e) =>
														setEditingSubject({
															...editingSubject,
															teacherId: e.target.value,
														})
													}
													className="border p-2 rounded w-full mb-2"
												>
													<option value="">Select Teacher</option>
													{teachers.map((teacher) => (
														<option key={teacher.id} value={teacher.id}>
															{teacher.name}
														</option>
													))}
												</select>
												<div className="flex justify-end space-x-2">
													<button
														onClick={handleSaveEdit}
														className="bg-green-500 text-white px-3 py-1 rounded"
													>
														Save
													</button>
													<button
														onClick={() => setEditingSubject(null)}
														className="bg-gray-500 text-white px-3 py-1 rounded"
													>
														Cancel
													</button>
												</div>
											</>
										) : (
											<>
												<h3 className="font-bold text-lg mb-2">
													{subject.subjectName}
												</h3>
												<p className="text-gray-600 mb-2">
													Code: {subject.subjectCode}
												</p>
												<p className="text-gray-600 mb-4">
													Teacher:{" "}
													{teachers.find((t) => t.id === subject.teacherId)
														?.name || "Not Assigned"}
												</p>
												<div className="flex justify-end space-x-2">
													<button
														onClick={() => handleEditSubject(subject)}
														className="bg-linear-blue text-white px-3 py-1 rounded"
													>
														Edit
													</button>
													<button
														onClick={() => handleDeleteSubject(subject.id)}
														className="bg-red-500 text-white px-3 py-1 rounded"
													>
														Delete
													</button>
												</div>
											</>
										)}
									</div>
								))}
							</div>
						</>
					) : (
						<div className="text-center py-8">
							<p className="text-xl text-gray-600">
								Unable to load subjects. Department ID is missing.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default SubjectsModal;
