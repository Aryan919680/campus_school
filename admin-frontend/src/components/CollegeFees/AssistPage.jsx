import React, { useState } from "react";
import SmartFeeDefaulter from "./SmartFeeDefaulter";
export default function AssistPage () {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return(
        // <div className="bg-black text-white p-8 h-[500px]">
        <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Select Goal <span role="img" aria-label="robot">🤖</span></h2>
        <div className="flex flex-col items-center gap-4">
          <button className="bg-gray-300 text-black px-6 py-2 rounded-full">Profitability Analysis</button>
          <button className="bg-gray-300 text-black px-6 py-2 rounded-full">Bank Reconciliation</button>
          <button
        className="bg-gray-300 text-black px-6 py-2 rounded-full mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        Smart Fee Defaulter
      </button>

      {/* Modal Triggered Here */}
      <SmartFeeDefaulter isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
      {/* </div> */}
      </div>
    )
}