import { MoveRight } from "lucide-react";
import FacultyAttendance from "./FacultyAttendance";
import ViewClass from "./ViewClass";
import { useContext } from "react";
import { AuthContext } from "@/auth/context/AuthContext";

const AttendanceOver = () => {

  const {data} = useContext(AuthContext);

  return (
    <div className="flex flex-wrap gap-6 w-full justify-center">
      <div className="bg-white flex items-center flex-col rounded-2xl shadow-lg p-6 w-full md:w-58 lg:w-64">
        <h1 className="text-xl lg:text-2xl font-bold">Total Subjects</h1>
        <p className="text-4xl font-bold my-6 text-primary-foreground">
          {/* {data.subject.length} */}
        </p>
        <div className="flex gap-2 text-primary-foreground">
          <ViewClass/>
        </div>
      </div>
      <div className="bg-white flex flex-col items-center rounded-2xl shadow-lg p-6 w-full md:w-58 lg:w-64">
        <h1 className="text-xl lg:text-2xl font-bold">Total Attendance</h1>
        <p className="text-3xl font-bold my-6 self-center text-gray-600">
          <span className="text-4xl text-primary-foreground">60</span>%
        </p>
        <div className="flex gap-2 self text-primary-foreground">
          <FacultyAttendance />
        </div>
      </div>
    </div>
  );
};

export default AttendanceOver;
