import { useEffect, useState } from "react";
import CollegeCreateExamForm from "./CollegeCreateExamForm";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
import SchoolCreateExamForm from "./SchoolCreateExamForm";

export default function ExamPage (){
    const [openForm, setOpenForm] = useState(false);
    const [examData, setExamData] = useState([]);
     const userData = JSON.parse(localStorage.getItem("userData"));
     const campusType = userData.data.campusType;
     console.log(campusType)
      const token = userData?.token;
      const handleForm = () => {
       setOpenForm(true);
       };

   useEffect(() => {
  const getExamData = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.CREATE_EXAM(), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      setExamData(response.data.data);
    } catch (error) {
      console.error("Error fetching exam data:", error);
    }
  };

  getExamData();
}, [openForm]);
     
 const onClose = () =>{
   setOpenForm(false);
 }
    return(
      <>
      {   !openForm && 
 <div className="bg-white p-8 rounded-md w-full">
             <div className="flex items-center justify-between pb-6 flex-wrap gap-2">
               <h2 className="text-gray-600 font-semibold text-2xl">Exams</h2>
               <div className="flex justify-center items-center">
                 <button
                   onClick={handleForm}
                   className="bg-linear-blue text-white font-bold py-2 px-4 rounded w-full md:w-fit"
                 >
                   Create Exam
                 </button>
               </div>
             </div>
       
        
       
             {/* Grid of Notices */}
            {/* Grid of Exams */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
  {examData.length > 0 ? (
    examData.map((exam) => (
      <div
        key={exam.examId}
        className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-lg transition-all flex flex-col justify-between"
      >
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">{exam.title}</h3>
          <p className="text-gray-600 mb-2">{exam.description}</p>
          <p className="text-sm text-gray-500">
            <strong>Start At:</strong> {new Date(exam.startAt).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Duration:</strong> {exam.timeAllotted} mins
          </p>
          <p className="text-sm text-gray-500">
            <strong>Status:</strong> {exam.active ? "Active" : "Inactive"}
          </p>
        </div>
        <div className="mt-4 flex justify-end">
          {/* <button
            onClick={() => alert(`Edit exam ${exam.examId}`)} // Replace with real handler
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-md text-sm"
          >
            Edit
          </button> */}
        </div>
      </div>
    ))
  ) : (
    <div className="col-span-full text-center text-gray-500">No exams found.</div>
  )}
</div>
           </div>
      }
     
            {openForm && campusType.toLowerCase() === "college" && (
               <CollegeCreateExamForm onClose={onClose}
               
               />
             )}
              {openForm && campusType.toLowerCase() === "school" && (
               <SchoolCreateExamForm onClose={onClose}
               
               />
             )}
      </>
        
    )
}