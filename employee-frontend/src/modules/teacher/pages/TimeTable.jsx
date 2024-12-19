import { AuthContext } from "@/auth/context/AuthContext";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
	Clock10,
	MoveLeft,
	PenSquareIcon,
	SquarePen,
	Plus,
	Save,
	Trash2,
} from "lucide-react";
import { useContext, useEffect, useState, useCallback, useMemo } from "react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as ShadCalendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
// import "../../../../node_modules/react-big-calendar/lib/sass/styles.scss";
// Instead of importing the SCSS directly, use the built CSS
import "react-big-calendar/lib/css/react-big-calendar.css";
import { dateTimeFormatter } from "../utils/dateFormatter";

const localizer = momentLocalizer(moment);

const daysofWeek = [
	"sunday",
	"monday",
	"tuesday",
	"wednesday",
	"thursday",
	"friday",
	"saturday",
];

const initTable = {
	monday: [],
	tuesday: [],
	wednesday: [],
	thursday: [],
	friday: [],
	saturday: [],
	sunday: [],
};

const TimeTable = () => {
	const { data } = useContext(AuthContext);
	const [displayForm, setDisplayForm] = useState(false);

	const [timeTable, setTimeTable] = useState(initTable);
	const [subjects, setSubjects] = useState([]);
	const [teachers, setTeachers] = useState([]);

	const [activeDay, setActiveDay] = useState(daysofWeek[0]);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const [dayTable, setDayTable] = useState([]);
	const [date, setDate] = useState(new Date());

	const [holidays, setHolidays] = useState({});
	const [showAddHolidayForm, setShowAddHolidayForm] = useState(false);
	const [newHoliday, setNewHoliday] = useState({ date: "", reason: "" });
	const [editingHoliday, setEditingHoliday] = useState(null);
	const [editHolidayData, setEditHolidayData] = useState({
		date: "",
		reason: "",
	});

	async function fetchTimeTable() {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_BASE_URL}/api/v1/timeTable/fetch-byDepartment/${
					data.departmentId
				}`
			);
			// console.log(response.data.timeTable[0]);
			if (response.data.timeTable.length === 0) {
				const postResponse = await axios.post(
					`${import.meta.env.VITE_BASE_URL}/api/v1/timeTable/upload/${data.id}`,
					{
						departmentId: data.departmentId,
					}
				);
			} else {
				response.data.timeTable[0].sunday = [];
				setTimeTable(response.data.timeTable[0]);
			}
		} catch (e) {
			console.log(e);
			setError("couldn't fetch time table");
		}
	}

	async function fetchDept() {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_BASE_URL}/api/v1/department/fetch/${
					data.departmentId
				}`
			);
			console.log(response);
			setSubjects(response.data.data.subjects);
		} catch (e) {
			setError("couldn't fetch time department data");
			console.log(e);
		}
	}

	async function fetchAllTeachers() {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_BASE_URL}/api/v1/teacher/${
					data.campusId
				}/fetchAll`
			);
			// console.log(response.data.data);
			setTeachers(response.data.data);
			setLoading(false);
		} catch (e) {
			setError("couldn't fetch teachers");
			console.log(e);
		}
	}

	const fetchHolidays = useCallback(async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_BASE_URL}/api/v1/holiday/fetch/${data.campusId}`
			);
			setHolidays(response.data);
		} catch (e) {
			console.error(e);
			setError("Couldn't fetch holidays");
		}
	}, []);

	const formatDate = (dateString) => {
		if (!dateString) return "Invalid Date";
		const options = { day: "2-digit", month: "2-digit", year: "numeric" };
		return new Date(dateString).toLocaleDateString("en-GB", options);
	};

	const addHoliday = async () => {
		try {
			// Ensure campusId is added to the newHoliday object
			const holidayData = {
				...newHoliday,
				campusId: data.campusId,
			};

			// Send the POST request with the updated holidayData
			const response = await axios.post(
				`${import.meta.env.VITE_BASE_URL}/api/v1/holiday/create/${data.id}`,
				holidayData
			);
			const addedHoliday = response.data.holiday;
			const monthName = new Date(addedHoliday.date).toLocaleString("default", {
				month: "long",
			});

			addedHoliday.date = formatDate(addedHoliday.date);

			setHolidays((prevHolidays) => ({
				...prevHolidays,
				[monthName]: [...(prevHolidays[monthName] || []), addedHoliday],
			}));
			setShowAddHolidayForm(false);
			setNewHoliday({ date: "", reason: "" });
		} catch (e) {
			console.error(e);
			setError("Couldn't add holiday");
		}
	};

	const updateHoliday = async () => {
		if (!editingHoliday) {
			setError("No holiday selected for editing");
			return;
		}
		try {
			const response = await axios.put(
				`${import.meta.env.VITE_BASE_URL}/api/v1/holiday/update/${
					data.id
				}/${editingHoliday}`,
				editHolidayData,
				{ headers: { Authorization: `Bearer ${data.token}` } }
			);
			const updatedHoliday = response.data.holiday;
			updatedHoliday.date = formatDate(updatedHoliday.date);

			setHolidays((prevHolidays) => {
				const updatedHolidays = { ...prevHolidays };
				for (const month in updatedHolidays) {
					updatedHolidays[month] = updatedHolidays[month].map((holiday) =>
						holiday.id === editingHoliday ? updatedHoliday : holiday
					);
				}
				return updatedHolidays;
			});
			setEditingHoliday(null);
			setEditHolidayData({ date: "", reason: "" });
		} catch (e) {
			console.error(e);
			if (e.response && e.response.status === 404) {
				setError("Holiday not found");
			} else {
				setError("Couldn't update holiday");
			}
		}
	};

	const deleteHoliday = async (holidayId) => {
		try {
			await axios.delete(
				`${import.meta.env.VITE_BASE_URL}/api/v1/holiday/delete/${
					data.id
				}/${holidayId}`,
				{ headers: { Authorization: `Bearer ${data.token}` } }
			);
			setHolidays((prevHolidays) => {
				const updatedHolidays = { ...prevHolidays };
				for (const month in updatedHolidays) {
					updatedHolidays[month] = updatedHolidays[month].filter(
						(holiday) => holiday.id !== holidayId
					);
					if (updatedHolidays[month].length === 0) {
						delete updatedHolidays[month];
					}
				}
				return updatedHolidays;
			});
		} catch (e) {
			console.error(e);
			if (e.response && e.response.data && !e.response.data.success) {
				setError(e.response.data.message);
			} else {
				setError("Couldn't delete holiday");
			}
		}
	};

	function addPeriod() {
		const newPeriod = {
			timeTo: "10:00",
			timeFrom: "11:00",
			subjectId: null,
			teacherId: null,
			subjectName: "",
			teacherName: "",
		};
		setTimeTable((prevState) => ({
			...prevState,
			[activeDay]: [...prevState[activeDay], newPeriod],
		}));
	}

	async function saveTimeTable() {
		console.log("clicked");
		try {
			const response = await axios.put(
				`${import.meta.env.VITE_BASE_URL}/api/v1/timeTable/update/${data.id}`,
				{
					...timeTable,
					departmentId: data.departmentId,
				}
			);
			console.log(response.data);
		} catch (err) {
			console.log(err);
			setError("couldn't update time table");
		}
	}

	async function dayTimeTable() {
		let day = daysofWeek[date.getDay()];
		console.log("hiiiiiii");
		if (day == "sunday") {
			console.log("holiday");
		} else {
			console.log("timetable", timeTable[daysofWeek[date.getDay()]]);
			let todayTimeTable = [];
			timeTable[daysofWeek[date.getDay()]].forEach((period) => {
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
		fetchDept();
		fetchAllTeachers();
		fetchHolidays();
	}, [fetchHolidays]);

	const holidaysList = useMemo(
		() =>
			Object.keys(holidays).map((month) => {
				if (holidays[month].length === 0) return null;
				return (
					<div key={month} className="h-fit">
						<h4 className="text-black mt-4 font-semibold text-2xl">{month}</h4>
						<ul className="mt-2 border-[#FE7044] border rounded-lg h-fit">
							{holidays[month].map((holiday) => (
								<li key={holiday.id} className="">
									<div className="block p-4 w-64">
										<div className="mb-4">
											<p className="mt-1 text-xs font-medium text-gray-800">
												{holiday.date}
											</p>
											<strong className="font-medium text-base text-black">
												{holiday.reason}
											</strong>

											<div className="flex gap-2 justify-end items-center mt-2 mb-4">
												<button
													className="p-2 rounded-full bg-[#6E62E5] hover:bg-white text-white hover:text-[#6E62E5]"
													onClick={() => {
														setEditingHoliday(holiday.id);
														setEditHolidayData({
															date: holiday.date,
															reason: holiday.reason,
														});
													}}
												>
													<SquarePen className="size-4" />
												</button>
												<button
													className="p-2 rounded-full bg-[#FE7044] hover:bg-white text-white hover:text-[#FE7044]"
													onClick={() => deleteHoliday(holiday.id)}
												>
													<Trash2 className="size-4" />
												</button>
											</div>
										</div>
									</div>
								</li>
							))}
						</ul>
					</div>
				);
			}),
		[holidays]
	);

	useEffect(() => {
		dayTimeTable();
	}, [date, timeTable]);

	return (
		<div className="p-6 w-full">
			<div className="flex justify-between">
				<p className="text-2xl font-bold">Time Table</p>
				<Button
					className="flex gap-2"
					onClick={() => {
						setDisplayForm(!displayForm);
					}}
				>
					{displayForm ? (
						<>
							<MoveLeft className="size-5" />
							<p>go back</p>
						</>
					) : (
						<>
							<PenSquareIcon className="size-5" />
							<p>edit</p>
						</>
					)}
				</Button>
			</div>

			{/* table&form  */}

			{displayForm ? (
				<>
					<div className="flex gap-4">
						{daysofWeek.map((day) => {
							return (
								<Badge
									key={day}
									variant={activeDay === day ? "" : "outline"}
									className="text-lg cursor-pointer"
									onClick={() => {
										setActiveDay(day);
										console.log(timeTable);
									}}
								>
									{day}
								</Badge>
							);
						})}
					</div>
					{loading ? (
						<div>loading</div>
					) : (
						<div className="w-full py-6">
							{timeTable[activeDay].map((period) => {
								return (
									<div
										className="flex gap-4 justify-between items-center"
										key={period.subjectName}
									>
										<select
											name="subject"
											id="subject"
											className="p-2"
											onChange={(e) => {
												// console.log(e.target.value.split(" ",2));
												period.subjectId = parseInt(
													e.target.value.split(" ", 2)[0]
												);
												period.subjectName = e.target.value.split(" ", 2)[1];
												// console.log(timeTable);
												setTimeTable(timeTable);
											}}
										>
											{/* bug */}
											{subjects.map((subject) => {
												return (
													<>
														{subject.id === period.subjectId ? (
															<option
																key={subject.id}
																value={`${subject.id} ${subject.subjectName}`}
																selected
															>
																{subject.subjectName}
															</option>
														) : (
															<option
																key={subject.id}
																value={`${subject.id} ${subject.subjectName}`}
															>
																{subject.subjectName}
															</option>
														)}
													</>
												);
											})}
										</select>
										<select
											name="teacher"
											id="teacher"
											onChange={(e) => {
												// console.log(e.target.value);
												period.teacherId = parseInt(
													e.target.value.substring(
														0,
														e.target.value.indexOf(" ")
													)
												);
												period.teacherName = e.target.value.substring(
													e.target.value.indexOf(" ") + 1
												);
												console.log(timeTable);
												setTimeTable(timeTable);
											}}
										>
											{teachers.map((teacher) => {
												// console.log(teacher.id);
												return (
													<>
														{teacher.id == period.teacherId ? (
															<option
																value={`${teacher.id} ${teacher.name}`}
																selected
															>
																{teacher.name}
															</option>
														) : (
															<option value={`${teacher.id} ${teacher.name}`}>
																{teacher.name}
															</option>
														)}
													</>
												);
											})}
										</select>
										<input
											type="time"
											defaultValue={period.timeFrom}
											onChange={(e) => {
												period.timeFrom = e.target.value;
												setTimeTable(timeTable);
											}}
										/>
										<input
											type="time"
											defaultValue={period.timeTo}
											onChange={(e) => {
												period.timeTo = e.target.value;
												setTimeTable(timeTable);
											}}
										/>
										<div
											className="p-2 text-white rounded-lg bg-red-700"
											onClick={() => {
												const filteredPeriods = timeTable[activeDay].filter(
													(allPeriod) => allPeriod != period
												);

												setTimeTable((prevState) => ({
													...prevState,
													[activeDay]: filteredPeriods,
												}));
											}}
										>
											<Trash2 />
										</div>
									</div>
								);
							})}
						</div>
					)}
					<div className="flex gap-4 justify-end">
						<Button className="flex gap-2" onClick={addPeriod}>
							<Plus className="size-5" />
							Add
						</Button>
						<Button className="flex gap-2" onClick={saveTimeTable}>
							<Save className="size-5" />
							Save
						</Button>
					</div>
				</>
			) : (
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
			)}
			<div className="rounded-xl border border-white bg-[#EFEEFC] p-4 w-full mt-6">
				<h3 className="text-2xl font-bold text-black text-center">Holidays</h3>
				{Object.keys(holidays).length === 0 ? (
					<p className="text-gray-300">No holidays available</p>
				) : (
					<div className="w-fit px-12">
						<div className="flex flex-wrap justify-start gap-2">
							{holidaysList}
						</div>
					</div>
				)}
				{showAddHolidayForm || editingHoliday ? (
					<div className="mt-4">
						<input
							type="date"
							value={editingHoliday ? editHolidayData.date : newHoliday.date}
							onChange={(e) =>
								editingHoliday
									? setEditHolidayData({
											...editHolidayData,
											date: e.target.value,
									  })
									: setNewHoliday({ ...newHoliday, date: e.target.value })
							}
							className="p-2 border rounded mr-2"
						/>
						<input
							type="text"
							placeholder="Reason"
							value={
								editingHoliday ? editHolidayData.reason : newHoliday.reason
							}
							onChange={(e) =>
								editingHoliday
									? setEditHolidayData({
											...editHolidayData,
											reason: e.target.value,
									  })
									: setNewHoliday({ ...newHoliday, reason: e.target.value })
							}
							className="p-2 border rounded mr-2"
						/>
						<Button
							onClick={editingHoliday ? updateHoliday : addHoliday}
							className="hover:bg-green-800 bg-green-500 text-white px-4 py-2 rounded"
						>
							Save
						</Button>
						<Button
							onClick={() => {
								setEditingHoliday(null);
								setShowAddHolidayForm(false);
								setNewHoliday({ date: "", reason: "" });
								setEditHolidayData({ date: "", reason: "" });
							}}
							className="bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded ml-2"
						>
							Cancel
						</Button>
					</div>
				) : (
					<div className="flex justify-end mt-4">
						<Button
							onClick={() => setShowAddHolidayForm(true)}
							className="bg-green-500 px-8 py-2 rounded-lg text-white hover:bg-green-800"
						>
							Add Holiday
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default TimeTable;
