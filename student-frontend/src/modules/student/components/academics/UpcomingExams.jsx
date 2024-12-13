import { ListTodo } from "lucide-react";
import { exams } from '@/assets/data/data.json'

const UpcomingExams = () => {
  return (
    <div className="bg-primary m-6 rounded-xl px-6">
      <div className="heading text-2xl font-bold flex gap-2 items-center justify-center pt-6">
        <ListTodo /> Upcoming Exams{" "}
      </div>

      <div className="grid grid-rows-4 divide-y-2 divide-white py-4 ">
        {exams.map((exam) => {
          return (
            <Exam
              subject={exam.subject}
              date={exam.date}
            />
          );
        })}
      </div>
    </div>
  );
};

const Exam = ({subject, date}) => {
    return ( 
        <div className="flex justify-between items-center text-lg font-semibold py-2">
            <p>{subject}</p>
            <p>{date}</p>
        </div>
     );
}

export default UpcomingExams;
