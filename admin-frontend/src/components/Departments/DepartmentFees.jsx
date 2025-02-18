import React, { useEffect, useState } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";

const DepartmentFees = ({  closeFeesPage, closeAllPages }) => {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const [fee, setFees] = useState([{ name: "Tuition Fee", amount: "", type: "SEMESTER" }]);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const token = userData?.token;
    const courseId = localStorage.getItem("courseId");


    const handleFeeChange = (index, field, value) => {
        const updatedFees = [...fee];
        updatedFees[index][field] = value;
        setFees(updatedFees);
    };

    const addFeeField = () => {
        setFees([...fee, { name: "", amount: "", type: "SEMESTER" }]);
    };
    const fees = fee.map(fee => ({
        ...fee,
        amount: Number(fee.amount)
    }));

    const submitFees = async () => {
        try {
            await axios.post(`${API_ENDPOINTS.SUBMIT_FEES}/${courseId}/fees`, { fees }, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
            });
            alert("Fees submitted successfully!");
            localStorage.removeItem("courseId");
            closeAllPages();
        } catch (error) {
            console.error("Error submitting fees:", error);
            alert("Failed to submit fees. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center h-full w-full bg-black rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-80 border border-gray-100">
            <div className="bg-gray-800 p-8 rounded-xl w-3/12">
                <form className="text-black">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white">Tuition Fee:</label>
                        <input
                            type="number"
                            value={fee[0].amount}
                            onChange={(e) => handleFeeChange(0, "amount", e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                            placeholder="Enter amount"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white">Fee Type:</label>
                        <div className="flex gap-4">
                            <label className="text-white">
                                <input
                                    type="radio"
                                    name="feeType"
                                    checked={fee[0].type === "ANNUAL"}
                                    onChange={() => handleFeeChange(0, "type", "ANNUAL")}
                                /> Annual
                            </label>
                            <label className="text-white">
                                <input
                                    type="radio"
                                    name="feeType"
                                    checked={fee[0].type === "SEMESTER"}
                                    onChange={() => handleFeeChange(0, "type", "SEMESTER")}
                                /> Per Semester
                            </label>
                        </div>
                    </div>
                    <div className="mb-4 p-3 bg-gray-700 rounded-md text-white">
                        <label className="block text-sm font-medium">Additional Fees:</label>
                        {fee.slice(1).map((fee, index) => (
                            <div key={index} className="flex gap-2 items-center mt-2">
                                <input
                                    type="text"
                                    value={fee.name}
                                    onChange={(e) => handleFeeChange(index + 1, "name", e.target.value)}
                                    className="px-2 py-1 border rounded-md w-1/2"
                                    placeholder="Fee Name"
                                />
                                <input
                                    type="number"
                                    value={fee.amount}
                                    onChange={(e) => handleFeeChange(index + 1, "amount", e.target.value)}
                                    className="px-2 py-1 border rounded-md w-1/3"
                                    placeholder="Amount"
                                />
                            </div>
                        ))}
                        <button type="button" onClick={addFeeField} className="mt-3 text-blue-400">
                            + Add Another Fee
                        </button>
                    </div>
                    <div className="flex justify-end items-center mt-4 gap-4">
                        <button className="px-4 py-2 w-1/2 text-white bg-red-600 rounded-lg hover:bg-red-500" type="button" onClick={closeFeesPage}>
                            Previos
                        </button>
                        <button className="px-4 py-2 w-1/2 text-white bg-green-600 rounded-lg" type="button" onClick={submitFees}>
                            Submit Fees
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default React.memo(DepartmentFees);
