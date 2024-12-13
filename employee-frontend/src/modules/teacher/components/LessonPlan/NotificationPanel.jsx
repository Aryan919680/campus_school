import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";

const NotificationPanel = ({ setShowNotifications }) => {
  const [selectedNotification, setSelectedNotification] = useState(null);

  const notifications = [
    {
      id: 1,
      type: "Attendance flag",
      message: "The attendance of class 12th is not marked on 23/12/2024.",
      link: "#",
    },
    {
      id: 2,
      type: "Lesson plan verification",
      message: "Lesson plan uploaded for English- class 12th.",
      link: "/sample-lesson-plan.pdf",
    },
  ];

  const handleTakeAction = (notification) => {
    setSelectedNotification(notification);
  };

  return (
    <div className="absolute top-20 right-0 bg-white border shadow-lg rounded-lg w-80 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Notifications</h2>
        <button
          onClick={() => setShowNotifications(false)}
          className="text-gray-500 hover:text-gray-800"
        >
          X
        </button>
      </div>
      <div className="mt-4 space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="p-4 bg-gray-100 rounded-lg shadow">
            <h3 className="text-md font-medium">{notification.type}</h3>
            <p className="text-sm text-gray-600">{notification.message}</p>
            {notification.type === "Lesson plan verification" && (
              <div className="flex gap-2 mt-2">
                <a href={notification.link} target="_blank" rel="noopener noreferrer">
                  <Button>View</Button>
                </a>
                <Button onClick={() => handleTakeAction(notification)}>Take Action</Button>
              </div>
            )}
          </div>
        ))}
      </div>
      {selectedNotification && (
        <Dialog open={true} onOpenChange={() => setSelectedNotification(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Take Action</DialogTitle>
              <DialogDescription>
                Lesson Plan for {selectedNotification.message}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <p>Class: 12th</p>
              <p>Subject: English</p>
              <p>Lesson Plan: {selectedNotification.type}</p>
            </div>
            <div className="flex gap-4 mt-6">
              <Button className="bg-green-500 hover:bg-green-600">Verify</Button>
              <Button className="bg-red-500 hover:bg-red-600">Reject</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default NotificationPanel;
