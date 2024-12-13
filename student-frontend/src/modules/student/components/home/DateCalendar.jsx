import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

const DateCalendar = () => {
  const [date, setDate] = useState(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-2xl border mx-8 bg-primary py-6 my-6 flex items-center justify-center"
    />
  );
};

export default DateCalendar;
