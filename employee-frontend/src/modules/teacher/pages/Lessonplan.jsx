import { useState } from "react";
import LessonPlanForm from "../components/LessonPlan/LessonPlanForm";
import LessonPlanTable from "../components/LessonPlan/LessonPlanTable";
import { Bell } from 'lucide-react';
import NotificationPanel from "../components/LessonPlan/NotificationPanel";

const LessonPlan = () => {
  const [refresh, setRefresh] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="w-full mx-6 md:mr-0 relative">
      <div className="w-full flex justify-between items-center my-4">
        <h1 className="text-3xl font-bold">Lesson Plans</h1>
        <div className="flex items-center gap-4">
          <LessonPlanForm setRefresh={setRefresh} />
          <button
            className="relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-8 h-8 text-gray-600" />
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </div>
      <LessonPlanTable refresh={refresh} setRefresh={setRefresh} />
      {showNotifications && (
        <NotificationPanel setShowNotifications={setShowNotifications} />
      )}
    </div>
  );
};

export default LessonPlan;
