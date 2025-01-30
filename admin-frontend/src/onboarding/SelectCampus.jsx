import React, { useState, useEffect } from "react";
import OnboardingForm from "./OnboardingForm";
import OnboardingSchoolForm from "../onboardingSchool/OnboardingSchoolForm";

const SelectCampus = ({ onClose }) => {
    const options = [
        { value: "school", label: "School" },
        { value: "college", label: "College" },
    ];

    const [selectedOption, setSelectedOption] = useState("");

    const handleSelect = (event) => {
        const value = event.target.value;
        setSelectedOption(value);

    };
    return (
        <ol className="flex items-center justify-between gap-2 text-xs font-medium text-gray-500 sm:gap-4">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-xl md:w-[30vw] w-[90vw] h-[250px]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-700">
                            Campus type
                        </h2>

                    </div>
                    <div className="relative w-full max-w-xs">
                        <label htmlFor="category" className="block text-gray-700 font-semibold mb-2">
                            Select Category
                        </label>
                        <select
                            id="category"
                            value={selectedOption}
                            onChange={handleSelect}
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" disabled>
                                -- Select an option --
                            </option>
                            {options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    {
                        selectedOption === "college" ? <OnboardingForm  onClose={onClose}/> : selectedOption ==="school" &&  <OnboardingSchoolForm onClose={onClose} />
                    }
                </div>
            </div>
        </ol>
    );
};

export default SelectCampus;
