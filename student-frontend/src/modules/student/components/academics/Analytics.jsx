import { AuthContext } from "@/auth/context/AuthContext";
import axios from "axios";
import { MoveRight, StarIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Attendance from "./Attendance";
import Results from "./Results";

const Analytics = () => {

  const { data } = useContext(AuthContext);
  const studentID = data.id;
  const [attendanceArr, setAttendanceArr] = useState([]);
  let [totAttendance, setTotAttendance] = useState(0);

  const [totalGrade, setTotalGrade] = useState(0);

  async function fetchAtt() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/attendance/get-percentage/${studentID}`
      );
      console.log(response.data.data);
      setAttendanceArr(response.data.data)

      let sum = 0

      response.data.data.forEach((subject)=>{
        sum += subject.percentage
      })
      // console.log(totAttendance);
      setTotAttendance((sum/response.data.data.length).toFixed(2))
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchAtt();
  }, []);

  return (
    <div className="flex flex-wrap gap-6 w-full justify-center">
      <div className="bg-white flex flex-col rounded-2xl shadow-lg p-6 w-full md:w-58 lg:w-64">
        <h1 className="text-xl lg:text-2xl font-bold">Grade Average</h1>
        <p className="text-3xl font-bold my-6 self-center text-gray-600">
          <span className="text-4xl text-primary-foreground">{totalGrade}</span>
          /100
        </p>
        <div className="flex gap-2 text-primary-foreground">
          <Results setTotalGrade={setTotalGrade}/>
        </div>
      </div>
      <div className="bg-white flex flex-col rounded-2xl shadow-lg p-6 w-full md:w-58 lg:w-64">
        <h1 className="text-xl lg:text-2xl font-bold">Attendance</h1>
        <p className="text-3xl font-bold my-6 self-center text-gray-600">
          <span className="text-4xl text-primary-foreground">
            {totAttendance}
          </span>
          %
        </p>
        <div className="flex gap-2 text-primary-foreground">
          <Attendance attendanceArr={attendanceArr} />
        </div>
      </div>
      <div className="bg-white flex flex-col rounded-2xl shadow-lg p-6 w-full md:w-58 lg:w-64">
        <h1 className="text-xl lg:text-2xl font-bold">Student Rating</h1>
        <p className="text-3xl font-bold my-6 self-center text-gray-600">
          <span className="text-4xl text-primary-foreground">6</span>/30
        </p>
        <div className="flex gap-2 self-center text-primary-foreground">
          Top 10 <StarIcon />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
