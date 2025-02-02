import React, { useEffect, useState } from "react";

const ClassFee = () => {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const options = [
        { value: "1", label: "Grade 1" },
        { value: "2", label: "Grade 2" },
        { value: "3", label: "Grade 3" }
    ];

    const typeOptions = [
        { value: "annual", label: "Annual" },
        { value: "monthly", label: "Monthly" }
    ];

    const [selectedClass, setSelectedClass] = useState("");
    const [tuitionFees, setTuitionFees] = useState("");
    const [selectedFeeType, setSelectedFeeType] = useState("");
    const [otherFees, setOtherFees] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSelectClass = (event) => {
        setSelectedClass(event.target.value);
    };

    const handleTuitionFeeChange = (event) => {
        setTuitionFees(event.target.value);
    };

    const handleFeeTypeChange = (event) => {
        setSelectedFeeType(event.target.value);
    };

    const handleAddOtherFee = () => {
        setOtherFees([...otherFees, { name: "", amount: "", feeType: "" }]);
    };

    const handleOtherFeeChange = (index, field, value) => {
        const updatedFees = [...otherFees];
        updatedFees[index][field] = value;
        setOtherFees(updatedFees);
    };

    const handleClose = () => {
        // Reset states when closing
        setSelectedClass("");
        setTuitionFees("");
        setSelectedFeeType("");
        setOtherFees([]);
        setErrorMessage("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!selectedClass || !tuitionFees || !selectedFeeType) {
            setErrorMessage("All fields are required");
            return;
        }
        console.log("Submitted Data:", { selectedClass, tuitionFees, selectedFeeType, otherFees });
        handleClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center h-full w-full bg-black rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-80 border border-gray-100">
            <div className="bg-gray-800 p-8 rounded-xl w-3/12">
                <form onSubmit={handleSubmit} className="text-black">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white">Select Class</label>
                        <select
                            value={selectedClass}
                            onChange={handleSelectClass}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="" disabled>-- Select an option --</option>
                            {options.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white">Tuition Fees</label>
                        <input
                            type="text"
                            value={tuitionFees}
                            onChange={handleTuitionFeeChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                            placeholder="Enter Tuition Fees"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white">Fee Type:</label>
                        <select
                            value={selectedFeeType}
                            onChange={handleFeeTypeChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="" disabled>-- Select Fee Type --</option>
                            {typeOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white">Other Fees</label>
                        {otherFees.map((fee, index) => (
                            <div key={index} className="mb-4 p-3 border border-gray-500 rounded-lg">
                                <input
                                    type="text"
                                    value={fee.name}
                                    onChange={(e) => handleOtherFeeChange(index, "name", e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                                    placeholder="Fee Name"
                                />
                                <input
                                    type="text"
                                    value={fee.amount}
                                    onChange={(e) => handleOtherFeeChange(index, "amount", e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                                    placeholder="Fee Amount"
                                />
                                <select
                                    value={fee.feeType}
                                    onChange={(e) => handleOtherFeeChange(index, "feeType", e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                >
                                    <option value="" disabled>-- Select Fee Type --</option>
                                    {typeOptions.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddOtherFee} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg w-full hover:bg-blue-700">+ Add Other Fee</button>
                    </div>

                    {errorMessage && <div className="mb-4 text-red-500">{errorMessage}</div>}

                    <div className="flex justify-end items-center mt-4 gap-4">
                        <button type="button" onClick={handleClose} className="px-4 w-1/2 py-2 text-white border-red-500 border-2 rounded-lg hover:bg-red-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 w-1/2 text-white bg-green-600 rounded-lg">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default React.memo(ClassFee);
