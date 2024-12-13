import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MoveRight } from "lucide-react";

const Attendance = ({ attendanceArr }) => {
  return (
    <Dialog>
      <DialogTrigger className="flex gap-2">
        view Attendance <MoveRight />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Attendance in all the classes</DialogTitle>
        </DialogHeader>
        {attendanceArr.map((item)=>{
            return <AttSubject key={item.subjectId} subject={item.subject} data={item.percentage.toFixed(2)}/>
        })}
      </DialogContent>
    </Dialog>
  );
};

const AttSubject = ({subject, data}) => {
  return (
    <div className="flex justify-between items-center py-3">
      <div>
        <p className="text-2xl font-medium pb-1">{subject}</p>
        <p className="text-sm text-primary-foreground font-semibold flex items-center gap-2 text-nowrap"></p>
      </div>
      <div className="text-xl text-gray-600 ml-10">
        <span className="text-xl text-green-600">{data}%</span>
      </div>
    </div>
  );
};

export default Attendance;
