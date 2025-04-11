import React, { useEffect, useState } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";

const timeSlots = [
    { label: "09:00 - 10:00", from: "9", to: "10" },
    { label: "10:00 - 11:00", from: "10", to: "11" },
    { label: "11:00 - 12:00", from: "11", to: "12" },
    { label: "12:00 - 01:00", from: "12", to: "13" },
    { label: "01:00 - 02:00", from: "13", to: "14" },
    { label: "02:00 - 03:00", from: "14", to: "15" },
    { label: "03:00 - 04:00", from: "15", to: "16" }
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const CreateTimetable = ({ subjectData }) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
    const campusType = userData?.data.campusType ;
    const [subjects, setSubjects] = useState([]);
    const [timetable, setTimetable] = useState([]);
    const [formData, setFormData] = useState({
        day: "",
        timeSlot: "",
        subjectId: "",
        employeeId: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [subjectRes] = await Promise.all([
                    axios.get(`${API_ENDPOINTS.GET_SUBJECTS()}?${campusType.toLowerCase() ==="college"? subjectData.courseId: subjectData.classId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);
                setSubjects(subjectRes.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [token, subjectData]);
console.log(subjectData)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAssign = () => {
        const { day, timeSlot, subjectId } = formData;

        if (!day || !timeSlot || !subjectId ) {
            alert("Please fill all fields.");
            return;
        }

        const exists = timetable.some(entry => entry.day === day && entry.timeSlot === timeSlot);
        if (exists) {
            alert("Time slot already assigned for this day.");
            return;
        }

        const subject = subjects.find(s => s.subjectId === subjectId);
        const slot = timeSlots.find(s => s.label === timeSlot);

        setTimetable(prev => [...prev, {
            subjectId,
            from: slot.from,
            to: slot.to,
            day: days.indexOf(day) + 1,
            name: `Period ${prev.length + 1}`,
            subjectName: subject.subjectName,
            timeSlot: timeSlot
        }]);

        setFormData({ day: "", timeSlot: "", subjectId: "" });
    };

    const handleSaveTimetable = async () => {
        if(campusType.toLowerCase === "college"){
            var payload = {
                records: timetable.map(entry => ({
                    subjectId: entry.subjectId,
                    from: entry.from,
                    to: entry.to,
                    day: entry.day,
                    name: entry.name
                })),
                
                semesterId: subjectData.semesterId // assumed subClassId = semesterId
            };
        }else{
            var payload = {
                records: timetable.map(entry => ({
                    subjectId: entry.subjectId,
                    from: entry.from,
                    to: entry.to,
                    day: entry.day,
                    name: entry.name
                })),
                
                subClassId: subjectData.subClassId // assumed subClassId = semesterId
            };
        }
       

        try {
            await axios.post(API_ENDPOINTS.CREATE_TIMETABLE(), payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Timetable saved successfully!");
        } catch (error) {
            console.error("Error saving timetable:", error);
            alert("Error saving timetable.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center h-full w-full bg-black bg-opacity-80 backdrop-blur-sm">
            <div className="bg-gray-800 p-6 rounded-xl w-7/12 mx-auto text-white">
                <h2 className="text-xl font-bold mb-4">Step 2: Create Timetable</h2>

                <div className="grid grid-cols-2 gap-4">
                    <select name="day" value={formData.day} onChange={handleChange} className="p-2 rounded-md text-black">
                        <option value="">Select Day</option>
                        {days.map(day => <option key={day} value={day}>{day}</option>)}
                    </select>

                    <select name="timeSlot" value={formData.timeSlot} onChange={handleChange} className="p-2 rounded-md text-black">
                        <option value="">Select Time Slot</option>
                        {timeSlots.map(slot => <option key={slot.label} value={slot.label}>{slot.label}</option>)}
                    </select>

                    <select name="subjectId" value={formData.subjectId} onChange={handleChange} className="p-2 rounded-md text-black">
                        <option value="">Select Subject</option>
                        {subjects.map(subj => (
                            <option key={subj.subjectId} value={subj.subjectId}>{subj.name}</option>
                        ))}
                    </select>

                  
                </div>

                <button
                    onClick={handleAssign}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded-md"
                >
                    Assign to Timetable
                </button>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Assigned Timetable:</h3>
                    {timetable.length === 0 ? (
                        <p className="text-sm text-gray-300">No slots assigned yet.</p>
                    ) : (
                        <>
                            <table className="w-full mt-3 text-sm text-white border border-gray-700">
                                <thead>
                                    <tr className="bg-gray-700">
                                        <th className="p-2 border">Day</th>
                                        <th className="p-2 border">Time Slot</th>
                                        <th className="p-2 border">Subject</th>
                                        <th className="p-2 border">Teacher</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {timetable.map((entry, idx) => (
                                        <tr key={idx} className="text-center border-t border-gray-600">
                                            <td className="p-2 border">{days[entry.day - 1]}</td>
                                            <td className="p-2 border">{entry.timeSlot}</td>
                                            <td className="p-2 border">{entry.subjectName}</td>
                                            <td className="p-2 border">{entry.teacherName}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <button
                                onClick={handleSaveTimetable}
                                className="mt-4 bg-green-500 hover:bg-green-600 w-full py-2 rounded-md"
                            >
                                Save Timetable
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateTimetable;
