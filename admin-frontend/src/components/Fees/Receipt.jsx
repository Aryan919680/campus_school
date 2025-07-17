// Receipt.jsx
import React, { forwardRef } from "react";

const Receipt = forwardRef(({ data }, ref) => (
    
  <div ref={ref} className="w-[800px] p-6 bg-white text-black text-sm">
    <h1 className="text-xl font-bold text-center">Fee Receipt</h1>
    <p className="text-center mb-4">Receipt No: {data.receiptNo}</p>

    <div className="mb-2">
      <strong>Student Name:</strong> {data.student.name} <br />
      <strong>Student ID:</strong> {data.student.id} <br />
      <strong>Course:</strong> {data.student.course} <br />
      <strong>Semester:</strong> {data.student.semester} <br />
    </div>

    <table className="w-full border-collapse mb-4">
      <thead>
        <tr className="border bg-gray-100">
          <th className="border p-1">Fee Head</th>
          <th className="border p-1">Paid (₹)</th>
          <th className="border p-1">Due (₹)</th>
        </tr>
      </thead>
      <tbody>
        {data.breakdown.map((item, i) => (
          <tr key={i}>
            <td className="border p-1">{item.name}</td>
            <td className="border p-1">{item.paidAmount}</td>
            <td className="border p-1">{item.due}</td>
          </tr>
        ))}
        <tr className="font-bold">
          <td className="border p-1">Total</td>
          <td className="border p-1">{data.summary.totalPaid}</td>
          <td className="border p-1">{data.summary.totalDue}</td>
        </tr>
      </tbody>
    </table>

    <p><strong>Amount Received:</strong> ₹{data.summary.amountReceived}</p>
    <p><strong>Discount:</strong> {data.summary.discountLabel}</p>
    <p><strong>Payment Mode:</strong> {data.summary.paymentMode}</p>
    <p className="mt-6 text-xs text-center">System generated receipt</p>
  </div>

));

export default Receipt;
