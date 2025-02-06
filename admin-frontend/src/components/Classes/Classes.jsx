import React, { useState, useEffect, useCallback, useMemo } from "react";
import ClassForm from "./ClassForm";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
import ListTable from "../List/ListTable"; // Assuming ListTable is in the same folder
import EditClass from "./EditClass";

const Classes = () => {
  const [openForm, setOpenForm] = useState(false);
  const [formValues, setFormValues] = useState({ name: "", code: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [classes, setClasses] = useState([]);
  const[isEdit,setIsEdit] = useState(false);
  const [selectedClassForEdit, setSelectedClassForEdit] = useState([]); 
  const userData = JSON.parse(localStorage.getItem("userData"));
  const parsedData = userData;
  const token = parsedData.token;

  useEffect(() => {
    const fetchClassOptions = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.FETCH_CLASS, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data.class);
        const classes = response.data.data.class;
        setClasses(classes); // Only update classes if data changes
        console.log(classes)
      } catch (error) {
        console.error("Error fetching class options:", error.response?.data || error.message);
        alert("Failed to fetch class data. Please try again.");
      }
    };

    if (classes.length === 0) {  
      fetchClassOptions();
    }
  }, [token, classes]);
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
    console.log(classToEdit)
    setSelectedClassForEdit(classToEdit); 
    console.log(selectedClassForEdit) 
    setIsEdit(true); 
  };
  console.log(selectedClassForEdit) 

  const handleDelete = ()=>{
    
  }
  const showDataList = useMemo(() => {
    return classes.map((classData) => (
      <tr key={classData.classId}>
        <td className="text-center">{classData.className}</td>
        <td className="text-center"> 
        {classData.subClass.map((subsection) => subsection.subClassName).join(", ")}
          </td>
        <td className="text-center">{classData.teacher}</td>
        <td className="text-center">
          {/* Add Edit and Delete buttons */}
          <button
            onClick={() => handleEdit(classData.classId)}
            className="bg-yellow-500 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(classData.classId)}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded"
          >
            Delete
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
    </div>
  );
};

export default Classes;
