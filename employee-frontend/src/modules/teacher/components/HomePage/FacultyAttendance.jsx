import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoveRight } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/auth/context/AuthContext";
import axios from "axios";

import { dateString } from "../../utils/dateFormatter";

const FacultyAttendance = () => {
  const [date, setDate] = useState(new Date());
  const { data } = useContext(AuthContext);
  const[attendance ,setAttendance] = useState("Loading..");
  const [error, setError] = useState(false);

  async function fetchAtt() {
    setError(false)
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/attendance/faculty-attendanceById/${dateString(date)}/${data.id}`
      );
      setAttendance(response.data.status);
    } catch (error) {
        if(error.response.status == 404){
          setError("Hasn't been marked yet")
        }
    }
  }

  useEffect(() => {
    fetchAtt();
  }, [date]);

  return (
    <Dialog>
      <DialogTrigger className="flex gap-2">
        View Attendance <MoveRight />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Attendance</DialogTitle>
        </DialogHeader>
        
        {error ? <div className="text-4xl font-semibold text-red-700">{error}</div> : <div className={`text-4xl font-semibold ${attendance=="Present"?"text-green-700":"text-orange-600" } `}>{attendance}</div>}
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
      </DialogContent>
    </Dialog>
  );
};

export default FacultyAttendance;
