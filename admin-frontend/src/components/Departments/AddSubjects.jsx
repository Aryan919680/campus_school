import React, { useState, useEffect } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";

const AddSubjects = ({ openFeesPage, closeSubjectPage }) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
    const storedCourseId = localStorage.getItem("courseId");

    const [savedSubjects, setSavedSubjects] = useState([]);
    const [fetchedSubjects, setFetchedSubjects] = useState([]);
    const [isSemesterLocked, setIsSemesterLocked] = useState(false);
    const [showAssignSubjectPage, setShowAssignSubjectPage] = useState(false);

    const [subjectData, setSubjectData] = useState({
        courseId: storedCourseId || "",
        semesterId: "",
        subjectName: "",
        subjectCode: ""
    });

    useEffect(() => {
        const fetchSubjectsAndSemesters = async () => {
            try {
                // Fetch existing subjects
                const response = await axios.get(`${API_ENDPOINTS.GET_SUBJECTS()}?courseId=${storedCourseId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFetchedSubjects(response.data.data || []);

                // Optional: Set semesterId from existing subjects (assume all are same)
                if (response.data.data.length > 0) {
                    setSubjectData(prev => ({
                        ...prev,
                        semesterId: response.data.data[0].semesterId
                    }));
                }

            } catch (error) {
                console.error("Error fetching subjects:", error);
            }
        };

        if (storedCourseId) {
            fetchSubjectsAndSemesters();
        }
    }, [storedCourseId, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSubjectData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { courseId, semesterId, subjectName, subjectCode } = subjectData;

        if (!courseId || !subjectName.trim() || !subjectCode.trim()) {
            alert("Please fill in all fields.");
            return;
        }

        const trimmedName = subjectName.trim().toLowerCase();
        const trimmedCode = subjectCode.trim().toLowerCase();

        const duplicateInFetched = fetchedSubjects.some(
            subj =>
                subj.subjectCode.toLowerCase() === trimmedCode &&
                subj.name.toLowerCase() === trimmedName
        );

        if (duplicateInFetched) {
            alert("Subject with this name or code already exists.");
            return;
        }

        const duplicateInSaved = savedSubjects.some(
            subj =>
                subj.subjectCode.toLowerCase() === trimmedCode &&
                subj.subjectName.toLowerCase() === trimmedName
        );

        if (duplicateInSaved) {
            alert("This subject is already added.");
            return;
        }

        const newSubject = { ...subjectData };

        setSavedSubjects(prev => [...prev, newSubject]);
        setIsSemesterLocked(true);

        setSubjectData(prev => ({
            ...prev,
            subjectName: "",
            subjectCode: ""
        }));
    };

    const handleClearSubjects = () => {
        setSavedSubjects([]);
        setIsSemesterLocked(false);
        setSubjectData({
            courseId: storedCourseId || "",
            semesterId: "",
            subjectName: "",
            subjectCode: ""
        });
    };

    const handleNextPage = async () => {
        const formattedSubjects = savedSubjects.map(subj => ({
            name: subj.subjectName,
            code: subj.subjectCode,
            courseId: subj.courseId
        }));
        if(formattedSubjects.length > 0){
         try {
            await axios.post(API_ENDPOINTS.CREATE_SUBJECT(), { subjects: formattedSubjects }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Subjects added successfully");
            setShowAssignSubjectPage(true);
            openFeesPage();
        } catch (error) {
            console.error("Error creating subjects:", error);
            alert("Failed to create subjects. Please try again.");
        }
        }else{
          openFeesPage();
        }
       
    };

    return (
        <>
            {!showAssignSubjectPage &&
        <div className="fixed inset-0 z-50 flex justify-center items-center h-full w-full bg-black rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-80 border border-gray-100">
                    <div className="bg-gray-800 p-6 rounded-xl w-3/12 text-white space-y-4">
                        <h2 className="text-xl font-semibold">Add Subject</h2>

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
                                Add Subject
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
                               <button
                                onClick={closeSubjectPage}
                                className="bg-red-600 hover:bg-red-500 hover:bg-blue-600 text-white w-full py-2 rounded-md"
                            >
                                Previous
                            </button>

                        <button
                            onClick={handleNextPage}
                            disabled={savedSubjects.length === 0 && fetchedSubjects.length === 0}
                            className={`${
                                savedSubjects.length === 0 && fetchedSubjects.length === 0
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : "bg-green-600 "
                            } text-white w-full py-2 rounded-md`}
                        >
                            Next
                        </button>

                        <div className="mt-4">
                            <h3 className="text-lg font-medium">Saved Subjects:</h3>
                            {savedSubjects.length === 0 ? (
                                <p className="text-sm text-gray-300">No subjects added yet.</p>
                            ) : (
                                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                                    {savedSubjects.map((subj, index) => (
                                        <li key={`new-${index}`}>{subj.subjectCode}-{subj.subjectName} <span className="text-xs text-yellow-300">(new)</span></li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            }

        </>
    );
};

export default AddSubjects;
