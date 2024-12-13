import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const LessonPlanTable = ({ refresh, setRefresh }) => {
  const [selectedLessonPlan, setSelectedLessonPlan] = useState(null);

  const lessonPlans = [
    { id: 1, name: "Lesson 1", subjectDepartment: "Math-Science", verified: true },
    { id: 2, name: "Lesson 2", subjectDepartment: "English-Arts", verified: false },
    { id: 3, name: "Lesson 3", subjectDepartment: "Physics-Engineering", verified: true },
  ];

  const handleDelete = () => {
    console.log("Delete lesson plan:", selectedLessonPlan);
    setSelectedLessonPlan(null);
  };

  return (
    <>
      <table className="w-full text-left bg-white rounded-xl shadow-lg">
        <thead>
          <tr className="text-lg font-medium text-gray-500 border-b-2">
            <th className="py-4 pl-6">Lesson Plan</th>
            <th>Subject-Department</th>
            <th>Action</th>
            <th>Verification Status</th>
          </tr>
        </thead>
        <tbody>
          {lessonPlans.map((lesson) => (
            <tr key={lesson.id} className="text-xl font-medium border-b-2 hover:bg-slate-100">
              <td className="py-6 pl-6">{lesson.name}</td>
              <td>{lesson.subjectDepartment}</td>
              <td>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => setSelectedLessonPlan(lesson)}>Delete</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure?</DialogTitle>
                      <DialogDescription>
                        Do you really want to delete this lesson plan? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <Button onClick={handleDelete}>Confirm Delete</Button>
                  </DialogContent>
                </Dialog>
              </td>
              <td>
                {lesson.verified ? (
                  <span className="text-green-500">✔</span>
                ) : (
                  <span className="text-red-500">✖</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default LessonPlanTable;
