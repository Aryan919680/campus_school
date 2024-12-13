import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/auth/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


const Marks = () => {
  const { data } = useContext(AuthContext);
  const subjects = data.subject;

  const [crrSubject, setCrrSubject] = useState(subjects[0]);
  const [crrStudents, setCrrStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [err, setError] = useState(false);

  const [currentStudent, setCurrentStudent] = useState(null);
  const [totalMarks, setTotalMarks] = useState("");
  const [scoredMarks, setScoredMarks] = useState("");
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [studentResults, setStudentResults] = useState({});
  const [selectedYear, setSelectedYear] = useState("1");
  
  async function fetchStudents() {
    setError(false);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/student/${data.campusId}/fetchByDepartment/${crrSubject.department.id}/${selectedYear}`
      );
      if (response.data.data !== undefined) setCrrStudents(response.data.data);
      else {
        setError("No student in department");
      }
    } catch (err) {
      console.log(err);
      setError("Error fetching data");
    }
  }
  
  async function fetchStudentResults(studentId) {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/results/campus/student/${studentId}`
      );
      const results = response.data.data.results;
      setStudentResults(prevState => ({ ...prevState, [studentId]: results }));
    } catch (error) {
      console.log(error);
      setError("Error fetching student results");
    }
  }

  useEffect(() => {
    fetchStudents();
  }, [crrSubject]);

  useEffect(() => {
    if (crrStudents.length > 0) {
      crrStudents.forEach(student => {
        fetchStudentResults(student.id);
      });
    }
  }, [crrStudents]);

  useEffect(() => {
    setSearchData(() =>
      crrStudents.filter((student) => student.name.includes(search))
    );
  }, [search, crrStudents]);

  async function handleSubmitMarks(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/results/campus/${data.campusId}/reg`,
        [{
          totalMarks: Number(totalMarks),
          scoredMarks: Number(scoredMarks),
          grade,
          feedback,
          subjectId: crrSubject.id,
          studentId: currentStudent.id,
        }]
      );
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      fetchStudentResults(currentStudent.id);
      closeDialog(); // Close the dialog after successful submission
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message === "Total marks must be a positive number") {
        toast.error("Please provide the valid total marks", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } 
      else if(error.response && error.response.data.message === "Scored marks must be a non-negative number") {
        toast.error("Please provide the valid Scored marks", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } 
      else if(error.response && error.response.data.message === "Grade must be a non-empty string") {
        toast.error("Please provide the valid grade", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } 
      else {
        setError(error.message);
      }
    }
  }
  

  async function handleUpdateMarks(e) {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/results/campus/${data.campusId}/${currentStudent.id}/${crrSubject.id}`,
        {
          totalMarks: Number(totalMarks),
          scoredMarks: Number(scoredMarks),
          grade,
          feedback,
        }
      );
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      fetchStudentResults(currentStudent.id);
      closeDialog(); // Close the dialog after successful update
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data.message === "Result not found for the specified student and subject.") {
        toast.error("Please provide the marks first!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        
      } 
      else if (error.response && error.response.data.message === "Total marks must be a positive number") {
        toast.error("Please provide the valid total marks", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } 
      else if(error.response && error.response.data.message === "Scored marks must be a non-negative number") {
        toast.error("Please provide the valid Scored marks", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } 
      else if(error.response && error.response.data.message === "Grade must be a non-empty string") {
        toast.error("Please provide the valid grade", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } 
      else {
        setError(error.message);
      }
    }
  }
  

  function openDialog(student) {
    setCurrentStudent(student);
    const studentMarks = studentResults[student.id]?.find(result => result.subjectId === crrSubject.id);
    setTotalMarks(studentMarks ? studentMarks.totalMarks : "");
    setScoredMarks(studentMarks ? studentMarks.scoredMarks : "");
    setGrade(studentMarks ? studentMarks.grade : "");
    setFeedback(studentMarks ? studentMarks.feedback : "");
  }
  
  function closeDialog() {
    setCurrentStudent(null);
    setTotalMarks("");
    setScoredMarks("");
    setGrade("");
    setFeedback("");
  }
  

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold pt-4 mb-4">Student Marks</h1>
      <div className="flex gap-4">
        {subjects.map((subject) => (
          <Badge
            className="text-xl px-4 py-1 cursor-pointer"
            variant={crrSubject === subject ? "" : "secondary"}
            key={subject.id}
            onClick={() => setCrrSubject(subject)}
          >
            {subject.subjectName} - {subject.department.name}
          </Badge>
        ))}
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
        <thead>
          <tr>
            <th className="p-4">Enrollment No</th>
            <th className="text-left pl-4">Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
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
</td>

                <td>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => openDialog(student)}
                        disabled={studentResults[student.id] && studentResults[student.id].some(result => result.subjectId === crrSubject.id)}
                      >
                        Provide Marks
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Provide Marks for {student.name}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmitMarks}>
                        <div>
                          <label >Total Marks</label>
                          <Input className="mb-4"
                            value={totalMarks}
                            onChange={(e) => setTotalMarks(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label>Scored Marks</label>
                          <Input className="mb-4"
                            value={scoredMarks}
                            onChange={(e) => setScoredMarks(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label>Grade</label>
                          <Input className="mb-4"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            required
                          />
                        </div>
                        <div>
  <label>Feedback</label>
  <Input className="mb-4"
    value={feedback}
    onChange={(e) => setFeedback(e.target.value)}
    required
  />
</div>

                        <Button className="mt-5" type="submit">Submit</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => openDialog(student)}>Update Marks</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Marks for {student.name}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleUpdateMarks}>
                        <div>
                          <label>Total Marks</label>
                          <Input className="mb-4"
                            value={totalMarks}
                            onChange={(e) => setTotalMarks(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label>Scored Marks</label>
                          <Input className="mb-4"
                            value={scoredMarks}
                            onChange={(e) => setScoredMarks(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label>Grade</label>
                          <Input className="mb-4"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            required
                          />
                        </div>
                        <div>
  <label>Feedback</label>
  <Input className="mb-4"
    value={feedback}
    onChange={(e) => setFeedback(e.target.value)}
    required
  />
</div>

                        <Button className="mt-5" type="submit">Update</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default Marks;
