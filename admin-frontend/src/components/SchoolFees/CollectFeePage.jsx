

import { useState, useEffect } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
import ReceiptDownloadButton from "../CollegeFees/ReceiptDownloadButton";


const CollectFeePage = () => {
  const [notes, setNotes] = useState("");
  const [modeOfPayment, setModeOfPayment] = useState("Cash");
  const [referenceNo, setReferenceNo] = useState("");
  const [fees, setFees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const token = userData?.token;
  const campusType = userData.data.campusType;
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [currentFeeIndex, setCurrentFeeIndex] = useState(null);
  const [feePaymentAmount, setFeePaymentAmount] = useState('');
  const [loadingFees, setLoadingFees] = useState(false);
  const [newPaidEntries, setNewPaidEntries] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [feeSummary, setFeeSummary] = useState([]);
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
    if (selectedStudent) {
      getFees();
    }
  }, [selectedStudent]);

  const getFees = async () => {
    if (!selectedStudent?.studentId) return;

    setLoadingFees(true); 
    try {
      const response = await axios.get(`${API_ENDPOINTS.GET_PAYMENT_FEES_SCHOOL()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { name: searchTerm },
        }
      );
 
      console.log(response.data)
      const allFeeData = response.data;
      const studentFeeData = allFeeData.find(
        (entry) => entry.studentId === selectedStudent.studentId
      );

      if (studentFeeData) {
        const {fees, feeSummary} =  studentFeeData;
        setFees(fees);
        setFeeSummary(feeSummary[0]);
        
      } else {
        setFees([]); // No data found for this student
      }
    } catch (error) {
      console.error("Failed to fetch fees.", error);
      setFees([]); // Set fees to empty if there's an error
    } finally {
      setLoadingFees(false); // Stop loading state
    }
  };

// ✅ handleSubmitFees
const handleSubmitFees = async () => {
  try {
    // filter only months where user clicked Pay
    const selectedFees = fees
      .filter((_, index) => newPaidEntries[index] > 0)
      .map((fee, index) => {
        const paidAmount = newPaidEntries[index];

        return {
          feesId: fee.feesId,
          classId: fee.classId,
          month: fee.month,
          feeAmount: fee.feeAmount,
          paidAmount,
          due: Math.max(fee.feeAmount - paidAmount, 0),
        };
      });

    if (selectedFees.length === 0) {
      alert("Please select at least one fee to pay.");
      return;
    }

    // total amount being paid now
    const totalAmount = selectedFees.reduce(
      (sum, f) => sum + f.paidAmount,
      0
    );

    const payload = {
      campusId: userData.data.campusId, // ✅ from logged-in user
      studentId: selectedStudent.studentId,
      amount: totalAmount,
      localTransactionId: `txn-${Date.now()}`, // simple txn id
      additional_details: {
        paymentMode: modeOfPayment,
        referenceNo,
        note: notes,
      },
      fees: selectedFees,
    };

    console.log("Submitting Payload:", payload);

    // const response = await axios.post(
    //   API_ENDPOINTS.PAY_FEES_SCHOOL(), // replace with your POST API
    //   payload,
    //   {
    //     headers: { Authorization: `Bearer ${token}` },
    //   }
    // );

    // setSubmitted(true);
    // setReceiptData(response.data);
    // alert("Fees submitted successfully!");
    // getFees(); // refresh table
  } catch (error) {
    console.error("Error submitting fees:", error);
    alert("Error submitting fees. Please try again.");
  }
};




  const handlePayment = () => {
    if (!feePaymentAmount || isNaN(feePaymentAmount)) return;

    setNewPaidEntries(prev => ({
      ...prev,
      [currentFeeIndex]: Number(feePaymentAmount),
    }));

    setShowFeeModal(false);
  };

const handleDownloadAndReset = () => {
  window.location.reload();
};

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow mt-6">
      {loadingFees && <div>Loading fees...</div>}

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

                  }}
                >
                  {student.name} - 
                  {student.className}, {student.subClassName}
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
          <label className="text-sm text-gray-600">Class</label>
          <input
            type="text"
            value={selectedStudent?.className || ""}
            readOnly
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Sub Class</label>
          <input
            type="text"
            value={selectedStudent?.subClassName || ""}
            readOnly
            className="w-full border p-2 rounded"
          />
        </div>
      </div>
  <table className="w-full border border-gray-300 rounded-md shadow-md">
  <thead className="bg-gray-100">
    <tr className="text-center text-gray-700 font-semibold">
      <th className="p-2">Month</th>
      <th className="p-2">Fee Head</th>
      <th className="p-2">Fee Amount</th>
      <th className="p-2">Paid Amount</th>
      <th className="p-2">Due Amount</th>
      <th className="p-2">Is Paid</th>
      <th className="p-2">Action</th>
    </tr>
  </thead>
  <tbody>
    {fees.map((fee, index) => (
      <tr
        key={index}
        className={`text-center border-t ${
          fee.isPaid ? "bg-green-50" : "bg-red-50"
        }`}
      >
        <td className="p-2 font-medium">{fee.month}</td>
        <td className="p-2">{fee.name}</td>
        <td className="p-2">₹{fee.feeAmount.toLocaleString()}</td>
        <td className="p-2 text-green-600">₹{fee.paidAmount.toLocaleString()}</td>
        <td className="p-2 text-red-500">₹{fee.due.toLocaleString()}</td>
        <td
          className={`p-2 font-semibold ${
            fee.isPaid ? "text-green-600" : "text-red-600"
          }`}
        >
          {fee.isPaid ? "Yes" : "No"}
        </td>
        <td className="p-2">
          {!fee.isPaid && (
            <button
  onClick={() => {
    // track full fee payment in newPaidEntries
    setNewPaidEntries((prev) => ({
      ...prev,
      [index]: fee.feeAmount, // mark full amount
    }));

    // also update UI state so table shows as paid
    const updated = [...fees];
    updated[index].isPaid = true;
    updated[index].paidAmount = fee.feeAmount;
    updated[index].due = 0;
    setFees(updated);
  }}
  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition"
>
  Pay
</button>

          )}
          {fee.isPaid && (
            <span className="text-green-700 font-semibold">Paid</span>
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>


      <div className="grid grid-cols-3 gap-4 mb-6">
      
        <div>
          <label className="text-sm text-gray-600">Total Fees</label>
          <input
            type="number"
            value={feeSummary?.totalFee || ""}

            className="w-full border p-2 rounded"
          />
        </div>
             <div>
          <label className="text-sm text-gray-600">Total Amount Paid</label>
          <input
            type="number"
            value={feeSummary?.totalPaid || ""}

            className="w-full border p-2 rounded"
          />
        </div>
             <div>
          <label className="text-sm text-gray-600">Due Amount</label>
          <input
            type="number"
            value={feeSummary?.remainingDue || 0}

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
        <div className="flex justify-end items-center gap-4">
          {!submitted ? (
            <button
              onClick={handleSubmitFees}
              className="bg-linear-blue text-white px-6 py-2 rounded"
            >
              Submit Payment
            </button>
          ) : (
            <ReceiptDownloadButton
              receipt={receiptData}
              onDownloaded={handleDownloadAndReset}
              className="bg-green-600 text-white px-6 py-2 rounded"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectFeePage;
