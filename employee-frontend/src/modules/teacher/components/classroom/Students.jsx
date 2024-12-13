import { Badge } from "@/components/ui/badge";
import { teacher, classes } from "@/assets/data.json";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Profile from "./Profile";
  

const Students = () => {
  const [activeClass, setActiveClass] = useState(teacher.classes[0]);
  const [activeClassData, setActiveClassData] = useState(
    classes[teacher.classes[0].toString()]
  );

  function handleBadgeCLick(e) {
    const classID = e.target.lastChild.data;
    setActiveClass(parseInt(classID));
    setActiveClassData(classes[classID]);
  }

  return (
    <>
      <div className="flex gap-6 w-full justify-center my-6">
        {teacher.classes.map((item) => {
          return (
            <Badge
              className="text-2xl px-4 py-1 cursor-pointer"
              variant={activeClass == item ? "" : "secondary"}
              key={item}
              onClick={handleBadgeCLick}
            >
              Class {item}
            </Badge>
          );
        })}
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        {activeClassData.map((student) => (
          <div key={student.id} className="flex gap-6 bg-white p-6 rounded-xl shadow-md items-center">
              <Avatar className="size-20">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                  <p className="text-lg font-medium text-nowrap pb-2">{student.name}</p>
                  <Profile/>
              </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default Students;
