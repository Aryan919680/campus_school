// import axios from "axios";
// import API_ENDPOINTS from "../../API/apiEndpoints";
// import { useEffect, useState } from "react";

// const CollectFeePage = () => {
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     const token = userData?.token;
//     const campusType = userData.data.campusType;
//     const [students, setStudents] = useState([]);
//     const [fees, setFees] = useState([]);
//     const [selectedStudent, setSelectedStudent] = useState(null);
//     const [paidAmount, setPaidAmount] = useState("");
//     const [paymentMode, setPaymentMode] = useState("");
//     const [chequeNumber, setChequeNumber] = useState("");
//     const [dateOfPayment, setDateOfPayment] = useState("");
//     useEffect(() => {
//         getStudents();
//         getFees();
//     }, []);

//     const getStudents = async () => {
        
//         try {
//             const response = await axios.get(API_ENDPOINTS.GET_STUDENTS_DATA(), {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setStudents(response.data.data);
//         } catch (error) {
//             console.error("Failed to fetch students.", error);
//         }
//     };

//     const getFees = async () => {
//         if(campusType === "COLLEGE"){
//             try {
//                 const response = await axios.get(`${API_ENDPOINTS.SUBMIT_FEES()}/fees`, {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 setFees(response.data.data);
//             } catch (error) {
//                 console.error("Failed to fetch fees.", error);
//             }
//         }else{
//             try {
//                 const response = await axios.get(`${API_ENDPOINTS.FETCH_FEES()}/fees`, {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
              
//                 setFees(response.data.data);
//             } catch (error) {
//                 console.error("Failed to fetch fees.", error);
//             }
//         }
    
//     };

//     const handleStudentChange = (e) => {
//         const student = students.find(s => s.studentId === e.target.value);
//         setSelectedStudent(student);
//     };

//     const totalFee = campusType === "COLLEGE" ? fees.find(f => f.courseId === selectedStudent?.courseId)?.fees?.reduce((sum, fee) => sum + fee.amount * (fee.type === "SEMESTER" ? 2 : 1), 0) || 0 :  
//     fees.find(f => f.classId === selectedStudent?.classId)?.fees?.reduce((sum, fee) => sum + fee.amount * (fee.type === "MONTHLY" ? 12 : 1), 0) || 0;
    
//     const remainingAmount = totalFee - (paidAmount || 0);
     
//     const handleSubmit = async () => {
//         const payload = {
//             studentId: selectedStudent?.studentId,
//             amount:  Number(paidAmount),
//             localTransactionId: "",
//             additional_details: {
//                 test_key: "UTR123456",
//             },
//         };

//         try {
//             const response = await axios.post(`${API_ENDPOINTS.PAYMENT_FEES()}`, payload, {
//                 headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//             });
//             alert("Payment submitted successfully");
//         } catch (error) {
//             console.error("Failed to submit payment.", error);
//         }
//     };

//     return (
//         <div className="p-6 bg-gray-100 w-1/2 mx-auto shadow-md rounded-lg">
//             <h2 className="text-xl font-bold mb-4">Collect Fee Payment</h2>
            
//             <label className="block mb-2">Select Student:</label>
//             <select onChange={handleStudentChange} className="w-full p-2 border rounded mb-4">
//                 <option value="">-- Select Student --</option>
//                 {students && students.map(student => (
//   campusType === "COLLEGE" ? (
//     <option key={student.studentId} value={student.studentId}>
//       {student.name} ({student.departmentName}, {student.courseName})
//     </option>
//   ) : (
//     <option key={student.studentId} value={student.studentId}>
//       {student.name} ({student.className}, {student.subClassName})
//     </option>
//   )
// ))}

//             </select>
            
