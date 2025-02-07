import React, { useEffect, useState } from "react";
import axios from "axios";
import ClassFee from "./ClassFee";
import API_ENDPOINTS from '../../API/apiEndpoints'
const ClassForm = ({ onClose, errorMessage,refreshClasses }) => {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    // Retrieve stored data or initialize empty array
    const [classSections, setClassSections] = useState(
        JSON.parse(localStorage.getItem("classSections")) || []
    );
    
    const [classInput, setClassInput] = useState("");
    const [sectionsInput, setSectionsInput] = useState("");
    const [showClassFee, setShowClassFee] = useState(false);
    const [loading, setLoading] = useState(false);
    const userData =  JSON.parse(localStorage.getItem("userData"));
    const parsedData =userData ;
 const token = parsedData.token;
    // Handle Class Name Input
    const handleClassChange = (event) => {
        setClassInput(event.target.value);
    };

    // Handle Sections Input
    const handleSectionsChange = (event) => {
        setSectionsInput(event.target.value.toUpperCase());
    };

    // Add Class with Sections
    const addClassWithSections = () => {
        if (!classInput.trim()) return alert("Please enter a class name.");
        if (!sectionsInput.match(/^([A-Z])\s*to\s*([A-Z])$/i)) return alert("Invalid section format. Use 'A to D'.");

        const match = sectionsInput.match(/^([A-Z])\s*to\s*([A-Z])$/i);
        const start = match[1].charCodeAt(0);
        const end = match[2].charCodeAt(0);

        if (start > end) return alert("Invalid section range.");

        const newSections = Array.from({ length: end - start + 1 }, (_, i) =>
            String.fromCharCode(start + i)
        );

        // Prevent duplicate class entries
        const existingIndex = classSections.findIndex(item => item.class === classInput.trim());
        let updatedClassSections = [...classSections];

        if (existingIndex !== -1) {
            updatedClassSections[existingIndex].sections = newSections;
        } else {
            updatedClassSections.push({ class: classInput.trim(), sections: newSections });
        }

        setClassSections(updatedClassSections);
        localStorage.setItem("classSections", JSON.stringify(updatedClassSections));

        // Reset inputs
        setClassInput("");
        setSectionsInput("");
    };

    // Remove a class
    const removeClass = (classToRemove) => {
        const updatedClassSections = classSections.filter(item => item.class !== classToRemove);
        setClassSections(updatedClassSections);
        localStorage.setItem("classSections", JSON.stringify(updatedClassSections));
    };

    const handleNext = async () => {
              const payload = {
            data: classSections.map(section => ({
                className: section.class.replace("Grade ", ""), 
                subclasses: section.sections.map(name => ({ name })) 
            }))
        };

        setLoading(true);
        try {
            const response = await axios.post(API_ENDPOINTS.CREATE_CLASS, payload, {
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                
                },
                
            });
            if (response) {
                alert("Class added successfully!");
                refreshClasses();
            }
            localStorage.removeItem("classSections");
        setClassSections([]);
            setShowClassFee(true);
        } catch (error) {
            console.error("Error submitting data:", error.response?.data || error.message);
            alert("Failed to submit data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>

       {

        !showClassFee &&
        <div className="fixed inset-0 z-50 flex justify-center items-center h-full w-full bg-black rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-80 border border-gray-100">
            <div className="bg-gray-800 p-8 rounded-xl w-3/12">
                <form className="text-black">
                    {/* Enter Class Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white">Class Name</label>
                        <input
                            type="text"
                            value={classInput}
                            onChange={handleClassChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                            placeholder="Enter class name (e.g., Grade 1)"
                        />
                    </div>

                    {/* Add Sections Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-white">Add Sections (e.g., A to D)</label>
                        <input
                            type="text"
                            value={sectionsInput}
                            onChange={handleSectionsChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                            placeholder="Enter section range (A to D)"
                        />
                    </div>

                    {/* Add Button */}
                    <button
                        type="button"
                        onClick={addClassWithSections}
                        className="w-full px-4 py-2 mb-4 text-white bg-blue-600 rounded-lg hover:bg-blue-500"
                    >
                        Add Class & Sections
                    </button>

                    {/* Display Added Classes & Sections */}
                    {classSections.length > 0 && (
                        <div className="mb-4 p-3 bg-gray-700 rounded-md text-white">
                            <label className="block text-sm font-medium">Added Classes & Sections:</label>
                            <div className="mt-2 space-y-3">
                                {classSections.map(({ class: className, sections }) => (
                                    <div key={className} className="p-2 bg-gray-600 rounded-md">
                                        <div className="flex justify-between items-center">
                                            <span>{className}</span>
                                            <button
                                                onClick={() => removeClass(className)}
                                                className="text-red-400 text-sm hover:text-red-600"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {sections.map(section => (
                                                <span key={section} className="px-3 py-1 bg-blue-500 rounded-md text-sm">
                                                    {section}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {errorMessage && <div className="mb-4 text-red-500">{errorMessage}</div>}

                    {/* Buttons */}
                    <div className="flex justify-end items-center mt-4 gap-4">
                        <button
                            className="px-4 w-1/2 py-2 text-white border-red-500 border-2 rounded-lg hover:bg-red-500"
                            type="button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 w-1/2 text-white bg-green-600 rounded-lg"
                            type="button"
                            onClick={handleNext}
                          //  disabled={loading}
                        >
                            {loading ? "Processing..." : "Next"}
                        </button>
                    </div>
                </form>
            </div>
           
        </div>
}
        {showClassFee && <ClassFee setShowFees={setShowClassFee} />}
        </div>
    );
};

export default React.memo(ClassForm);
