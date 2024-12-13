import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "@/auth/context/AuthContext";

const StudentDetails = () => {
  const { data } = useContext(AuthContext);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/student/${data.campusId}/fetch/${data.id}`);
        setStudent(response.data.data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudentData();
  }, [data.id]);

  return student ? (
    <div className="details bg-white rounded-xl shadow-lg max-w-xs w-full p-6 hidden md:block">
      <Avatar className="size-36 m-auto mt-10">
        <AvatarImage src={student.photo} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="text-center my-4">
        <h1 className="text-2xl font-bold text-primary-foreground">{student.name}</h1>
      </div>
      <div className="text-center text-xl font-medium pb-10">
        <p>Enrollment Id: <span className="text-primary-foreground">{student.rollNo}</span></p>
        <p> Year: <span className="text-primary-foreground">{student.year}</span></p>
        <p>Father's Name: <span className="text-primary-foreground">{student.fatherName}</span></p>
        <p>Mother's Name: <span className="text-primary-foreground">{student.motherName}</span></p>
        <p>Contact No: <span className="text-primary-foreground">{student.contactNumber}</span></p>
      </div>
    </div>
  ) : (
    <div className="text-2xl font-semibold">Loading...</div>
  );
};

export default StudentDetails;
