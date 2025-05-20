import React, { useState, useEffect } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
import CreateTimetable from "./CreateTimetable";
const SchoolAddSubjects = ({ setOpenForm }) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;

    const [classes, setClasses] = useState([]);
    const [subclasses, setSubClasses] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [savedSubjects, setSavedSubjects] = useState([]);
    const [fetchedSubjects, setFetchedSubjects] = useState([]);

    const [subjectData, setSubjectData] = useState({
        classId: "",
        subClassId: "",
        subjectName: "",
        subjectCode: ""
    });
    const [isSemesterLocked, setIsSemesterLocked] = useState(false);

    const [showAssignSubjectPage, setShowAssignSubjectPage] = useState(false);
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.FETCH_CLASS(), {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setClasses(response.data.data.class);
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };
        fetchDepartments();
    }, [token]);

    const handleChange = async (e) => {
        const { name, value } = e.target;

        if (name === "classId") {
            // Fetch existing subjects when semester is selected
            try {
                const response = await axios.get(`${API_ENDPOINTS.GET_SUBJECTS()}?courseId=${value}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFetchedSubjects(response.data.data)
            } catch (error) {
                console.error("Error fetching subjects of semester:", error);
            }

        }

        setSubjectData((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    const handleClassChange = (e) => {
        const classId = e.target.value;
        handleChange(e);
        console.log(classId)
        const selectedSubClass = classes.find(c => c.classId === classId);
        console.log("test", selectedSubClass)
        if (selectedSubClass) {
            setSubClasses(selectedSubClass.subClass);
            setSubjectData((prev) => ({
                ...prev,

            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { classId, subClassId, subjectName, subjectCode } = subjectData;
        if (!classId || !subClassId || !subjectName.trim() || !subjectCode.trim()) {
            alert("Please fill in all fields.");
            return;
        }

        // Check semester consistency
        if (savedSubjects.length > 0) {
            const currentSubClassId = savedSubjects[0].subClassId;
            if (subClassId !== currentSubClassId) {
                alert("All subjects must belong to the same semester.");
                return;
            }
        }

           const trimmedName = subjectName.trim().toLowerCase();
    const trimmedCode = subjectCode.trim().toLowerCase();

    // ✅ Check for duplicates in fetched subjects (from DB)
    const duplicateInFetched = fetchedSubjects.some(
        subj =>
            subj.subjectCode.toLowerCase() === trimmedCode &&
            subj.name.toLowerCase() === trimmedName
    );

           if (duplicateInFetched) {
        alert("Subject with this name or code already exists.");
        return;
    }

    // ✅ Check for duplicates in savedSubjects (already added in UI)
    const duplicateInSaved = savedSubjects.some(
        subj =>
            subj.subjectCode.toLowerCase() === trimmedCode &&
            subj.subjectName.toLowerCase() === trimmedName
    );

    if (duplicateInSaved) {
        alert("This subject is already added.");
        return;
    }


        const newSubject = {
            ...subjectData,
        };

        setSavedSubjects(prev => [...prev, newSubject]);
        setIsSemesterLocked(true);

        // Reset subject name only
        setSubjectData(prev => ({
            ...prev,
            subjectName: ""
        }));
    };


    const handleClearSubjects = () => {
        setSavedSubjects([]);
        setIsSemesterLocked(false);
        setSubjectData({
            classId: "",
            subClassId: "",
            subjectName: "",
            subjectCode: ""
        });
        setSubClasses([]);
    };

    const handleNextPage = async () => {
        const formattedSubjects = savedSubjects.map(subj => ({
            name: subj.subjectName,
            code: subj.subjectCode,
            classId: subj.classId // Replace if you have a different classId source
        }));

        try {
            await axios.post(API_ENDPOINTS.CREATE_SUBJECT(), { subjects: formattedSubjects }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowAssignSubjectPage(true);

        } catch (error) {
            console.error("Error creating subjects:", error);
            alert("Failed to create subjects. Please try again.");
        }
    };


    return (
        <>
            {
                !showAssignSubjectPage &&
                <div className="fixed inset-0 z-50 flex justify-center items-center h-full w-full bg-black bg-opacity-80 backdrop-blur-sm">
                    <div className="bg-gray-800 p-6 rounded-xl w-3/12 text-white space-y-4">
                        <h2 className="text-xl font-semibold">Step 1: Add Subject</h2>

                        <select
                            name="classId"
                            value={subjectData.classId}
                            onChange={handleClassChange}
                            className="block w-full p-2 rounded-md text-black"
                            disabled={isSemesterLocked}
                        >
                            <option value="">Select Class</option>
                            {classes.map(data => (
                                <option key={data.classId} value={data.classId}>
                                    {data.className}
                                </option>
                            ))}
                        </select>



                        <select
                            name="subClassId"
                            value={subjectData.subClassId}
                            onChange={handleChange}
                            className="block w-full p-2 rounded-md text-black"
                            disabled={isSemesterLocked}
                        >
                            <option value="">Select SubClass</option>
                            {subclasses.map(sem => (
                                <option key={sem.subClassId} value={sem.subClassId}>
                                    {sem.subClassName}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            name="subjectCode"
                            value={subjectData.subjectCode}
                            onChange={handleChange}
                            placeholder="Enter Subject Code"
                            className="block w-full p-2 rounded-md text-black"
                        />

                        <input
                            type="text"
                            name="subjectName"
                            value={subjectData.subjectName}
                            onChange={handleChange}
                            placeholder="Enter Subject Name"
                            className="block w-full p-2 rounded-md text-black"
                        />

                        <div className="flex space-x-2">
                            <button
                                onClick={handleSubmit}
                                className="bg-linear-blue hover:bg-blue-600 text-white w-full py-2 rounded-md"
                            >
                                Save Subject
                            </button>

                            {savedSubjects.length > 0 && (
                                <button
                                    onClick={handleClearSubjects}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 rounded-md"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={handleNextPage}
                                disabled={savedSubjects.length === 0 && fetchedSubjects.length === 0}
                                className={`${savedSubjects.length === 0 && fetchedSubjects.length === 0 ? "bg-gray-500 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"
                                    } text-white w-full py-2 rounded-md`}
                            >
                                Next
                            </button>

                        </div>

                       <div className="mt-4">
    <h3 className="text-lg font-medium">Saved Subjects:</h3>
    {savedSubjects.length === 0 ? (
        <p className="text-sm text-gray-300">No subjects added yet.</p>
    ) : (
        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
            {savedSubjects.map((subj, index) => (
                <li key={`new-${index}`}>{subj.subjectName || subj.name} <span className="text-xs text-yellow-300">(new)</span></li>
            ))}
        </ul>
    )}
</div>

                    </div>
                </div>
            }
            {
            showAssignSubjectPage && 
            <CreateTimetable subjectData={subjectData} setShowAssignSubjectPage={setShowAssignSubjectPage} setOpenForm={setOpenForm} />
            
       
            
          }
        </>
    );
};

export default SchoolAddSubjects;
