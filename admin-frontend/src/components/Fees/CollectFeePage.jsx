import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
import { useEffect, useState } from "react";

const CollectFeePage = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
    const campusType = userData.data.campusType;
    const [students, setStudents] = useState([]);
    const [fees, setFees] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [paidAmount, setPaidAmount] = useState("");
    const [paymentMode, setPaymentMode] = useState("");
    const [chequeNumber, setChequeNumber] = useState("");
    const [dateOfPayment, setDateOfPayment] = useState("");
    useEffect(() => {
        getStudents();
        getFees();
    }, []);

    const getStudents = async () => {
        
        try {
            const response = await axios.get(API_ENDPOINTS.GET_STUDENTS_DATA(), {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStudents(response.data.data);
        } catch (error) {
            console.error("Failed to fetch students.", error);
        }
    };

    const getFees = async () => {
        if(campusType === "COLLEGE"){
            try {
                const response = await axios.get(`${API_ENDPOINTS.SUBMIT_FEES()}/fees`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFees(response.data.data);
            } catch (error) {
                console.error("Failed to fetch fees.", error);
            }
        }else{
            try {
                const response = await axios.get(`${API_ENDPOINTS.FETCH_FEES()}/fees`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
              
                setFees(response.data.data);
            } catch (error) {
                console.error("Failed to fetch fees.", error);
            }
        }
    
    };

    const handleStudentChange = (e) => {
        const student = students.find(s => s.studentId === e.target.value);
        setSelectedStudent(student);
    };

    const totalFee = campusType === "COLLEGE" ? fees.find(f => f.courseId === selectedStudent?.courseId)?.fees?.reduce((sum, fee) => sum + fee.amount * (fee.type === "SEMESTER" ? 2 : 1), 0) || 0 :  
    fees.find(f => f.classId === selectedStudent?.classId)?.fees?.reduce((sum, fee) => sum + fee.amount * (fee.type === "MONTHLY" ? 12 : 1), 0) || 0;
    
    const remainingAmount = totalFee - (paidAmount || 0);
     
    const handleSubmit = async () => {
        const payload = {
            studentId: selectedStudent?.studentId,
            amount:  Number(paidAmount),
            localTransactionId: "",
            additional_details: {
                test_key: "UTR123456",
            },
        };

        try {
            const response = await axios.post(`${API_ENDPOINTS.PAYMENT_FEES()}`, payload, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });
            alert("Payment submitted successfully");
        } catch (error) {
            console.error("Failed to submit payment.", error);
        }
    };


    return (
        <div className="p-6 bg-gray-100 w-1/2 mx-auto shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">Collect Fee Payment</h2>
            
            <label className="block mb-2">Select Student:</label>
            <select onChange={handleStudentChange} className="w-full p-2 border rounded mb-4">
                <option value="">-- Select Student --</option>
                {students.map(student => (
                //   campusType === "COLLEGE" ?  <option key={student.studentId} value={student.studentId}>{student.name} ({student.departmentName}, {student.courseName}, {student})</option>
                //   : <option key={student.studentId} value={student.studentId}>{student.name} ({student.className, student.subClassName})</option>
                <option key={student.studentId} value={student.studentId}>{student.name} ({student.departmentName}, {student.courseName}, {student.semesterName})</option>
                ))}
            </select>
            
            {selectedStudent && (
                <>
                    <p><strong>Student Name:</strong> {selectedStudent.name}</p>
                    <p><strong>Total Fee:</strong> ₹{totalFee}</p>
                    <label className="block mt-2">Paid Amount:</label>
                    <input type="number" value={paidAmount} onChange={e => setPaidAmount(e.target.value)} className="w-full p-2 border rounded mb-2" />
                    <p><strong>Remaining:</strong> ₹{remainingAmount}</p>
                    
                    <label className="block mt-2">Payment Mode:</label>
                    <div className="mb-2">
                        <label><input type="radio" name="paymentMode" value="Cash" onChange={() => setPaymentMode("Cash")} /> Cash</label>
                        <label className="ml-4"><input type="radio" name="paymentMode" value="QR" onChange={() => setPaymentMode("QR")} /> QR</label>
                        <label className="ml-4"><input type="radio" name="paymentMode" value="Cheque" onChange={() => setPaymentMode("Cheque")} /> Cheque</label>
                    </div>
                    
                    {paymentMode === "Cheque" && (
                        <>
                            <label className="block">Cheque Number:</label>
                            <input type="text" value={chequeNumber} onChange={e => setChequeNumber(e.target.value)} className="w-full p-2 border rounded mb-2" />
                        </>
                    )}
                    
                    <label className="block">Date of Payment:</label>
                    <input type="date" value={dateOfPayment} onChange={e => setDateOfPayment(e.target.value)} className="w-full p-2 border rounded mb-2" />
                    
                    <button onClick={handleSubmit} className="mt-4 bg-linear-blue text-white p-2 rounded w-full">Confirm Payment</button>
                </>
            )}
        </div>
    );
};

export default CollectFeePage;