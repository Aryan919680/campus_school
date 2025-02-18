import React from "react";

const ValidationScreen = ({ classSections, savedFees, setShowValidationScreen, closeAll }) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center h-full w-full bg-black bg-opacity-80">
            <div className="bg-gray-800 p-6 rounded-xl w-4/12 max-h-[80vh] overflow-y-auto text-white">
        <h2 className="text-xl font-bold mb-4">Review Setup Summary</h2>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Classes and Sections:</h3>
          {classSections.map(({ class: className, sections }) => (
            <p key={className} className="ml-4">- {className}: Sections {sections.join(", ")}</p>
          ))}
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Fee Structures:</h3>
          {savedFees.map(({ className, tuitionFee, feeType, otherFees }) => (
            <div key={className} className="ml-4">
              <p className="font-medium">- {className}:</p>
              <p className="ml-6">- Tuition Fee: ₹{tuitionFee} ({feeType})</p>
              {otherFees.map((fee, index) => (
                <p key={index} className="ml-6">- {fee.name}: ₹{fee.amount} ({fee.feeType})</p>
              ))}
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button onClick={()=>setShowValidationScreen(false)} className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700">Go Back and Add Information</button>
          <button onClick={closeAll} className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700">Skip and Finalize Setup</button>
        </div>
      </div>
    </div>
  );
};

export default ValidationScreen;
