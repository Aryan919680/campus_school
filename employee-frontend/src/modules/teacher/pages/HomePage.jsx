import { MoveRight, StarIcon } from "lucide-react";
import React from "react";
import AttendanceOver from "../components/HomePage/AttendanceOver";
import { getTodaysDate, getTodaysDay } from "../utils/dateFormatter";
import Schedule from "../components/HomePage/Schedule";

const HomePage = () => {
  return (
    <div className="w-full ml-6 rounded-xl p-4">
      <AttendanceOver/>
      <h1 className="text-3xl font-bold pt-6">My schedule</h1>
      <p className="font-medium py-3">{getTodaysDate() + ", " + getTodaysDay()}</p>
      <Schedule/>
    </div>
  );
};

export default HomePage;
