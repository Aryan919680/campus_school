

import { useState, useEffect } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
import ReceiptDownloadButton from "./ReceiptDownloadButton";


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
    if (!selectedStudent?.studentId) return;

    setLoadingFees(true); 
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

      const allFeeData = response.data;
      const studentFeeData = allFeeData.find(
        (entry) => entry.studentId === selectedStudent.studentId
      );

      if (studentFeeData) {
        const { fees, payments, feeSummary } = studentFeeData;
        const totalPaid = feeSummary?.[0]?.totalPaid || 0;

        const formattedFees = fees.map((fee) => {
          const multiplier = getMultiplier(fee.type);
          const totalFeeAmount = fee.amount * multiplier;

          if (!payments || payments.length === 0 || feeSummary.length === 0) {
            return {
              name: fee.name,
              due: totalFeeAmount,
              toCollect: totalFeeAmount,
              feesId: fee.feesId,
              selected: false,
              courseId: selectedStudent.courseId,
              type: fee.type,
              feesPaid: 0, 
              originalAmount: totalFeeAmount,
            };
          }

          const paid = payments
            .filter((p) => p.feesId === fee.feesId)
            .reduce((sum, p) => sum + Number(p.paidAmount || 0), 0);

          const due = paid > 0 ? Math.max(totalFeeAmount - paid, 0) : totalFeeAmount;

          return {
            name: fee.name,
            due,
            toCollect: due,
            feesId: fee.feesId,
            selected: false,
            courseId: selectedStudent.courseId,
            type: fee.type,
            feesPaid: paid > 0 ? paid : 0,
            originalAmount: totalFeeAmount,
          };
        });

        setFees(formattedFees);
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


  const handleSubmitFees = async () => {
    if (!selectedStudent?.studentId) {
      alert("Please select a student before submitting.");
      return;
    }
    const selectedFees = fees
      .filter((fee, index) => (newPaidEntries[index] || 0) > 0)
      .map((fee, index) => ({
        feesId: fee.feesId,
        courseId: fee.courseId,
        paidAmount: newPaidEntries[index] || 0,  // 👈 use new entry amount
        due: Math.max(fee.originalAmount - (fee.feesPaid + (newPaidEntries[index] || 0)), 0),
        type: fee.type,
      }));


    if (selectedFees.length === 0) {
      alert("Please select at least one fee and enter amount.");
      return;
    }

    const totalAmount = selectedFees.reduce((acc, fee) => acc + Number(fee.paidAmount || 0), 0);

    const payload = {
      studentId: selectedStudent.studentId,
      amount: totalAmount,
      localTransactionId: "",
      additional_details: {
        discount: discount || 0,
        notes,
        modeOfPayment,
        referenceNo,
        category: selectedStudent?.category || "",
      },
      fees: selectedFees,
    };

    try {
      const res = await axios.post(
        API_ENDPOINTS.PAYMENT_FEES(),
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const response = res.data.data;
      const updatedFees = selectedFees.map((fee) => {
        const fullFee = fees.find(f => f.feesId === fee.feesId);
        return {
          name: fullFee?.name || "Fee",
          oldPaid: fullFee?.feesPaid,
          newPaid: fee.paidAmount,
          due: fee.due,
        };
      });

      const receipt = {
        receiptNo: response.data.payment.paymentId || "RCPT-XXXXXX",
        student: {
          name: selectedStudent.name || "Student",
          id: selectedStudent.studentId,
          course: selectedStudent.courseName || "-",
          semester: selectedStudent.semesterName || "-",
        },
        breakdown: updatedFees,
        summary: {
          discountLabel: `${discount || 0}`,
          amountReceived: totalAmount,
          paymentMode: response.paymentMode || modeOfPayment,
          totalPaid: totalAmount,
        },
      };

      setReceiptData(receipt);
      setSubmitted(true);
      alert("Fees submitted successfully.");
    } catch (error) {
      console.error("Error submitting fees:", error);
      alert("Failed to submit fees.");
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
    setReceiptData(null);
    setSubmitted(false);
    setSelectedStudent(null);
    setFees([]);
    setDiscount(0);
    setNotes("");
    setAmountReceived("");
    setModeOfPayment("Cash");
    setReferenceNo("");
    setSearchTerm("");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow mt-6">
      {loadingFees && <div>Loading fees...</div>}
      {showFeeModal && currentFeeIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">
              Pay for {fees[currentFeeIndex]?.name}
            </h3>

            <p className="mb-2">Due Amount: ₹{fees[currentFeeIndex]?.due}</p>

            <input
              type="number"
              placeholder="Enter amount to pay"
              value={feePaymentAmount}
              max={fees[currentFeeIndex]?.due}
              onChange={(e) => setFeePaymentAmount(Number(e.target.value))}
              className="w-full border p-2 rounded mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowFeeModal(false);
                  setFeePaymentAmount('');
                  setCurrentFeeIndex(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handlePayment}
                className="px-4 py-2 bg-linear-blue text-white rounded"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

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

          <tr className="text-center">
            <th className="p-2">Fee Head</th>
            <th className="p-2">Type</th>
            <th className="p-2">Total fees</th>
            <th className="p-2">Old Paid Amount</th>
            <th className="p-2">New Entry</th>
            <th className="p-2">Due</th>
            <th className="p-2">Action</th>

          </tr>
        </thead>
        <tbody>
          {fees.map((fee, index) => {
            const newEntry = newPaidEntries[index] || 0;
            const totalPaid = fee.feesPaid + newEntry;
            const newDue = Math.max(fee.originalAmount - totalPaid, 0);

            return (
              <tr key={index} className="border-t text-center">
                <td className="p-2">{fee.name}</td>
                <td className="p-2">{fee.type}</td>
                <td className="p-2">₹{fee.originalAmount.toLocaleString()}</td>
                <td className="p-2">₹{fee.feesPaid.toLocaleString()}</td>
                <td className="p-2 text-green-600">
                  ₹{newEntry ? newEntry.toLocaleString() : "-"}
                </td>
                <td className="p-2 text-red-500">₹{newDue.toLocaleString()}</td>
                <td className="p-2">
                  <button
                    onClick={() => {
                      setCurrentFeeIndex(index);
                      setFeePaymentAmount('');
                      setShowFeeModal(true);
                    }}
                    className="px-3 py-1 bg-linear-blue text-white rounded"
                  >
                    Pay
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>

      </table>

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
