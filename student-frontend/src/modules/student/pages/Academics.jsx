import { useState } from "react";
import SideSection from "../components/academics/SideSection";
import Analytics from "../components/academics/Analytics";
import TimeTable from "../components/academics/TimeTable";

const Academics = () => {
  return (
    <div className="flex w-full">
      <div className="w-full mx-6 md:ml-6">
        <Analytics />
        <h1 className="text-4xl my-4 md:mt-10 font-bold">Time Table</h1>
        <TimeTable />
      </div>
    </div>
  );
};
export default Academics;
