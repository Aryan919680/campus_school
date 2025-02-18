import React, { useState, useEffect, useCallback, useMemo } from "react";
import ClassForm from "./ClassForm";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
import ListTable from "../List/ListTable";
import EditClass from "./EditClass";
import CheckFees from "./CheckFees";

const Classes = () => {
  const [openForm, setOpenForm] = useState(false);
  const [formValues, setFormValues] = useState({ name: "", code: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [classes, setClasses] = useState([]);
  const[isEdit,setIsEdit] = useState(false);
  const [selectedClassForEdit, setSelectedClassForEdit] = useState([]); 
  const [isClassFees,setIsClassFees] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const parsedData = userData;
  const token = parsedData.token;

  const fetchClassOptions = useCallback(async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.FETCH_CLASS, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      let classes = response.data.data.class;
      classes.sort((a, b) => {
        const numA = parseInt(a.className.match(/\d+/)?.[0] || 0, 10); 
        const numB = parseInt(b.className.match(/\d+/)?.[0] || 0, 10);
        return numA - numB; 
      });
  
      setClasses(classes); 
    } catch (error) {
      console.error("Error fetching class options:", error.response?.data || error.message);
      alert("Failed to fetch class data. Please try again.");
    }
  }, [token]);
  
  useEffect(() => {
    fetchClassOptions();
  }, [fetchClassOptions]);
  


  const onClose = useCallback(() => {
    setOpenForm(false);
    setErrorMessage("");
  }, []);

  const handleForm = useCallback(() => {
    setOpenForm(true);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  }, []);

  const handleEdit = (classId) => {
    const classToEdit = classes.find((classData) => classData.classId === classId);
    setSelectedClassForEdit(classToEdit); 
    setIsEdit(true); 
  };

  const handleDelete = async (classId) => {
  
    try {
      const response = await axios.delete(
        `${API_ENDPOINTS.DELETE_CLASS}/${classId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        alert("Class deleted successfully!");
        setClasses(classes.filter((classData) => classData.classId !== classId));
      }
    } catch (error) {
      console.error("Error deleting class:", error.response?.data || error.message);
      alert("Failed to delete class. Please try again.");
    }
  };
  const handleCheckFees = (classId) => {
    alert(`Checking fees for Class ID: ${classId}`);
    setSelectedClassId(classId);
    setIsClassFees(true);
    // You can replace this with actual logic to fetch and display fee details
  };
  
  const showDataList = useMemo(() => {
    return classes.map((classData) => (
      <tr key={classData.classId}>
        <td className="text-center">{classData.className}</td>
        <td className="text-center"> 
        {classData.subClass.map((subsection) => subsection.subClassName).join(", ")}
          </td>
        <td className="text-center">{classData.teacher}</td>
        <td className="text-center">

        {/* <button
          onClick={() => handleCheckFees(classData.classId)}
          className="bg-yellow-500 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Check Fees
        </button> */}
          {/* <button
            onClick={() => handleEdit(classData.classId)}
            className="bg-yellow-500 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Edit
          </button> */}
          <button
            onClick={() => handleDelete(classData.classId)}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded"
          >
            Delete Class
          </button>
        

        </td>
      </tr>
    ));
  }, [classes]);

  return (
    <div className="bg-white p-8 rounded-md w-full">
      <div className="flex items-center justify-between pb-6 flex-wrap gap-2">
        <h2 className="text-gray-600 font-semibold text-2xl">
          Class, Section, and Fee Management
        </h2>
        <div className="flex justify-center items-center">
          <button
            onClick={handleForm}
            className="bg-linear-blue text-white font-bold py-2 px-4 rounded w-full md:w-fit"
          >
            Add New Classes and Sections
          </button>
        </div>
      </div>

      {errorMessage && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

      {openForm && (
        <ClassForm
          formValues={formValues}
          onClose={onClose}
          handleInputChange={handleInputChange}
          errorMessage={errorMessage}
          refreshClasses={fetchClassOptions}
        />
      )}

      <ListTable
        ListName="Class Name"
        ListRole="Sections"
        ListDepartment="Teacher"
        ListAction="Actions"
        showDataList={showDataList} // Pass the memoized rows to ListTable
      />
      {
        isEdit && (
            <EditClass
            selectedClassForEdit={selectedClassForEdit}
          onClose={onClose}
          handleInputChange={handleInputChange}
          errorMessage={errorMessage}
          isEdit={true} />
        )
      }
      
{/* {isClassFees && (<CheckFees setIsClassFees={setIsClassFees} classId={selectedClassId} />)} */}
      
    </div>
  );
};

export default Classes;
