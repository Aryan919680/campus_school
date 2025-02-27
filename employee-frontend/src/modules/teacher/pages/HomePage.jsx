import { MoveRight, StarIcon } from "lucide-react";
import React, { useState } from "react";
import AttendanceOver from "../components/HomePage/AttendanceOver";
import { getTodaysDate, getTodaysDay } from "../utils/dateFormatter";
import Schedule from "../components/HomePage/Schedule";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AttendanceComponent from "../components/HomePage/AttendanceComponent";
const HomePage = () => {
  const[showAttendancePage,setShowAttendancePage] = useState(false);
  const data = ()=>{
   setShowAttendancePage(true);
  }
  return (
    <div className="w-full ml-6 rounded-xl p-4">
       {/* <AttendanceOver/> */}
       
      <h1 className="text-3xl font-bold pt-6 mb-6">Attendence Management</h1>
      <div className="flex justify-between">
      <Button
              variant={"outline"}
              className= {cn(
                "w-[280px] justify-start text-left font-normal",
                 "text-muted-foreground"
              )}
              onClick={data}
            >
            
             <span>Mark Student Employees</span>
            </Button>
            <Button
              variant={"outline"}
              className= {cn(
                              "w-[280px] justify-start text-left font-normal",
                               "text-muted-foreground"
                            )}
              
            >
            
             <span>Leave Requests</span>
            </Button>
            </div>
      {/* <p className="font-medium py-3">{getTodaysDate() + ", " + getTodaysDay()}</p>  */}
      {/* <Schedule/> */}
      {showAttendancePage && <AttendanceComponent />}
    </div>
  );
};

export default HomePage;