//             {selectedStudent && (
//                 <>
//                     <p><strong>Student Name:</strong> {selectedStudent.name}</p>
//                     <p><strong>Total Fee:</strong> ₹{totalFee}</p>
//                     <label className="block mt-2">Paid Amount:</label>
//                     <input type="number" value={paidAmount} onChange={e => setPaidAmount(e.target.value)} className="w-full p-2 border rounded mb-2" />
//                     <p><strong>Remaining:</strong> ₹{remainingAmount}</p>
                    
//                     <label className="block mt-2">Payment Mode:</label>
//                     <div className="mb-2">
//                         <label><input type="radio" name="paymentMode" value="Cash" onChange={() => setPaymentMode("Cash")} /> Cash</label>
//                         <label className="ml-4"><input type="radio" name="paymentMode" value="QR" onChange={() => setPaymentMode("QR")} /> QR</label>
//                         <label className="ml-4"><input type="radio" name="paymentMode" value="Cheque" onChange={() => setPaymentMode("Cheque")} /> Cheque</label>
//                     </div>
                    
//                     {paymentMode === "Cheque" && (
//                         <>
//                             <label className="block">Cheque Number:</label>
//                             <input type="text" value={chequeNumber} onChange={e => setChequeNumber(e.target.value)} className="w-full p-2 border rounded mb-2" />
//                         </>
//                     )}
                    
//                     <label className="block">Date of Payment:</label>
//                     <input type="date" value={dateOfPayment} onChange={e => setDateOfPayment(e.target.value)} className="w-full p-2 border rounded mb-2" />
                    
//                     <button onClick={handleSubmit} className="mt-4 bg-linear-blue text-white p-2 rounded w-full">Confirm Payment</button>
//                 </>
//             )}
//         </div>
//     );
// };

// export default CollectFeePage;


