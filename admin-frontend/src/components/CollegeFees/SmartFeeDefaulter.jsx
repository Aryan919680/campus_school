import React, { useState } from "react";

export default function SmartFeeDefaulter({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
      <div className="bg-black text-white p-8 rounded-xl w-96">
        <h1 className="text-2xl font-bold mb-6">Run Smart Fee Defaulter</h1>
        <div className="flex flex-col items-center gap-6">
        <button className="bg-gradient-to-r from-yellow-300 to-pink-400 text-black px-6 py-2 rounded-full w-80">
  Filter Defaulters by Days Overdue (7 days, 15 days, 30+ days)
</button>
<button className="bg-gradient-to-r from-yellow-300 to-pink-400 text-black px-6 py-2 rounded-full w-80">
  Auto-Generated Reminder Templates (Email, SMS, WhatsApp)
</button>
<button className="bg-gradient-to-r from-yellow-300 to-pink-400 text-black px-6 py-2 rounded-full w-80">
  Real-Time Payment Status Updates
</button>

          <button
            className="bg-red-500 text-white px-4 py-2 rounded-full mt-4"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
