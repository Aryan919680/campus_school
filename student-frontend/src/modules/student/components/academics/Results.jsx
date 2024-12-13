import { MoveRight, NotepadText } from "lucide-react";
import { assignments } from "@/assets/data/data.json";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/auth/context/AuthContext";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Results = ({ setTotalGrade }) => {
  const { data } = useContext(AuthContext);
  const [results, setResults] = useState([]);

  async function fetchData() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/results/campus/student/${data.id}`
      );
      console.log(response.data.data.results);
      setResults(response.data.data.results);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let tempTotal = 0;
    results.map((subject) => {
      tempTotal += subject.scoredMarks;
    });
    if (results.length > 0) {
      const averageScore = tempTotal / results.length;
      console.log(averageScore);
      setTotalGrade(averageScore.toFixed(2));
    } else {
      console.error("No results data available");
    }
  }, [results]);

  return (
    <Dialog>
      <DialogTrigger className="flex gap-2 text-primary-foreground">viewGrades <MoveRight /></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Result</DialogTitle>
        </DialogHeader>
        <div className="grid grid-rows-4 divide-y-2 divide-white pb-2 ">
          {results.map((subject) => {
            return (
              <Assignment
                subject={subject.subjectName}
                obtMarks={subject.scoredMarks}
                totalMarks={subject.totalMarks}
              />
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Assignment = ({ subject, obtMarks, totalMarks }) => {
  const diff = totalMarks - obtMarks;

  return (
    <div className="flex gap-16 justify-between items-center py-3">
      <p className="text-xl font-bold pb-1">{subject}</p>
      <div className="text-xl font-bold text-gray-600">
        <span
          className={`text-3xl ${diff ? "text-orange-500" : "text-green-600"}`}
        >
          {obtMarks}
        </span>
        /{totalMarks}
      </div>
    </div>
  );
};

export default Results;
