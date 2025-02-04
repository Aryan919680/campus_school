import React, { useState, useCallback } from "react";
import ClassForm from "./ClassForm";
import ClassFee from "./ClassFee";

const Classes = () => {
    const [openForm, setOpenForm] = useState(false);
    const [formValues, setFormValues] = useState({ name: "", code: "" });
    const [errorMessage, setErrorMessage] = useState("");

    const onClose = useCallback(() => {
        setOpenForm(false);
        setFeePage(false);
        setErrorMessage("");
    }, []);

    const handleForm = useCallback(() => {
        setOpenForm(true);
    }, []);


    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
    }, []);

    return (
        <div className="bg-white p-8 rounded-md w-full">
            <div className="flex items-center justify-between pb-6 flex-wrap gap-2">
                <h2 className="text-gray-600 font-semibold text-2xl">
                    Class, Section, and Fee Management
                </h2>
                <div className="flex justify-center items-center">
                    <button
                        onClick={handleForm}
                        className="bg-linear-blue text-white font-bold py-2 px-4 rounded w-full md:w-fit"
                    >
                        Add New Classes and Sections
                    </button>
                </div>
            </div>

            {errorMessage && (
                <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                    role="alert"
                >
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{errorMessage}</span>
                </div>
            )}

            {openForm && (
                <ClassForm
                    formValues={formValues}
                    onClose={onClose}
                    handleInputChange={handleInputChange}
                    errorMessage={errorMessage}
                />
            )}

          
        </div>
    );
};

export default Classes;
