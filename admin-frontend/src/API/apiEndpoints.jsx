const getCampusId = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  return userData?.data?.campusId || null;
};

const API_ENDPOINTS = {
  CREATE_CAMPUS: `${import.meta.env.VITE_BASE_URL}/api/v1/campus/register`,
  CREATE_BRANCH: `${import.meta.env.VITE_BASE_URL}/api/v1/campus/reg/branch`,
  CREATE_ROLE: `${import.meta.env.VITE_BASE_URL}/api/v1/admin/reg`,
  ADMIN_LOGIN: `${import.meta.env.VITE_BASE_URL}/api/v1/admin/login`,
  ADMIN_PROFILE: () => `${import.meta.env.VITE_BASE_URL}/api/v1/admin/me`,

  // Class
  CREATE_CLASS: () =>
    `${import.meta.env.VITE_BASE_URL}/api/v1/class/campus/${getCampusId()}`,
  FETCH_CLASS: () =>
    `${import.meta.env.VITE_BASE_URL}/api/v1/class/campus/${getCampusId()}`,
  DELETE_CLASS: () =>
    `${import.meta.env.VITE_BASE_URL}/api/v1/class/campus/${getCampusId()}`,
  FETCH_FEES: () =>
    `${import.meta.env.VITE_BASE_URL}/api/v1/class/campus/${getCampusId()}`,

  // CREATE_FEES : `${import.meta.env.VITE_BASE_URL}/api/v1/class/campus/${campusIdTest}/${}/fees`

  //DEPARTMENT
  CREATE_DEPARTMENT: () =>
    `${
      import.meta.env.VITE_BASE_URL
    }/api/v1/department/campus/${getCampusId()}/register`,
  GET_DEPARTMENTS: () =>
    `${
      import.meta.env.VITE_BASE_URL
    }/api/v1/department/campus/${getCampusId()}`,
  DELETE_DEPARTMENT: () =>
    `${
      import.meta.env.VITE_BASE_URL
    }/api/v1/department/campus/${getCampusId()}`,
  SUBMIT_COURSES: () =>
    `${
      import.meta.env.VITE_BASE_URL
    }/api/v1/department/campus/${getCampusId()}/department`,
  GET_COURSES_OF_DEPARTMENT: () =>
    `${
      import.meta.env.VITE_BASE_URL
    }/api/v1/department/campus/${getCampusId()}/department`,

  //FEES
  SUBMIT_FEES: () =>
    `${
      import.meta.env.VITE_BASE_URL
    }/api/v1/department/campus/${getCampusId()}`,
  PAYMENT_FEES: () =>
    `${
      import.meta.env.VITE_BASE_URL
    }/api/v1/payment/campus/${getCampusId()}/fees`,
  //Attendance

  MARK_ATTENDANCE: () =>
    `${
      import.meta.env.VITE_BASE_URL
    }/api/v1/attendance/campus/${getCampusId()}/employees`,
  GET_ATTENDANCE: () =>
    `${
      import.meta.env.VITE_BASE_URL
    }/api/v1/attendance/campus/${getCampusId()}/employees`,
  GET_COLLEGE_ATTENDANCE: () =>
    `${
      import.meta.env.VITE_BASE_URL
    }/api/v1/attendance/campus/${getCampusId()}/students`,
  MARK_COLLEGE_ATTENDANCE: () =>
    `${
      import.meta.env.VITE_BASE_URL
    }/api/v1/attendance/campus/${getCampusId()}/students`,
  GET_LEAVE_REQUESTS: () =>
    `${
      import.meta.env.VITE_BASE_URL
    }/api/v1/leave/campus/${getCampusId()}/employees`,
  //students
  REGISTER_STUDENTS: () =>
    `${
      import.meta.env.VITE_BASE_URL
    }/api/v1/student/campus/${getCampusId()}/register`,
  GET_STUDENTS_DATA: () =>
    `${import.meta.env.VITE_BASE_URL}/api/v1/student/campus/${getCampusId()}`,
  DELETE_STUDENTS: (eventId) =>
    `${
      import.meta.env.VITE_BASE_URL
    }/api/v1/student/campus/${getCampusId()}/${eventId}`,
  Update_Student: () =>
    `${import.meta.env.VITE_BASE_URL}/api/v1/student/campus/${getCampusId()}`,

  //employees
  REGISTER_EMPLOYEES: () =>
    `${
      import.meta.env.VITE_BASE_URL
    }/api/v1/employee/campus/${getCampusId()}/register`,
  DELETE_EMPLOYEE: () =>
    `${import.meta.env.VITE_BASE_URL}/api/v1/employee/campus/${getCampusId()}`,
  FETCH_ALL_TEACHERS: () =>
    `${import.meta.env.VITE_BASE_URL}/api/v1/employee/campus/${getCampusId()}`,

  Register_Role: () =>
    `${
      import.meta.env.VITE_BASE_URL
    }/api/v1/role/campus/${getCampusId()}/register`,

  // SUBJECTS

  CREATE_SUBJECT: () =>
    `${
      import.meta.env.VITE_BASE_URL
    }/api/v1/subject/campus/${getCampusId()}/register`,
  GET_SUBJECTS: () =>
    `${import.meta.env.VITE_BASE_URL}/api/v1/subject/campus/${getCampusId()}/`,
  CREATE_TIMETABLE: () =>
    `${
      import.meta.env.VITE_BASE_URL
    }/api/v1/timeTable/campus/${getCampusId()}/register`,
  GET_TIMETABLE: () =>
    `${import.meta.env.VITE_BASE_URL}/api/v1/timeTable/campus/${getCampusId()}`,

  CREATE_NOTICE: () =>
    `${import.meta.env.VITE_BASE_URL}/api/v1/notice/campus/${getCampusId()}`,
  GET_NOTICES: () =>
    `${
      import.meta.env.VITE_BASE_URL
    }/api/v1/notice/campus/${getCampusId()}/admin`,
  CREATE_SUPPORT: () =>
    `${import.meta.env.VITE_BASE_URL}/api/v1/support/campus/${getCampusId()}`,
  CREATE_EXAM: () =>
    `${import.meta.env.VITE_BASE_URL}/api/v1/exam/campus/${getCampusId()}`,
};

export default API_ENDPOINTS;
