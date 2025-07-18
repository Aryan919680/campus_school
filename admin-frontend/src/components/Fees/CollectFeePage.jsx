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

import { useState, useEffect } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
import ReceiptDownloadButton from "./ReceiptDownloadButton";
const dummyReceipt = {
  receiptNo: "RCPT-20250717-0001",
  student: {
    name: "Aryan Malpotra",
    id: "STU123456",
    course: "B.Tech Computer Science",
    semester: "6",
  },
  breakdown: [
    { name: "Tuition Fee", paid: "40000", due: 0 },
    { name: "Library Fee", paid: "500", due: 0 },
    { name: "Lab Fee", paid: "1500", due: 0 },
  ],
  summary: {
    discountLabel: "1000",
    amountReceived: 42000,
    paymentMode: "Online",
    totalPaid: 42000,
    totalDue: 0,
  },
};

const CollectFeePage = () => {
  const [discount, setDiscount] = useState();
  const [notes, setNotes] = useState("");
  const [amountReceived, setAmountReceived] = useState('');
  const [modeOfPayment, setModeOfPayment] = useState("Cash");
  const [referenceNo, setReferenceNo] = useState("");
  const [fees, setFees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [receiptData, setReceiptData] = useState(dummyReceipt);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const token = userData?.token;
  const campusType = userData.data.campusType;

  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm) getStudents();
    }, 300);

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
  useEffect(() => {
    if (selectedStudent?.courseId) {
      getFees();
    }
  }, [selectedStudent]);

const getFees = async () => {
  try {
    const response = await axios.get(
      campusType === "COLLEGE"
        ? `${API_ENDPOINTS.GET_PAYMENT_FEES()}`
        : `${API_ENDPOINTS.FETCH_FEES()}/fees`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { name: searchTerm },
      }
    );

    const allFeeData = response.data.data;
    if (selectedStudent?.courseId) {
      const studentFeeData = allFeeData.find(
        (entry) => entry.studentId === selectedStudent.studentId
      );

      if (studentFeeData && studentFeeData.fees) {
        const { fees, payments, feeSummary } = studentFeeData;
        const totalPaid = feeSummary?.[0]?.totalPaid || 0;

        const formattedFees = fees.map((fee) => {
          const multiplier = getMultiplier(fee.type);
          const totalFeeAmount = fee.amount * multiplier;

          // Assuming one-time totalPaid to be distributed to the first fee
          let due = totalFeeAmount;
          if (totalPaid > 0) {
            if (totalPaid >= totalFeeAmount) {
              due = 0;
            } else {
              due = totalFeeAmount - totalPaid;
            }
          }

          return {
            name: fee.name,
            due,
            toCollect: due,
            feesId: fee.feesId,
            selected: false,
            courseId: selectedStudent.courseId,
            type: fee.type,
            originalAmount: totalFeeAmount,
          };
        });

        setFees(formattedFees);
      } else {
        setFees([]);
      }
    } else {
      setFees([]);
    }
  } catch (error) {
    console.error("Failed to fetch fees.", error);
  }
};


const getMultiplier = (type) => {
  switch (type) {
    case "SEMESTER":
      return 2;
    case "MONTHLY":
      return 12;
    case "ANNUAL":
    default:
      return 1;
  }
};
console.log(fees)
  const handleSubmitFees = async () => {
  if (!selectedStudent?.studentId) {
    alert("Please select a student before submitting.");
    return;
  }

  const payload = {
    studentId: selectedStudent.studentId,
    amount: amountReceived,
    localTransactionId: "", 
    additional_details: {
      discount,
      notes,
      modeOfPayment,
      referenceNo,
      category: selectedStudent?.category
    },
  };

  try {
    const res = await axios.post(
      `${API_ENDPOINTS.PAYMENT_FEES()}`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  const response = res.data.data;
   const updatedFees = fees.map(fee => ({
  ...fee,
  paidAmount: fee ? amountReceived : 0,
  due : 0
}));

  console.log(response,updatedFees)
      // Map data to receipt format
      const receipt = {
        receiptNo: response.paymentId || "RCPT-20250717-0001",
        student: {
          name: selectedStudent.name || "John Doe",
          id: selectedStudent.studentId,
          course: selectedStudent.courseName || "BCA",
          semester: selectedStudent.semesterName || "5",
        },
        breakdown: updatedFees || [
          { name: "Tuition Fee", paid: 3000, due: 0 },
          { name: "Library Fee", paid: 200, due: 0 },
        ],
        summary: {
          discountLabel: `${discount || 0}`,
          amountReceived: payload.amount,
          paymentMode: response.paymentMode || "Online",
          totalPaid: amountReceived,
          totalDue: 0,
        },
      };

      setReceiptData(receipt);

      // Wait for DOM to update and generate PDF
    
    console.log("Fees submitted successfully:");
    alert("Fees submitted successfully.");
    // Optionally reset form here
  } catch (error) {
    console.error("Error submitting fees:", error);
    alert("Failed to submit fees.");
  }
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
                    setSearchTerm(student.name);
                    setShowSuggestions(false);
                    getFees();
                  }}
                >
                  {student.name} - {student.departmentName} ,{" "}
                  {student.courseName}, {student.semesterName}
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

     <table className="w-full mt-4 border border-gray-300 rounded-md">
  <thead className="bg-gray-100">
    <tr>
      <th className="p-2 text-left">Fee Head</th>
      <th className="p-2 text-left">Type</th>
      <th className="p-2 text-left">Amount (₹)</th>
      <th className="p-2 text-left">×</th>
      <th className="p-2 text-left">Total (₹)</th>
    </tr>
  </thead>
  <tbody>
    {fees.map((fee, index) => {
      const multiplier = getMultiplier(fee.type);
      const total = fee.due * multiplier;

      return (
       <tr key={index} className="border-t">
  <td className="p-2">{fee.name}</td>
  <td className="p-2">{fee.type}</td>
  <td className="p-2 text-left">{fee.originalAmount?.toLocaleString()}</td>
  <td className="p-2 text-left">× {getMultiplier(fee.type)}</td>
  <td className="p-2 text-left font-medium text-red-500">Due: ₹{fee.due.toLocaleString()}</td>
</tr>

      );
    })}
  </tbody>
</table>


    <div className="text-right mt-2 font-bold">
  Grand Total: ₹
  {fees
    .reduce((sum, fee) => sum + fee.due * getMultiplier(fee.type), 0)
    .toLocaleString()}
</div>

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
          <label className="text-sm text-gray-600">Category</label>
          <input
            type="text"
            value={selectedStudent?.category || ""}
            
            className="w-full border p-2 rounded"
          />
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
          {/* <span className="text-gray-500 text-sm">
            Receipt No: <strong>RCPT-20250716-000123</strong>
          </span> */}
          <button   onClick={handleSubmitFees} className="bg-linear-blue text-white px-6 py-2 rounded">
            Submit Payment
          </button>
     {receiptData && (
    <div className="ml-4">
      <ReceiptDownloadButton receipt={receiptData} />
    </div>
  )}
        </div>
      </div>
    </div>
  );
};

export default CollectFeePage;
