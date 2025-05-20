const getCampusId = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  console.log(userData);
  
  return userData?.data?.campusId || null;
};

const API_ENDPOINTS = {
  CREATE_CAMPUS: `${import.meta.env.VITE_BASE_URL}/api/v1/campus/register`,
  CREATE_BRANCH: `${import.meta.env.VITE_BASE_URL}/api/v1/campus/reg/branch`,
  CREATE_ROLE: `${import.meta.env.VITE_BASE_URL}/api/v1/admin/reg`,
  ADMIN_LOGIN: `${import.meta.env.VITE_BASE_URL}/api/v1/admin/login`,
  ADMIN_PROFILE : ()=> `${import.meta.env.VITE_BASE_URL}/api/v1/admin/me`,
  //create class
  CREATE_CLASS: () => `${import.meta.env.VITE_BASE_URL}/api/v1/class/campus/${getCampusId()}`,
  FETCH_CLASS: () => `${import.meta.env.VITE_BASE_URL}/api/v1/class/campus/${getCampusId()}`,
  DELETE_CLASS: () =>`${import.meta.env.VITE_BASE_URL}/api/v1/class/campus/${getCampusId()}`,
  FETCH_FEES: () => `${import.meta.env.VITE_BASE_URL}/api/v1/class/campus/${getCampusId()}`,
  // CREATE_FEES : `${import.meta.env.VITE_BASE_URL}/api/v1/class/campus/${campusIdTest}/${}/fees`

  //DEPARTMENT
  CREATE_DEPARTMENT: () => `${import.meta.env.VITE_BASE_URL}/api/v1/department/campus/${getCampusId()}/register`,
  GET_DEPARTMENTS: () => `${import.meta.env.VITE_BASE_URL}/api/v1/department/campus/${getCampusId()}`,
  DELETE_DEPARTMENT: () => `${import.meta.env.VITE_BASE_URL}/api/v1/department/campus/${getCampusId()}`,
  SUBMIT_COURSES: () => `${import.meta.env.VITE_BASE_URL}/api/v1/department/campus/${getCampusId()}/department`,
  GET_COURSES_OF_DEPARTMENT: () =>`${import.meta.env.VITE_BASE_URL}/api/v1/department/campus/${getCampusId()}/department`,
  SUBMIT_FEES: () => `${import.meta.env.VITE_BASE_URL}/api/v1/department/campus/${getCampusId()}`,
  PAYMENT_FEES : () =>`${import.meta.env.VITE_BASE_URL}/api/v1/payment/campus/${getCampusId()}/fees`,
    
  MARK_ATTENDANCE : () => `${import.meta.env.VITE_BASE_URL}/api/v1/attendance/campus/${getCampusId()}/employees`,
  GET_ATTENDANCE : () =>`${import.meta.env.VITE_BASE_URL}/api/v1/attendance/campus/${getCampusId()}/employees`,
  GET_COLLEGE_ATTENDANCE : () => `${import.meta.env.VITE_BASE_URL}/api/v1/attendance/campus/${getCampusId()}/students`,
  MARK_COLLEGE_ATTENDANCE : () => `${import.meta.env.VITE_BASE_URL}/api/v1/attendance/campus/${getCampusId()}/students`,
  GET_LEAVE_REQUESTS : () =>`${import.meta.env.VITE_BASE_URL}/api/v1/leave/campus/${getCampusId()}/employees`,
  REGISTER_STUDENTS: () => `${import.meta.env.VITE_BASE_URL
  }/api/v1/student/campus/${getCampusId()}/register`,
  GET_STUDENTS_DATA : () => `${import.meta.env.VITE_BASE_URL
  }/api/v1/student/campus/${getCampusId()}`, 
  REGISTER_EMPLOYEES : () =>`${import.meta.env.VITE_BASE_URL}/api/v1/employee/campus/${getCampusId()}/register`,
DELETE_EMPLOYEE : ()=> `${import.meta.env.VITE_BASE_URL}/api/v1/employee/campus/${getCampusId()}`,
FETCH_ALL_TEACHERS: () => `${import.meta.env.VITE_BASE_URL
}/api/v1/employee/campus/${getCampusId()}`,
  DELETE_STUDENTS: (eventId) =>
    `${import.meta.env.VITE_BASE_URL
    }/api/v1/student/campus/${getCampusId()}/${eventId}`,

    Register_Role : () => `${import.meta.env.VITE_BASE_URL}/api/v1/role/campus/${getCampusId()}/register`,
    Update_Student : () => `${import.meta.env.VITE_BASE_URL}/api/v1/student/campus/${getCampusId()}`,



    // SUBJECTS

    CREATE_SUBJECT : () => `${import.meta.env.VITE_BASE_URL}/api/v1/subject/campus/${getCampusId()}/register`,
    GET_SUBJECTS :  () => `${import.meta.env.VITE_BASE_URL}/api/v1/subject/campus/${getCampusId()}/`,
    CREATE_TIMETABLE: () => `${import.meta.env.VITE_BASE_URL}/api/v1/timeTable/campus/${getCampusId()}/register`,
    GET_TIMETABLE: () => `${import.meta.env.VITE_BASE_URL}/api/v1/timeTable/campus/${getCampusId()}`,

    CREATE_NOTICE: () => `${import.meta.env.VITE_BASE_URL}/api/v1/notice/campus/${getCampusId()}`,
    GET_NOTICES: () => `${import.meta.env.VITE_BASE_URL}/api/v1/notice/campus/${getCampusId()}/admin`,
    CREATE_SUPPORT :() => `${import.meta.env.VITE_BASE_URL}/api/v1/support/campus/${getCampusId()}`,
  // Onboarding
  // CREATE_CAMPUS: `${import.meta.env.VITE_BASE_URL}/api/v1/campus/register`,
  // CREATE_BRANCH: `${import.meta.env.VITE_BASE_URL}/api/v1/campus/reg/branch`,
  // CREATE_ROLE: `${import.meta.env.VITE_BASE_URL}/api/v1/admin/reg`,

  // // admin
  // CREATE_ADMIN: `${import.meta.env.VITE_BASE_URL}/api/v1/admin/reg`,
  // VERIFY_EMAIL: `${import.meta.env.VITE_BASE_URL}/api/v1/admin/verify-email/1`,
  // ADMIN_LOGIN: `${import.meta.env.VITE_BASE_URL}/api/v1/admin/login`,

  // UPDATE_ADMIN: (userId) =>
  //   `${import.meta.env.VITE_BASE_URL}/api/v1/admin/${userId}`,
  // FETCH_ADMIN_BY_ID: (userId) =>
  //   `${import.meta.env.VITE_BASE_URL}/api/v1/admin/${userId}`,
  // FETCH_ALL_ADMIN: `${import.meta.env.VITE_BASE_URL}/api/v1/admin`,
  // ADMIN_FORGOT_PASSWORD: `${import.meta.env.VITE_BASE_URL
  //   }/api/v1/admin/forget-password`,
  // ADMIN_RESET_PASSWORD: (userId, token) =>
  //   `${import.meta.env.VITE_BASE_URL
  //   }/api/v1/admin/reset-password/${token}/${userId}`,
  // ADMIN_LOGOUT: `${import.meta.env.VITE_BASE_URL}/api/v1/admin/logout`,




  // REGISTER_TEACHER: `${import.meta.env.VITE_BASE_URL
  //   }/api/v1/teacher/${userId}/reg`,
  // FETCH_ALL_TEACHERS: `${import.meta.env.VITE_BASE_URL
  //   }/api/v1/employee/campus/${getCampusId()}`,
  // FETCH_TEACHERS: (teacherId) =>
  //   `${import.meta.env.VITE_BASE_URL
  //   }/api/v1/teacher/${userId}/fetch/${teacherId}`,
  // UPDATE_TEACHERS: (id) =>
  //   `${import.meta.env.VITE_BASE_URL}/api/v1/teacher/${userId}/update/${id}`,
  // DELETE_TEACHERS: (id) =>
  //   `${import.meta.env.VITE_BASE_URL}/api/v1/employee/campus/${getCampusId()}/${id}}`,
  // DELETE_ALL_TEACHERS: `${import.meta.env.VITE_BASE_URL
  //   }/api/v1/teacher/${userId}/deleteAllTeacher`,
  // LOGIN_TEACHERS: `${import.meta.env.VITE_BASE_URL}/api/v1/teacher/login`,
 

  // MARK_FACULTY_TEACHERS: (userId) =>
  //   `${import.meta.env.VITE_BASE_URL
  //   }/api/v1/attendance/markFacultyAttendance/${userId}`,
  // FACULTY_ATTENDANCE_DATE: (userId, date) =>
  //   `${import.meta.env.VITE_BASE_URL
  //   }/api/v1/attendance/fetchFacultyAttendance/${userId}/${date}`,
  // FACULTY_ATTENDANCE_BY_DATE_ID: (date, id) =>
  //   `${import.meta.env.VITE_BASE_URL
  //   }/api/v1/attendance/faculty-attendanceById/${date}/${id}`,
  // UPDATE_ATTENDANCE: (userId) =>
  //   `${import.meta.env.VITE_BASE_URL
  //   }/api/v1/attendance/updateFacultyAttendance/${userId}`,
  // SELECTED_DATE_ATTENDANCE: (userId) =>
  //   `${import.meta.env.VITE_BASE_URL
  //   }/api/v1/attendance/getAttendenceByDate/${userId}`,


  // FETCH_STUDENT: (studentID) =>
  //   `${import.meta.env.VITE_BASE_URL
  //   }/api/v1/student/${userId}/fetch/${studentID}`,
  // FETCH_ALL_STUDENTS: `${import.meta.env.VITE_BASE_URL
  //   }/api/v1/student/campus/${userId}/fetchAll`,
  // UPDATE_STUDENTS: (eventId) =>
  //   `${import.meta.env.VITE_BASE_URL
  //   }/api/v1/student/${userId}/update/${eventId}`,

  // DELETE_ALL_STUDENTSS: `${import.meta.env.VITE_BASE_URL
  //   }/api/v1/student/${userId}/deleteAllStudent`,
  // LOGIN_STUDENTS: `${import.meta.env.VITE_BASE_URL}/api/v1/student/login`,

  // CREATE_SUBJECT: (departmentId) =>
  //   `${import.meta.env.VITE_BASE_URL}/api/v1/subject/${departmentId}/reg`,
  // FETCH_ALL_SUBJECTS_IN_DEPARTMENT: (departmentId) =>
  //   `${import.meta.env.VITE_BASE_URL}/api/v1/subject/fetchAll/${departmentId}`,
  // UPDATE_SUBJECT: (subjectId) =>
  //   `${import.meta.env.VITE_BASE_URL}/api/v1/subject/update/${parseInt(
  //     subjectId,
  //     10
  //   )}`,
  // DELETE_SUBJECT: (subjectId) =>
  //   `${import.meta.env.VITE_BASE_URL}/api/v1/subject/delete-subject/${parseInt(
  //     subjectId,
  //     10
  //   )}`,

  // CREATE_EVENT: `${import.meta.env.VITE_BASE_URL}/api/v1/event/create`,
  // FETCH_ALL_EVENTS: `${import.meta.env.VITE_BASE_URL}/api/v1/event/fetchAll`,
  // UPDATE_EVENT: (eventId) =>
  //   `${import.meta.env.VITE_BASE_URL}/api/v1/event/update-event/${eventId}`,
  // DELETE_ALL_EVENT: `${import.meta.env.VITE_BASE_URL}/api/v1/event/deleteAll`,
  // DELETE_EVENT: (eventId) =>
  //   `${import.meta.env.VITE_BASE_URL}/api/v1/event/delete-event/${eventId}`,
  // // LEAVE
  // APPLY_LEAVE: `${import.meta.env.VITE_BASE_URL}/api/v1/Leave/apply-leave`,
  // FETCH_ALL_LEAVES_TEACHER_ID: `${import.meta.env.VITE_BASE_URL
  //   }/api/v1/leave/fetch-leaves/`,
  // FETCH_ALL_PENDING_LEAVES: `${import.meta.env.VITE_BASE_URL
  //   }/api/v1/leave/pending-leaves`,
  // UPDATE_LEAVES: (teacherId, action) =>
  //   `${import.meta.env.VITE_BASE_URL
  //   }/api/v1/leave/change-status/${teacherId}/${action}`,
  // // DEPARTMENT
  // // CREATE_DEPARTMENTS: `${import.meta.env.VITE_BASE_URL
  // //   }/api/v1/department/${userId}/reg`,
  // UPDATE_DEPARTMENTS: (departmentId) =>
  //   `${import.meta.env.VITE_BASE_URL}/api/v1/department/update/${departmentId}`,
  // DELETE_DEPARTMENT: (departmentId) =>
  //   `${import.meta.env.VITE_BASE_URL}/api/v1/department/delete/${departmentId}`,
  // FETCH_ALL_DEPARTMENTS: `${import.meta.env.VITE_BASE_URL
  //   }/api/v1/department/fetchAll/${userId}`,
  // FETCH_DEPARTMENTS: (departmentId) =>
  //   `${import.meta.env.VITE_BASE_URL}/api/v1/department/fetch/${departmentId}`,
  // //SUPPORT
  // CREATE_SUPPORT: `${import.meta.env.VITE_BASE_URL}/api/v1/admin/support`,
  // //Fees
  // FETCH_STUDENT_PAYMENT_DETAILS: (studentID) =>
  //   `${import.meta.env.VITE_BASE_URL}/api/v1/payment/student/${studentID}`,
  // FETCH_PAYMENT_DETAILS: (studentID) =>
  //   `${import.meta.env.VITE_BASE_URL}/api/v1/payment/status/${studentID}`,
  // UPDATE_PAYMENT_DETAILS: (paymentid, studentID) =>
  //   `${import.meta.env.VITE_BASE_URL
  //   }/api/v1/payment/create/${paymentid}/${studentID}`,
};

export default API_ENDPOINTS;
