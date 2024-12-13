import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTodaysDate, getTodaysDay } from "../utils/dateFormatter";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/auth/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { CircleCheckBig, OctagonAlert } from "lucide-react";
import axios from "axios";
import Profile from "../components/classroom/Profile";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

const ClassRoom = () => {
  const { data } = useContext(AuthContext);
  const subjects = data.subject;

  const [present, setPresent] = useState([]);
  const [crrSubject, setCrrSubject] = useState(subjects[0]);
  const [crrStudents, setCrrStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [date, setDate] = useState(new Date());
  const [err, setError] = useState(false);
  const [selectedYear, setSelectedYear] = useState("1");

  async function fetchStudents() {
    setError(false);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/student/${data.campusId}/fetchByDepartment/${crrSubject.department.id}/${selectedYear}`
      );
      if (response.data.data != undefined) setCrrStudents(response.data.data);
      else {
        setError("no student in department");
        setPresent([]);
      }
    } catch (err) {
      console.log(err);
      setError("error fetching data");
    }
  }

  async function fetchAttendance(date) {
    let dd = date.getDate();
    let mm = date.getMonth() + 1; // Months are zero-indexed
    const yy = date.getFullYear();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const datestring = dd + "-" + mm + "-" + yy;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/attendance/byDate/${crrSubject.id}/${datestring}`
      );
      console.log(response.data.success);

      if (response.data.success) {
        let tempArr = [];
        response.data.data.forEach((element) => {
          if (element.status == "Present") {
            tempArr.push(element.studentId);
          }
        });
        // console.log(tempArr);
        setPresent(tempArr);
        // console.log(pastAttendance);
      }
    } catch (error) {
      if (error.response.status != 404) {
        console.log(error.response.status);
        setError(error.message);
      }
    }
  }

  async function initPostRequest() {
    try {
      const response = axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/attendance/mark`,
        {
          subjectId: crrSubject.id,
          selectedStudents: [],
        }
      );
      console.log(response.data);

    } catch (error) {
      if (error.response.status != 409) {
        console.log(error);
        setError(error.message);
      }
    }
  }

  useEffect(() => {
    setPresent([]);
    initPostRequest();
    fetchStudents();
    fetchAttendance(date);
    console.log("subject changed");
  }, [crrSubject, date]);

  useEffect(() => {
    setSearchData(() =>
      crrStudents.filter((student) => student.name.includes(search))
    );
  }, [search, crrStudents]);

  async function handleSubmit() {

    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    const yy = date.getFullYear();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const datestring = dd + "-" + mm + "-" + yy;

    console.log("put",datestring);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/attendance/update-attendance`,
        {
          subjectId: crrSubject.id,
          selectedStudents: present,
          date:datestring
        }
      );
      console.log(response.data);
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold pt-4">Student Attendance</h1>
      <p className="font-medium py-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </p>
      <div className="flex gap-4">
        {subjects.map((subject) => {
          return (
            <Badge
              className="text-xl px-4 py-1 cursor-pointer"
              variant={crrSubject == subject ? "" : "secondary"}
              key={subject.id}
              onClick={() => {
                setCrrSubject(subject);
              }}
            >
              {subject.subjectName} - {subject.department.name}
            </Badge>
          );
        })}
      </div>
      <div className="flex items-center">
  <Input
    className="bg-white w-72"
    placeholder="Search"
    onChange={(e) => setSearch(e.target.value)}
  />
  <select
    value={selectedYear}
    onChange={(e) => {
      setSelectedYear(e.target.value);
      fetchStudents(); // Fetch students when the year changes
    }}
    className="ml-auto bg-white border p-2"
  >
    <option value="1">Year 1</option>
    <option value="2">Year 2</option>
    <option value="3">Year 3</option>
    <option value="4">Year 4</option>
  </select>
</div>
      <table className="w-full my-6 bg-white text-center align-baseline">
        <tr>
          <th className="p-4">Enrollment No</th>
          <th className="text-left pl-4">Name</th>
          <th>Attendance</th>
          <th>Profile</th>
        </tr>
        {err ? (
    <tr>
      <td colSpan="3" className="text-lg font-medium text-red-600 py-6 flex items-center gap-4">
        {err}
      </td>
    </tr>
  ) : crrStudents.length === 0 ? (
    <tr>
      <td colSpan="3" className="text-lg font-medium py-6">
        No students found for the selected year.
      </td>
    </tr>
  ) :  (
          searchData.map((student) => (
            <tr key={student.id}>
              <td className="font-bold text-xl">{student.rollNo}</td>
              <td className="flex gap-2 items-center py-4 pl-4">
                <Avatar className="size-12">
                  <AvatarImage src={student.photo || "https://github.com/shadcn.png"} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className="text-xl font-medium">{student.name}</h1>
                {present.includes(student.id) && (
                  <CircleCheckBig className="size-5" color="#62ce3b" />
                )}
              </td>
              <td>
                <Button
                  onClick={() => {
                    if (present.includes(student.id)) {
                      setPresent(present.filter((id) => id !== student.id));
                    } else {
                      setPresent([...present, student.id]);
                    }
                  }}
                >
                  {present.includes(student.id) ? "Unmark" : "Mark Attendance"}
                </Button>
              </td>
              <td>
                <Profile
                  student={student}
                  departmentId={crrSubject.department.id}
                />
              </td>
            </tr>
          ))
        )}
      </table>

      {err ? (
        <Button disabled>Submit</Button>
      ) : (
        <Button onClick={handleSubmit}>Submit</Button>
      )}
      <ToastContainer />
    </div>
  );
};

export default ClassRoom;
