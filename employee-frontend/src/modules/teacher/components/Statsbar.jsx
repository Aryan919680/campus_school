import ProfileInfo from "./ProfileInfo";
import DateCalendar from './DateCalendar'

const Statsbar = () => {
  return (
    <div className="h-full rounded-3xl mx-6 border bg-white shadow-2xl hidden md:inline">
      <ProfileInfo/>
      <DateCalendar/>
    </div>
  );
};

export default Statsbar;
