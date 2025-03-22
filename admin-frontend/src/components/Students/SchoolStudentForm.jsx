import React, { useState, useEffect } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
import * as XLSX from "xlsx";

const SchoolStudentForm = ({ onClose, onStudentAdded }) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
    
    const [students, setStudents] = useState([]);
    const [step, setStep] = useState(1);
    const [classes, setClasses] = useState([]);
    const [subclasses, setSubclasses] = useState([]);
    const [bulkUpload, setBulkUpload] = useState(false);
    const [file, setFile] = useState(null);
    const [currentStudent, setCurrentStudent] = useState({
        fullName: "", dob: "", aadhaarId: "", contactNumber: "", email: "",
        parentName: "", parentContact: "", address: "", classId: "",
        subClassId: "", admissionNumber: "", rollNumber: ""
    });
    const [error, setError] = useState("");
    const [payloadData, setPayloadData] = useState([]);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.FETCH_CLASS, { headers: { Authorization: `Bearer ${token}` } });
                setClasses(response.data.data.class);

            } catch (error) {
                console.error("Error fetching classes:", error);
            }
        };
        fetchClasses();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentStudent(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    useEffect(() => {
        if (file) {
            handleFileUpload();
        }
    }, [file]);

    const downloadSampleCSV = () => {
        const sampleData = `Full Name,Date of birth,Aadhaar ID,Contact Number,Parent/Guardian Name,Parent Contact,Email Address,Address,Class,Subclass,Admission Number, Roll Number\nJohn Doe,12-03-2000,123456789012,9876543210,Jane Doe,9876543210,john@example.com,123 Street City,1,A,123456789,121`;
        
        const blob = new Blob([sampleData], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement("a");
        a.href = url;
        a.download = "sample_student_data.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
    

    const handleFileUpload = async () => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            const binaryStr = event.target.result;
            const workbook = XLSX.read(binaryStr, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet);
            
            // if (classes.length === 0) {
            //     console.warn("Classes not loaded yet.");
            //     return;
            // }

            const payload = await changePayload(data);
            setPayloadData(payload.students);
        };
        reader.readAsBinaryString(file);
    };

    async function changePayload(studentData) {
        try {
            const updatedStudents = await Promise.all(
                studentData.map(async (student) => {
                  
                    const selectedClass = classes.find(cls => cls.className.toString() === student.Class.toString());
                    if (!selectedClass) {
                        console.warn(`Class ${student.Class} not found for ${student["Full Name"]}`);
                        return null;
                    }

                    const subclass = selectedClass.subClass.find(sub => sub.subClassName.toLowerCase() === student.Subclass.toLowerCase());
                    if (!subclass) {
                        console.warn(`Subclass ${student.Subclass} not found for ${student["Full Name"]}`);
                        return null;
                    }

                    return {
                        name: student["Full Name"],
                        gender: student.Gender || "UNKNOWN",
                        email: student["Email Address"],
                        subclassId: subclass.subClassId,
                        extraDetails: {
                            contactNumber: student["Contact Number"],
                            parentName: student["Parent/Guardian Name"],
                            parentContact: student["Parent Contact"],
                            address: student.Address,
                            admissionNumber: student["Admission Number"],
                            rollNumber: student["Roll Number"]
                        }
                    };
                })
            );
            return { students: updatedStudents.filter(student => student !== null) };
        } catch (error) {
            console.error("Error enriching student data:", error);
            return { students: [] };
        }
    }
   
    const handleClassChange = (e) => {
        const classId = e.target.value;
        setCurrentStudent(prev => ({ ...prev, classId, subClassId: "" }));

        const selectedClass = classes.find(cls => cls.classId === classId);
        if (selectedClass) {
            setSubclasses(selectedClass.subClass);
        }
    };
    const handleBulkUpload = async () => {
        if (!file) {
            setError("Please select a file to upload.");
            return;
        }

        if (payloadData.length === 0) {
            alert("No valid student data found in the file.");
            return;
        }

        try {
            await axios.post(API_ENDPOINTS.REGISTER_STUDENTS, { students: payloadData }, { headers: { Authorization: `Bearer ${token}` } });
            alert("File uploaded successfully!");
            onClose();
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload file.");
        }
    };

    const handleConfirm = async () => {
        if (students.length === 0) {
            alert("No students to save.");
            return;
        }
        const formattedStudents = students.map(student => ({
            name: student.fullName,
            gender: student.gender || "UNKNOWN",
            email: student.email,
            subclassId: student.subClassId,
            extraDetails: {
                contactNumber: student.contactNumber,
                parentName: student.parentName,
                parentContact: student.parentContact,
                address: student.address,
                admissionNumber: student.admissionNumber,
                rollNumber: student.rollNumber
            }
        }));
    
        try {
            await axios.post(API_ENDPOINTS.REGISTER_STUDENTS, { students: formattedStudents }, { headers: { Authorization: `Bearer ${token}` } });
            onClose();
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload file.");
        }
    };
    const handleAddStudent = () => {
        if (!currentStudent.fullName || !currentStudent.classId || !currentStudent.subClassId) {
            alert("Please fill all required fields.");
            return;
        }
        setStudents(prev => [...prev, { ...currentStudent }]);
        setCurrentStudent({
            fullName: "", dob: "", aadhaarId: "", contactNumber: "", email: "",
            parentName: "", parentContact: "", address: "", departmentId: "",
            subClassId: "", classId: "", admissionNumber: "", rollNumber: ""
        });
        setStep(3);
    };
    
    const handleEditStudent = (index) => {
        setCurrentStudent(students[index]);
        setStudents(students.filter((_, i) => i !== index));
        setStep(1);
    };

    const handleRemoveStudent = (index) => {
        setStudents(students.filter((_, i) => i !== index));
    };
    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center h-full w-full bg-black rounded-md bg-opacity-80">
            <div className="bg-gray-800 p-8 rounded-xl w-3/12 text-black">
            {step === 1 && (
                    <>
                        <h2 className="text-lg font-bold text-white">Step 1: Register Student</h2>
                        <div className="mb-4">
                            <label className="text-white mr-2">Single Entry</label>
                            <input type="checkbox" checked={!bulkUpload} onChange={() => setBulkUpload(false)} className="mr-4" />
                            <label className="text-white mr-2">Bulk Upload</label>
                            <input type="checkbox" checked={bulkUpload} onChange={() => setBulkUpload(true)} />
                        </div>
                        {bulkUpload ? (
                            <>
                             <button 
                    onClick={downloadSampleCSV} 
                    className="mb-2 bg-gray-600 px-4 py-2 rounded-md text-white">
                    Download Sample CSV
                </button>
                                <input type="file" onChange={handleFileChange} className="block w-full p-2 border border-gray-300 rounded-md text-white" />
                                <button onClick={handleBulkUpload} className="mt-2 bg-blue-600 px-4 py-2 rounded-md text-white">Upload & Validate</button>
                            </>
                        ) : (
                            <>
                                <input type="text" name="fullName" value={currentStudent.fullName} onChange={handleChange} placeholder="Full Name" className="block w-full p-2 border border-gray-300 rounded-md" />
                                <input type="date" name="dob" value={currentStudent.dob} onChange={handleChange} className="mt-2 block w-full p-2 border border-gray-300 rounded-md" />
                                <input type="text" name="aadhaarId" value={currentStudent.aadhaarId} onChange={handleChange} placeholder="Aadhaar ID" className="mt-2 block w-full p-2 border border-gray-300 rounded-md" />
                                <input type="text" name="contactNumber" value={currentStudent.contactNumber} onChange={handleChange} placeholder="Contact Number" className="mt-2 block w-full p-2 border border-gray-300 rounded-md" />
                                <input type="text" name="parentName" value={currentStudent.parentName} onChange={handleChange} placeholder="Parent/Guardian Name" className="mt-2 block w-full p-2 border border-gray-300 rounded-md" />
                                <input type="text" name="parentContact" value={currentStudent.parentContact} onChange={handleChange} placeholder="Parent Contact" className="mt-2 block w-full p-2 border border-gray-300 rounded-md" />
                                <input type="email" name="email" value={currentStudent.email} onChange={handleChange} placeholder="Email Address" className="mt-2 block w-full p-2 border border-gray-300 rounded-md" />
                                <input type="text" name="address" value={currentStudent.address} onChange={handleChange} placeholder="Address" className="mt-2 block w-full p-2 border border-gray-300 rounded-md" />
                                <div className="flex justify-between mt-4">
                                <button onClick={()=>onClose()} className="mt-4 bg-green-600 px-4 py-2 rounded-md text-white">Close</button>
                                <button onClick={() => setStep(2)} className="mt-4 bg-green-600 px-4 py-2 rounded-md text-white">Next</button>
                                </div>
                            </>
                        )}
                    </>
                )}
                {step === 2 && (
                    <>
                        <h2 className="text-lg font-bold">Step 2: Assign Class and Subclass</h2>
                        <select name="classId" value={currentStudent.classId} onChange={handleClassChange} className="block w-full p-2 border border-gray-300 rounded-md text-black">
                            <option value="">Select Class</option>
                            {classes.map(cls => (
                                <option key={cls.classId} value={cls.classId}>{cls.className}</option>
                            ))}
                        </select>

                        <select name="subClassId" value={currentStudent.subClassId} onChange={handleChange} className="mt-2 block w-full p-2 border border-gray-300 rounded-md text-black">
                            <option value="">Select Subclass</option>
                            {subclasses.map(sub => (
                                <option key={sub.subClassId} value={sub.subClassId}>{sub.subClassName}</option>
                            ))}
                        </select>
                        <input type="text" name="admissionNumber" value={currentStudent.admissionNumber} onChange={handleChange} placeholder="Admission Number" className="mt-2 block w-full p-2 border border-gray-300 rounded-md" />
                        <input type="text" name="rollNumber" value={currentStudent.rollNumber} onChange={handleChange} placeholder="Roll Number" className="mt-2 block w-full p-2 border border-gray-300 rounded-md" />
                        
                        <div className="flex justify-between mt-4">
                            <button onClick={() => setStep(1)} className="bg-gray-600 px-4 py-2 rounded-md text-white">Prev</button>
                            <button onClick={() => handleAddStudent()} className="bg-green-600 px-4 py-2 rounded-md text-white">Next</button>
                        </div>
                    </>
                )}
                {step === 3 && (
                    <>
                        <h2 className="text-lg font-bold text-white">Step 3: Review and Confirm</h2>
                        {students.map((student, index) => {
                            const subclass = subclasses.find(s => s.subclassId === student.subclassId);
                            const subclassName = subclass ? subclass.subclassName : "Unknown Subclass";
                            return (
                                <div key={index} className="flex justify-between bg-gray-700 p-2 rounded-md mt-2 text-white">
                                    <span>{student.fullName} - {subclassName}</span>
                                    <div>
                                        <button onClick={() => handleEditStudent(index)} className="text-blue-400 mr-2">[Edit]</button>
                                        <button onClick={() => handleRemoveStudent(index)} className="text-red-400">[❌]</button>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="flex justify-between mt-4">
                            <button onClick={() => setStep(2)} className="bg-gray-600 px-4 py-2 rounded-md text-white">Edit</button>
                            <button onClick={handleConfirm} className="bg-green-600 px-4 py-2 rounded-md text-white">Confirm & Save</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SchoolStudentForm;
