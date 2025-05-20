import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [employee, setEmployee] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("token");
  const teacherData = JSON.parse(localStorage.getItem("teacherData"));
  const campusId = teacherData?.campusId;

  const fetchEmployeeDetails = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/employee/campus/${campusId}/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEmployee(response.data.data);
    } catch (error) {
      console.error("Error fetching employee details:", error.response?.data || error.message);
      setErrorMessage("Failed to load employee data.");
    }
  }, [campusId, token]);

  useEffect(() => {
    fetchEmployeeDetails();
  }, [fetchEmployeeDetails]);

  if (!employee) return <div className="text-center mt-10">Loading...</div>;
  const {
    email,
    additional_details: details,
    employeeId,
    name,
    // role
  } = employee;

  return (
    <div className="w-full ml-6 rounded-xl p-4">
    <h1 className="text-3xl font-bold pt-6 mb-6">Profile</h1>

    {errorMessage ? (
      <div className="text-red-500">{errorMessage}</div>
    ) : employee ? (
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-4xl mx-auto mt-10">
    <div className="flex justify-between items-start">
      <h2 className="text-lg font-semibold">Employee Details</h2>
      {/* <button className="text-2xl font-bold">&times;</button> */}
    </div>

    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mt-6">
      {/* <img
        src="https://via.placeholder.com/100"
        alt="student"
        className="w-24 h-24 rounded-full object-cover"
      /> */}
      <div>
        
        {/* <h3 className="text-lg font-semibold">Parent Name: <span>{details?.parentName || 'N/A'}</span></h3> */}
        <div className="mt-1 text-sm">
        <div><span className="font-semibold">Employee ID</span>: {employeeId}</div>
          <div><span className="font-semibold">Name</span>: {name}</div>
          <div><span className="font-semibold">Phone</span>: {details?.contactNumber}</div>
          <div><span className="font-semibold">Qualification</span>: {details?.qualification}</div>
          <div><span className="font-semibold">Email</span>: {email}</div>
          {/* <div><span className="font-semibold">Assigned Role</span>: {role}</div> */}
        </div>
      </div>
    </div>

    <div className="flex flex-wrap gap-4 mt-6 items-center">
      <div className="text-sm">Class 11 A</div>
      <div className="text-sm">Academic Year ▾</div>
    </div>

    <div className="flex flex-col sm:flex-row gap-4 mt-6">
      <div className="flex-1 bg-gray-200 rounded-2xl py-4 text-center">
        <div className="text-xl font-bold text-blue-600">3</div>
        <div className="text-sm">Total Class Alloted</div>
      </div>
      <div className="flex-1 bg-gray-200 rounded-2xl py-4 text-center">
        <div className="text-xl font-bold text-blue-600">29</div>
        <div className="text-sm">Total Attendance</div>
      </div>
      <div className="flex-1 bg-gray-200 rounded-2xl py-4 text-center">
        <div className="text-xl font-bold text-blue-600">1</div>
        <div className="text-sm">Total Absent</div>
      </div>
    </div>

    {/* <div className="flex flex-wrap gap-6 mt-6 items-center">
      <div className="text-sm font-medium">Assessment</div>
      <div className="text-blue-600 font-bold text-lg">64%</div>

      <div className="text-sm font-medium">Chemistry ▾</div>
      <div className="text-blue-600 font-bold text-lg">72</div>
    </div> */}
  </div>
    ) : (
      <div className="text-gray-500">Loading employee data...</div>
    )}
  </div>
  );
}
