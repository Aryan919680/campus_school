import React, { useEffect, useState } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
import CreateTimetable from "./CreateTimetable";


export default function AssignTeacher({ subjectData, setShowAssignSubjectPage,setOpenForm }){
      const userData = JSON.parse(localStorage.getItem("userData"));
        const token = userData?.token;
        const campusType = userData?.data.campusType ;
        const [teachers, setTeachers] = useState([]);
        const [subjects, setSubjects] = useState([]);
           const [formData, setFormData] = useState({
                subjectId: "",
                employeeId: ""
            });
        const [showTimetablePage, setShowTimetablePage] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [teacherRes, subjectRes] = await Promise.all([
                    axios.get(API_ENDPOINTS.FETCH_ALL_TEACHERS(), {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${API_ENDPOINTS.GET_SUBJECTS()}?${campusType.toLowerCase() ==="college"? subjectData.courseId: subjectData.classId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);
                setTeachers(teacherRes.data.data);
                setSubjects(subjectRes.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [token, subjectData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAssign = async () => {
        const { subjectId, employeeId } = formData;

        if (!subjectId || !employeeId) {
            alert("Please select both subject and teacher.");
            return;
        }

        if(campusType.toLowerCase() ==="college"){
            var payload = {
                employeeId,
                role: "TEACHER",
                semesters: [subjectData.semesterId], // assuming courseId is the subClass
                subjectId
            };
        }else{
            var payload = {
                employeeId,
                role: "TEACHER",
                subClasses: [subjectData.subClassId], // assuming courseId is the subClass
                subjectId
            };
        }
      

        try {
            await axios.post(API_ENDPOINTS.Register_Role(), payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Subject assigned successfully.");
        } catch (error) {
            console.error("Error assigning subject:", error);
            alert("Failed to assign subject.");
        }
    };

    const handleNextPage = () => {
        setShowTimetablePage(true);
    // setShowAssignSubjectPage(false);
    };

    const onClose = () =>{
        setShowAssignSubjectPage(false);
        setShowTimetablePage(false);
        setOpenForm(false);
    }
    return (
<>
{
    !showTimetablePage &&
    <div className="fixed inset-0 z-50 flex justify-center items-center h-full w-full bg-black bg-opacity-80 backdrop-blur-sm">
            <div className="bg-gray-800 p-6 rounded-xl w-3/12 text-white space-y-4">
                <h2 className="text-xl font-semibold">Step 2: Assign Subjects</h2>
  <div className="grid grid-cols-2 gap-4">
                <select name="subjectId" value={formData.subjectId} onChange={handleChange} className="p-2 rounded-md text-black">
                        <option value="">Select Subject</option>
                        {subjects.map(subj => (
                            <option key={subj.subjectId} value={subj.subjectId}>{subj.name}</option>
                        ))}
                    </select>

                    <select name="employeeId" value={formData.employeeId} onChange={handleChange} className="p-2 rounded-md text-black">
                        <option value="">Select Teacher</option>
                        {teachers.map(teach => (
                            <option key={teach.employeeId} value={teach.employeeId}>{teach.name}</option>
                        ))}
                    </select>
            </div>
            <button
                    onClick={handleAssign}
                    className="mt-4 bg-linear-blue hover:bg-blue-600 text-white w-full py-2 rounded-md"
                >
                    Assign Subject
                </button>
                <button
                    onClick={handleNextPage}
                    className="mt-4 bg-yellow-500 hover:bg-blue-600 text-white w-full py-2 rounded-md"
                >
                    Next
                </button>
            </div>
       
        </div>
}

        {
            showTimetablePage && (<CreateTimetable subjectData ={subjectData} onClose={onClose}/>)
        }
        </>
    )
}