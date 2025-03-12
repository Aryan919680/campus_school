import { useState } from "react";
import ViewFeePage from './ViewFeePage'
import CollectFeePage from "./CollectFeePage";
const FeePage = () => {
  const [activeTab, setActiveTab] = useState("default");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fee Management</h1>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setActiveTab("default")}
          className={`px-4 py-2 rounded ${
            activeTab === "default"
              ? "bg-linear-blue text-white"
              : "bg-gray-300"
          }`}
        >
          View Fee Records
        </button>
        <button
          onClick={() => setActiveTab("leave")}
          className={`px-4 py-2 rounded ${
            activeTab === "leave" ? "bg-linear-blue text-white" : "bg-gray-300"
          }`}
        >
          Collect Fees
        </button>
      </div>
      {
        activeTab === 'default' ?      <ViewFeePage /> : 
        <CollectFeePage />
      }

    </div>
  );
};

export default FeePage;
