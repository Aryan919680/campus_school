import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomEvent from "./CustomEvent";

const localizer = momentLocalizer(moment);

const AttendanceCalendar = ({ events, onSelectEvent }) => (
	<div className="mb-4">
		<Calendar
			localizer={localizer}
			events={events}
			startAccessor="start"
			endAccessor="end"
			style={{ height: 500 }}
			onSelectEvent={onSelectEvent}
			components={{
				event: CustomEvent,
			}}
		/>
	</div>
);

export default AttendanceCalendar;
