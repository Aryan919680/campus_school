import { Button } from "@/components/ui/button";
import { BadgeIndianRupee } from "lucide-react";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "@/auth/context/AuthContext";
import ReceiptDownloadButton from "./ReceiptDownloadButton";
const FeesDetails = () => {
  const { data } = useContext(AuthContext);
  const studentID = data.id;
  const campusId = data.campusId;
  const [payments, setPayments] = useState([]);
   const [selectedReceiptRecordId, setSelectedReceiptRecordId] = useState(null);
     const [receiptData, setReceiptData] = useState(null);
    const token = localStorage.getItem("token");
  console.log(data,token)
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/payment/campus/${campusId}/feesSummary`,{
             headers: { Authorization: `Bearer ${token}` },
             params: {
              studentId:studentID
             }
        });
        console.log(response.data)
        const paymentData = response.data.data;
        setPayments(paymentData);
      } catch (error) {
        console.error("Error fetching payment data:", error);
      }
    };

    fetchPayments();
  }, [studentID]);



  const handleGenerateReceipt = async (record) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/payment/campus/${campusId}/getFeesByStudentName`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { name: record.studentName },
    });
    const payments = response.data[0].payments;
    const fees =  response.data[0].fees;
    const feeSummary = response.data[0].feeSummary;
    // Group payments by feesId to calculate total paid so far (oldPaid)
    const oldPaidMap = {};
    payments.forEach(p => {
      if (!oldPaidMap[p.feesId]) oldPaidMap[p.feesId] = 0;
      oldPaidMap[p.feesId] += p.paidAmount;
    });

    // Get the latest payments (assumes sorted by createdAt ascending, reverse if needed)
    const latestPayments = payments.slice(-3); // or filter based on a timestamp or condition

    const updatedFees = latestPayments.map(fee => {
      const fullFee = fees.find(f => f.feesId === fee.feesId);
      const totalPaidForFee = oldPaidMap[fee.feesId] || 0;

      return {
        name: fullFee?.name || "Fee",
        oldPaid: totalPaidForFee - fee.paidAmount,
        newPaid: totalPaidForFee,
        due: fee.dueAmount,
      };
    });

    const receipt = {
      receiptNo: record.receiptNo || "RCPT-XXXXXX",
      student: {
        name: record.studentName || "Student",
        id: record.studentId,
        course: record.courseName || "-",
        semester: record.semesterName || "-",
      },
      breakdown: updatedFees,
      summary: {
        discountLabel: `${record.discount}`,
        amountReceived: feeSummary[0].totalPaid,
        paymentMode: response.data.payment?.paymentMode || "Online",
        totalPaid: feeSummary[0].totalFee,
        totalDue: feeSummary[0].remainingDue
      },
    };

    setReceiptData(receipt);
    setSelectedReceiptRecordId(record.studentId);
  } catch (error) {
    console.error("Error generating receipt:", error);
  }
};
  return (
    <div className="fees w-full min-h-screen flex flex-col items-center bg-gray-50 p-6">

      <div className="flex gap-2 text-3xl font-bold items-center mb-4">
        <BadgeIndianRupee className="text-primary-foreground size-12" /> Fee Details
      </div>
      <div className="w-full overflow-x-auto">
        {payments.length > 0 ? (
      <table className="w-full border divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-left font-medium">
              <tr>
                <th className="px-4 py-2">Student Name</th>
                <th className="px-4 py-2">Student ID</th>
                <th className="px-4 py-2">Course</th>
                <th className="px-4 py-2">Semester</th>
                <th className="px-4 py-2">Total Fee (₹)</th>
                <th className="px-4 py-2">Paid (₹)</th>
                <th className="px-4 py-2">Due (₹)</th>
                <th className="px-4 py-2">Receipt No.</th>
                <th className="px-4 py-2">Last Payment</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((record) => (
                <tr key={record.id}>
                  <td className="px-4 py-2">{record.studentName}</td>
                  <td className="px-4 py-2">{record.studentId}</td>
                  <td className="px-4 py-2">{record.courseName}</td>
                  <td className="px-4 py-2">{record.semesterName}</td>
                  <td className="px-4 py-2">{record.totalFee}</td>
                  <td className="px-4 py-2">{record.totalPaid}</td>
                  <td className="px-4 py-2">{record.totalDue}</td>
                  <td className="px-4 py-2">{record.receiptNo}</td>
                  <td className="px-4 py-2">{(record.lastPayment)}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${record.status === "FULLY PAID"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {record.status}
                    </span>
                  </td>
              
                     <td className="px-4 py-2">
  {selectedReceiptRecordId === record.studentId ? (
    <ReceiptDownloadButton
   
      receipt={receiptData}
      onDownloadComplete={() => {
        setReceiptData(null);
        setSelectedReceiptRecordId(null);
      }}
    />
  ) : (
    <button
      onClick={() => handleGenerateReceipt(record)}
      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-blue-600"
    >
      Generate Receipt
    </button>
  )}
</td>

                        
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-2xl font-semibold">Loading...</div>
        )}
      </div>
   
    </div>
  );
};

export default FeesDetails;
