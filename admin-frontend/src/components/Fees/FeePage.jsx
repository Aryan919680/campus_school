import { useState } from "react";
import ViewFeePage from './ViewFeePage'
import CollectFeePage from "./CollectFeePage";
import CompliancePage from "./CompliancePage";
import AssistPage from "./AssistPage";
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
          onClick={() => setActiveTab("collect")}
          className={`px-4 py-2 rounded ${
            activeTab === "collect" ? "bg-linear-blue text-white" : "bg-gray-300"
          }`}
        >
          Collect Fees
        </button>
        <button onClick={ () =>{setActiveTab("compliance")}}
  className={`px-4 py-2 rounded ${
    activeTab === "compliance" ? "bg-linear-blue text-white" : "bg-gray-300"
  }`} >
    Compliance
  </button>
  <button onClick={ () =>{setActiveTab("goal")}}
  className={`px-4 py-2 rounded ${
    activeTab === "goal" ? "bg-linear-blue text-white" : "bg-gray-300"
  }`} >
    AI FI. Assist
  </button>
      </div>
      {
        activeTab === 'default'  &&   <ViewFeePage /> 
       
      }
      {
          activeTab === 'collect'  && <CollectFeePage />
      }
      {
            activeTab === 'compliance'  && <CompliancePage />
      }
      {
  activeTab === 'goal'  && <AssistPage />
      }

    </div>
  );
};

export default FeePage;
