const API_BASE_URL = "https://campus-erp.azurewebsites.net/api/v1";

const getUserIdFromLocalStorage = () => {
	const userData = JSON.parse(localStorage.getItem("userData"));
	return userData && userData.id ? userData.id : null;
};

const userId = getUserIdFromLocalStorage();
console.log("User ID:", userId);

if (!userId) {
	console.error("User ID not found in localStorage");
}

const API_ENDPOINTS = {
	// verify otp
	VERIFY_OTP: (roleId) => `${API_BASE_URL}/admin/verify-email/${roleId}`,

	//campus
	FECTH_CAMPUS_BY_ID: (campusId) =>
		`${API_BASE_URL}/campus/fetch-campus/${campusId}`,
	UPDATE_CAMPUS: `${API_BASE_URL}/campus/update-campus`,

	// Onboarding
	CREATE_CAMPUS: `${API_BASE_URL}/campus/reg/campus`,
	CREATE_BRANCH: `${API_BASE_URL}/campus/reg/branch`,
	CREATE_ROLE: `${API_BASE_URL}/admin/reg`,

	// admin
	CREATE_ADMIN: `${API_BASE_URL}/admin/reg`,
	VERIFY_EMAIL: `${API_BASE_URL}/admin/verify-email/1`,
	ADMIN_LOGIN: `${API_BASE_URL}/admin/login`,
	UPDATE_ADMIN: (userId) => `${API_BASE_URL}/admin/${userId}`,
	FETCH_ADMIN_BY_ID: (userId) => `${API_BASE_URL}/admin/${userId}`,
	FETCH_ALL_ADMIN: `${API_BASE_URL}/admin`,
	ADMIN_FORGOT_PASSWORD: `${API_BASE_URL}/admin/forget-password`,
	ADMIN_RESET_PASSWORD: (userId, token) =>
		`${API_BASE_URL}/admin/reset-password/${token}/${userId}`,
	ADMIN_LOGOUT: `${API_BASE_URL}/admin/logout`,
	DELETE_ADMIN: (userId) => `${API_BASE_URL}/admin/${userId}`,
	// EMPLOYEE/TEACHERS
	REGISTER_TEACHER: `${API_BASE_URL}/teacher/${userId}/reg`,
	FETCH_ALL_TEACHERS: `${API_BASE_URL}/teacher/${userId}/fetchAll`,
	FETCH_TEACHERS: (teacherId) =>
		`${API_BASE_URL}/teacher/${userId}/fetch/${teacherId}`,
	UPDATE_TEACHERS: (id) => `${API_BASE_URL}/teacher/${userId}/update/${id}`,
	DELETE_TEACHERS: (id) => `${API_BASE_URL}/teacher/${userId}/delete/${id}`,
	DELETE_ALL_TEACHERS: `${API_BASE_URL}/teacher/${userId}/deleteAllTeacher`,
	LOGIN_TEACHERS: `${API_BASE_URL}/teacher/login`,
	// ATTENDANCE
	MARK_FACULTY_TEACHERS: (userId) =>
		`${API_BASE_URL}/attendance/markFacultyAttendance/${userId}`,
	FACULTY_ATTENDANCE_DATE: (userId, date) =>
		`${API_BASE_URL}/attendance/fetchFacultyAttendance/${userId}/${date}`,
	FACULTY_ATTENDANCE_BY_DATE_ID: (date, id) =>
		`${API_BASE_URL}/attendance/faculty-attendanceById/${date}/${id}`,
	UPDATE_ATTENDANCE: (userId) =>
		`${API_BASE_URL}/attendance/updateFacultyAttendance/${userId}`,
	SELECTED_DATE_ATTENDANCE: (userId) =>
		`${API_BASE_URL}/attendance/getAttendenceByDate/${userId}`,
	// STUDENTS
	REGISTER_STUDENTS: `${API_BASE_URL}/student/${userId}/reg`,
	FETCH_STUDENT: (studentID) =>
		`${API_BASE_URL}/student/${userId}/fetch/${studentID}`,
	FETCH_ALL_STUDENTS: `${API_BASE_URL}/student/${userId}/fetchAll`,
	UPDATE_STUDENTS: (eventId) =>
		`${API_BASE_URL}/student/${userId}/update/${eventId}`,
	DELETE_STUDENTS: (eventId) =>
		`${API_BASE_URL}/student/${userId}/deleteStudent/${eventId}`,
	DELETE_ALL_STUDENTSS: `${API_BASE_URL}/student/${userId}/deleteAllStudent`,
	LOGIN_STUDENTS: `${API_BASE_URL}/student/login`,
	// SUBJECTS
	CREATE_SUBJECT: (departmentId) =>
		`${API_BASE_URL}/subject/${departmentId}/reg`,
	FETCH_ALL_SUBJECTS_IN_DEPARTMENT: (departmentId) =>
		`${API_BASE_URL}/subject/fetchAll/${departmentId}`,
	UPDATE_SUBJECT: (subjectId) =>
		`${API_BASE_URL}/subject/update/${parseInt(subjectId, 10)}`,
	DELETE_SUBJECT: (subjectId) =>
		`${API_BASE_URL}/subject/delete-subject/${parseInt(subjectId, 10)}`,
	// EVENT
	CREATE_EVENT: `${API_BASE_URL}/event/create`,
	FETCH_ALL_EVENTS: `${API_BASE_URL}/event/fetchAll`,
	UPDATE_EVENT: (eventId) => `${API_BASE_URL}/event/update-event/${eventId}`,
	DELETE_ALL_EVENT: `${API_BASE_URL}/event/deleteAll`,
	DELETE_EVENT: (eventId) => `${API_BASE_URL}/event/delete-event/${eventId}`,
	// LEAVE
	APPLY_LEAVE: `${API_BASE_URL}/Leave/apply-leave`,
	FETCH_ALL_LEAVES_TEACHER_ID: `${API_BASE_URL}/leave/fetch-leaves/`,
	FETCH_ALL_PENDING_LEAVES: `${API_BASE_URL}/leave/pending-leaves`,
	UPDATE_LEAVES: (teacherId, action) =>
		`${API_BASE_URL}/leave/change-status/${teacherId}/${action}`,
	// DEPARTMENT
	CREATE_DEPARTMENTS: `${API_BASE_URL}/department/${userId}/reg`,
	UPDATE_DEPARTMENTS: (departmentId) =>
		`${API_BASE_URL}/department/update/${departmentId}`,
	DELETE_DEPARTMENT: (departmentId) =>
		`${API_BASE_URL}/department/delete/${departmentId}`,
	FETCH_ALL_DEPARTMENTS: `${API_BASE_URL}/department/fetchAll/${userId}`,
	FETCH_DEPARTMENTS: (departmentId) =>
		`${API_BASE_URL}/department/fetch/${departmentId}`,
	//SUPPORT
	CREATE_SUPPORT: `${API_BASE_URL}/admin/support`,
	//Fees
	FETCH_STUDENT_PAYMENT_DETAILS: (studentID) =>
		`${API_BASE_URL}/payment/student/${studentID}`,
	FETCH_PAYMENT_DETAILS: (studentID) =>
		`${API_BASE_URL}/payment/status/${studentID}`,
	UPDATE_PAYMENT_DETAILS: (paymentid, studentID) =>
		`${API_BASE_URL}/payment/create/${paymentid}/${studentID}`,
};

export default API_ENDPOINTS;
