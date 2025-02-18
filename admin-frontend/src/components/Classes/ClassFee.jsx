import React, { useEffect, useState } from "react";
import axios from "axios";
import API_ENDPOINTS from "../../API/apiEndpoints";
import ValidationScreen from "./ValidationScreen";
const ClassFee = ({ setShowFees,classSections,onClose }) => {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const [classOptions, setClassOptions] = useState([]);
    const [feeEntries, setFeeEntries] = useState([]);
    const [savedFees, setSavedFees] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [showValidationScreen, setShowValidationScreen] = useState(false);
    const userData =  JSON.parse(localStorage.getItem("userData"));
    const parsedData =userData ;
    
 const token = parsedData.token;
 useEffect(() => {
    const fetchClassOptions = async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.FETCH_CLASS, {
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            });
            const classOptions = response.data.data.class.map((classItem) => ({
                value: classItem.classId,
                label: `Class ${classItem.className}`,
            }));
            setClassOptions(classOptions);
        } catch (error) {
            console.error("Error fetching class options:", error.response?.data || error.message);
            alert("Failed to fetch class data. Please try again.");
        }
    };

    fetchClassOptions();
}, [token]); 


    const typeOptions = [
        { value: "Yearly", label: "Yearly" },
        { value: "monthly", label: "Monthly" }
    ];

    const addFeeEntry = () => {
        setFeeEntries([...feeEntries, { className: "", tuitionFee: "", feeType: "", otherFees: [] }]);
        setErrorMessage("");
    };

    const updateFeeEntry = (index, field, value) => {
        console.log("here",)
        const updatedEntries = [...feeEntries];
    
        if (field === "className") {
            const selectedClass = classOptions.find(option => option.value === value);
            updatedEntries[index]["classId"] = value; // Store classId separately
            updatedEntries[index]["className"] = selectedClass ? selectedClass.label : ""; // Store className
        } else {
            updatedEntries[index][field] = value;
        }
    
        setFeeEntries(updatedEntries);
        console.log(updatedEntries)
    };
    

    const addOtherFee = (index) => {
        const updatedEntries = [...feeEntries];
        updatedEntries[index].otherFees.push({ name: "", amount: "", feeType: "" });
        setFeeEntries(updatedEntries);
    };

    const updateOtherFee = (entryIndex, feeIndex, field, value) => {
        const updatedEntries = [...feeEntries];
        updatedEntries[entryIndex].otherFees[feeIndex][field] = value;
        setFeeEntries(updatedEntries);
    };

    const removeOtherFee = (entryIndex, feeIndex) => {
        const updatedEntries = [...feeEntries];
        updatedEntries[entryIndex].otherFees = updatedEntries[entryIndex].otherFees.filter((_, i) => i !== feeIndex);
        setFeeEntries(updatedEntries);
    };

    const removeFeeEntry = (index) => {
        setFeeEntries(feeEntries.filter((_, i) => i !== index));
        setErrorMessage("");
    };

    const nextPage = () =>{
      //  setShowFees(false)
        setShowValidationScreen(true);
    }
    const saveFees = async () => {
        if (feeEntries.length === 0) {
            setErrorMessage("Please add at least one fee entry before saving.");
            return;
        }
    
        for (const entry of feeEntries) {
            if (!entry.className || !entry.tuitionFee || !entry.feeType) {
                setErrorMessage("All fields are required for each entry.");
                return;
            }
        }
    
        const campusId = parsedData.data.campusId;
        try {
            for (const entry of feeEntries) {
                const payload = {
                    fees: [
                        {
                            name: "Tuition Fee",
                            amount: Number(entry.tuitionFee),
                            type: entry.feeType.toUpperCase(),
                        },
                        ...entry.otherFees.map(fee => ({
                            name: fee.name,
                            amount: Number(fee.amount),
                            type: fee.feeType.toUpperCase(),
                        })),
                    ],
                };
    
                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/api/v1/class/campus/${campusId}/${entry.classId}/fees`,
                    payload,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

            }
    
            alert("Fee structures saved successfully!");
            setSavedFees([...savedFees, ...feeEntries]); 
           
            setFeeEntries([]);
            setErrorMessage("");
        } catch (error) {
            console.error("Error saving fee structure:", error.response?.data || error.message);
            alert("Failed to save fee structure. Please try again.");
        }
    };
    
    const closeAll = () =>{
        setShowFees(false);
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center h-full w-full bg-black bg-opacity-80">
            <div className="bg-gray-800 p-6 rounded-xl w-4/12 max-h-[80vh] overflow-y-auto">
                <form>
                    <div className="mb-4 flex justify-between">
                        <h2 className="text-lg font-semibold text-white">Add Fee Structure</h2>
                        <button type="button" onClick={addFeeEntry} className="px-3 py-1 bg-blue-600 rounded-lg text-white">+ Add Class</button>
                    </div>
                    
                    <div className="space-y-4 max-h-96 overflow-y-auto p-2 border border-gray-500 rounded-lg scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700">
                    {feeEntries.map((entry, index) => (
                            <div key={index} className="p-3 border border-gray-500 rounded-lg">
                                <label className="block text-sm text-white">Select Class</label>
                                <select 
                                    value={entry.classId} 
                                    onChange={(e) => updateFeeEntry(index, "classId", e.target.value)} 
                                    className="w-full p-2 border rounded-md"
                                >
                                    <option value="">-- Select Class --</option>
                                    {classOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                                
                                <label className="block text-sm mt-2 text-white">Tuition Fee</label>
                                <input type="number" value={entry.tuitionFee} onChange={(e) => updateFeeEntry(index, "tuitionFee", e.target.value)} className="w-full p-2 border rounded-md" placeholder="Enter Fee" />
                                
                                <label className="block text-sm mt-2 text-white">Fee Type</label>
                                <select value={entry.feeType} onChange={(e) => updateFeeEntry(index, "feeType", e.target.value)} className="w-full p-2 border rounded-md">
                                    <option value="">-- Select Fee Type --</option>
                                    {typeOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                                
                                <div className="mt-3">
                                    <label className="block text-sm text-white">Other Fees</label>
                                    {entry.otherFees.map((fee, feeIndex) => (
                                        <div key={feeIndex} className="mt-2 p-2 border rounded-md">
                                            <div className="mb-2">
                                                <input 
                                                    type="text" 
                                                    value={fee.name} 
                                                    onChange={(e) => updateOtherFee(index, feeIndex, "name", e.target.value)} 
                                                    placeholder="Fee Name"
                                                    className="w-full p-2 border rounded-md mb-2"
                                                />
                                                <input 
                                                    type="number" 
                                                    value={fee.amount} 
                                                    onChange={(e) => updateOtherFee(index, feeIndex, "amount", e.target.value)} 
                                                    placeholder="Fee Amount"
                                                    className="w-full p-2 border rounded-md mb-2"
                                                />
                                                <select 
                                                    value={fee.feeType} 
                                                    onChange={(e) => updateOtherFee(index, feeIndex, "feeType", e.target.value)} 
                                                    className="w-full p-2 border rounded-md mb-2"
                                                >
                                                    <option value="">-- Select Fee Type --</option>
                                                    {typeOptions.map(option => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => removeOtherFee(index, feeIndex)} 
                                                className="px-2 py-1 bg-red-600 rounded-lg text-white"
                                            >
                                                Remove Fee
                                            </button>
                                        </div>
                                    ))}
                                    <button 
                                        type="button" 
                                        onClick={() => addOtherFee(index)} 
                                        className="px-4 py-2 bg-yellow-600 rounded-lg text-white mt-2"
                                    >
                                        + Add Other Fee
                                    </button>
                                </div>
                                
                                <button 
                                    type="button" 
                                    onClick={() => removeFeeEntry(index)} 
                                    className="mt-4 px-3 py-1 bg-red-600 rounded-lg text-white"
                                >
                                    Remove Class Entry
                                </button>
                            </div>
                        ))}
                    </div>

                    {errorMessage && <div className="text-red-500 text-sm mt-3">{errorMessage}</div>}
                    
                    <div className="flex justify-end mt-4 gap-4">
                        <button type="button" onClick={saveFees} className="px-4 py-2 text-white bg-green-600 rounded-lg">Save Fees</button>
                        <button type="button" onClick={nextPage} className="px-4 py-2 text-white bg-green-600 rounded-lg">Next Page</button>      
                        <button type="button" onClick={() => setShowFees(false)} className="px-4 py-2 text-white border-red-500 border-2 rounded-lg hover:bg-red-500">Previous</button>
                    </div>
                </form>

                <div className="mt-6 p-4 bg-gray-700 rounded-lg text-white">
                    <h3 className="text-lg font-semibold">Saved Fees</h3>
                    {savedFees.length > 0 ? (
                        savedFees.map((fee, index) => (
                            <div key={index} className="mt-2 border p-2 rounded-md">
                                <p>Class: {fee.className}, Tuition Fee: {fee.tuitionFee}, Type: {fee.feeType}</p>
                                {fee.otherFees.length > 0 && (
                                    <div className="mt-2">
                                        <h4 className="text-sm font-semibold">Other Fees:</h4>
                                        {fee.otherFees.map((other, i) => (
                                            <p key={i}>Name: {other.name}, Amount: {other.amount}, Type: {other.feeType}</p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No fees saved yet.</p>
                    )}
                </div>
            </div>
            {showValidationScreen && <ValidationScreen classSections={classSections}
             savedFees={savedFees} setShowValidationScreen={setShowValidationScreen} closeAll={closeAll}/>}
        </div>
    );
};

export default React.memo(ClassFee);
