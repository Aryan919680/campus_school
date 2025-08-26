import React from "react";
import { LineChart, Line, PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const taxData = [
  { name: "Jan", value: 10 },
  { name: "Feb", value: 20 },
  { name: "Mar", value: 30 },
  { name: "Apr", value: 25 },
  { name: "May", value: 35 },
];

const reconciliationData = [
  { name: "Reconciled", value: 70, color: "#34D399" },
  { name: "Pending", value: 30, color: "#FBBF24" },
];

export default function CompliancePage() {
  return (
    <div className="bg-black min-h-screen text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Compliance</h1>
      {/* <div className="flex gap-4 mb-6">
        <button className="bg-white text-black px-4 py-2 rounded-lg">View Fee Records</button>
        <button className="bg-white text-black px-4 py-2 rounded-lg">Collect Fees</button>
        <button className="bg-gradient-to-r from-yellow-200 to-pink-300 text-black px-4 py-2 rounded-lg">Compliance</button>
        <button className="bg-white text-black px-4 py-2 rounded-lg">AI Fi. Assist</button>
      </div> */}

      <div className="bg-gray-800 text-white p-6 rounded-xl mb-6">
        <p>Pending Tax Liability: <strong>₹80,990</strong></p>
        <p>Next Filing Due Date: <strong>DD-MM-YYYY</strong></p>
        <p>Bank Reconciliation Status: <span className="text-green-400">✔ Matched</span></p>
        <p>Latest Tax Filing Status: <span className="text-green-400">✔ Filed</span> / <span className="text-red-400">✘ Overdue</span></p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 p-4 rounded-xl">
          <h2 className="text-lg font-bold mb-2">Tax Trends</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={taxData}>
              <Line type="monotone" dataKey="value" stroke="#34D399" />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl">
          <h2 className="text-lg font-bold mb-2">Bank Reconciliation</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={reconciliationData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {reconciliationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex gap-4">
        <button className="bg-white text-black px-4 py-2 rounded-lg">Run Tax Calculation</button>
        <button className="bg-white text-black px-4 py-2 rounded-lg">Tax Filing Assistance</button>
        <button className="bg-white text-black px-4 py-2 rounded-lg">Bank Reconciliation</button>
        <button className="bg-white text-black px-4 py-2 rounded-lg">Doc. Management</button>
      </div>
    </div>
  );
}