import React, { useState,useEffect } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
const CollectFeePage = () => {
//   const [fees, setFees] = useState([
//     { id: 1, name: "Course Fee", due: 12000, toCollect: 12000, selected: false },
//     { id: 2, name: "Admission Fee", due: 5000, toCollect: 5000, selected: false },
//     { id: 3, name: "Library Fee", due: 1200, toCollect: 0, selected: false },
//   ]);

  const [discount, setDiscount] = useState(0);
  const [reasonTag, setReasonTag] = useState("SC");
  const [notes, setNotes] = useState("");
  const [amountReceived, setAmountReceived] = useState(17000);
  const [modeOfPayment, setModeOfPayment] = useState("Cash");
  const [referenceNo, setReferenceNo] = useState("");
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
    const campusType = userData.data.campusType;
  
    const [fees, setFees] = useState([]);
    
     const [searchTerm, setSearchTerm] = useState("");
    const [paidAmount, setPaidAmount] = useState("");
    const [paymentMode, setPaymentMode] = useState("");
    const [chequeNumber, setChequeNumber] = useState("");
    const [dateOfPayment, setDateOfPayment] = useState("");
   
const [students, setStudents] = useState([]);
const [selectedStudent, setSelectedStudent] = useState(null);
const [showSuggestions, setShowSuggestions] = useState(false);
useEffect(() => {
  const handleClickOutside = () => setShowSuggestions(false);
  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);

    useEffect(() => {
  const delayDebounce = setTimeout(() => {
    if (searchTerm) getStudents();
  }, 300); // Debounce delay

  return () => clearTimeout(delayDebounce);
}, [searchTerm]);

const getStudents = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.GET_STUDENTS_DATA(), {
      headers: { Authorization: `Bearer ${token}` },
      params: { search: searchTerm },
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
  const totalSelected = fees.reduce(
    (acc, fee) => acc + (fee.selected ? Number(fee.toCollect) : 0),
    0
  );

  const handleFeeChange = (id, field, value) => {
    setFees((prevFees) =>
      prevFees.map((fee) =>
        fee.id === id ? { ...fee, [field]: field === "selected" ? value : Number(value) } : fee
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-6">
        <div className="flex justify-between">
 <h2 className="text-2xl font-bold mb-4">Collect Fee</h2>
<div className="mb-4 w-full sm:w-1/2 relative">
  <div className="relative">
    <input
      type="text"
      placeholder="Search Student..."
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setShowSuggestions(true);
      }}
      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <span className="absolute left-3 top-2.5 text-gray-400 pointer-events-none">
      🔍
    </span>
  </div>

  {showSuggestions && students.length > 0 && (
    <ul className="absolute z-10 bg-white border border-gray-300 w-full max-h-60 overflow-y-auto rounded-md mt-1 shadow">
      {students.map((student) => (
        <li
          key={student.id}
          className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
          onClick={() => {
            setSelectedStudent(student);
            setSearchTerm(student.name); // or student.fullName based on API
            setShowSuggestions(false);
          }}
        >
          {student.name} - {student.departmentName} , {student.courseName}, {student.semesterName}
        </li>
      ))}
    </ul>
  )}
</div>

        </div>
     
    <div className="grid grid-cols-4 gap-4 mb-6">
  <div>
    <label className="text-sm text-gray-600">Student Name</label>
    <input
      type="text"
      value={selectedStudent?.name || ""}
      readOnly
      className="w-full border p-2 rounded"
    />
  </div>
  <div>
    <label className="text-sm text-gray-600">Student ID</label>
    <input
      type="text"
      value={selectedStudent?.studentId || ""}
      readOnly
      className="w-full border p-2 rounded"
    />
  </div>
  <div>
    <label className="text-sm text-gray-600">Course</label>
    <input
      type="text"
      value={selectedStudent?.courseName || ""}
      readOnly
      className="w-full border p-2 rounded"
    />
  </div>
  <div>
    <label className="text-sm text-gray-600">Semester</label>
    <input
      type="text"
      value={selectedStudent?.semesterName || ""}
      readOnly
      className="w-full border p-2 rounded"
    />
  </div>
</div>


      <button className="bg-green-600 text-white px-4 py-2 rounded mb-4">+ Add Fee Head</button>

      <table className="w-full mb-6 border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Select</th>
            <th className="p-2 text-left">Fee Head</th>
            <th className="p-2 text-right">Due (₹)</th>
            <th className="p-2 text-right">To Collect (₹)</th>
          </tr>
        </thead>
        <tbody>
          {/* {fees.map((fee) => (
            <tr key={fee.id}>
              <td className="p-2">
                <input
                  type="checkbox"
                  checked={fee.selected}
                  onChange={(e) => handleFeeChange(fee.id, "selected", e.target.checked)}
                />
              </td>
              <td className="p-2">{fee.name}</td>
              <td className="p-2 text-right">{fee.due.toLocaleString()}</td>
              <td className="p-2 text-right">
                <input
                  type="number"
                  className="w-24 border p-1 rounded text-right"
                  value={fee.toCollect}
                  onChange={(e) => handleFeeChange(fee.id, "toCollect", e.target.value)}
                />
              </td>
            </tr>
          ))} */}
        </tbody>
      </table>

      <div className="text-right font-semibold mb-6">Total Selected: ₹{totalSelected.toLocaleString()}</div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-sm text-gray-600">Discount (₹)</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Reason Tag</label>
          <select
            value={reasonTag}
            onChange={(e) => setReasonTag(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="OBC">OBC</option>
            <option value="GEN">General</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-600">Notes</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes"
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 items-end">
        <div>
          <label className="text-sm text-gray-600">Amount Received (₹)</label>
          <input
            type="number"
            value={amountReceived}
            onChange={(e) => setAmountReceived(Number(e.target.value))}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Mode of Payment</label>
          <select
            value={modeOfPayment}
            onChange={(e) => setModeOfPayment(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-600">Reference No.</label>
          <input
            type="text"
            value={referenceNo}
            onChange={(e) => setReferenceNo(e.target.value)}
            placeholder="Optional"
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">
            Receipt No: <strong>RCPT-20250716-000123</strong>
          </span>
          <button className="bg-blue-600 text-white px-6 py-2 rounded">
            Submit Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectFeePage;
