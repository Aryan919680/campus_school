import { AuthContext } from "@/auth/context/AuthContext";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar as ShadCalendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
// import "../../../../../node_modules/react-big-calendar/lib/sass/styles.scss";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { dateTimeFormatter } from "../../utils/dateFormatter";

const localizer = momentLocalizer(moment);

const initTable = {
	monday: [],
	tuesday: [],
	wednesday: [],
	thursday: [],
	friday: [],
	saturday: [],
};

const weekday = [
	"sunday",
	"monday",
	"tuesday",
	"wednesday",
	"thursday",
	"friday",
	"saturday",
];

const TimeTable = () => {
	const { data } = useContext(AuthContext);
	const [timeTable, setTimeTable] = useState(initTable);
	const [error, setError] = useState(false);
	const [dayTable, setDayTable] = useState([]);
	const [date, setDate] = useState(new Date());
	// console.log("timetable");

	async function fetchTimeTable() {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_BASE_URL}/api/v1/timeTable/fetch-byDepartment/${
					data.departmentId
				}`
			);
			console.log(response.data.timeTable[0]);
			if (response.data.timeTable.length) {
				setTimeTable(response.data.timeTable[0]);
			} else setError("timetable not created");
		} catch (e) {
			console.log(e);
			setError("error", e);
		}
	}

	async function dayTimeTable() {
		let day = weekday[date.getDay()];
		console.log("hiiiiiii");
		if (day == "sunday") {
			console.log("holiday");
		} else {
			console.log(timeTable[weekday[date.getDay()]]);
			let todayTimeTable = [];
			timeTable[weekday[date.getDay()]].forEach((period) => {
				todayTimeTable.push({
					title: period.subjectName,
					start: dateTimeFormatter(date, period.timeFrom),
					end: dateTimeFormatter(date, period.timeTo),
				});
			});
			setDayTable(todayTimeTable);
		}
	}

	useEffect(() => {
		setError(false);
		fetchTimeTable();
		dayTimeTable();
	}, []);

	useEffect(() => {
		dayTimeTable();
	}, [date, timeTable]);

	return (
		<div className="w-full mt-6">
			{!error ? (
				<>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant={"outline"}
								className={cn(
									"w-[280px] justify-start text-left font-normal mb-6",
									!date && "text-muted-foreground"
								)}
							>
								<CalendarIcon className="mr-2 h-4 w-4" />
								{date ? format(date, "PPP") : <span>Pick a date</span>}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0">
							<ShadCalendar
								mode="single"
								selected={date}
								onSelect={setDate}
								initialFocus
							/>
						</PopoverContent>
					</Popover>
					<div className="w-full">
						<Calendar
							localizer={localizer}
							events={dayTable}
							date={date}
							defaultView="day"
							startAccessor="start"
							endAccessor="end"
							toolbar={false}
							min={dateTimeFormatter(date, "6:00")}
							max={dateTimeFormatter(date, "19:00")}
						/>
					</div>
				</>
			) : (
				<div className="text-xl font-bold text-red-600">{error}</div>
			)}
		</div>
	);
};

export default TimeTable;
("");
