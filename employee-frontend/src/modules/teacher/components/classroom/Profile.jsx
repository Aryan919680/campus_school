import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone } from "lucide-react";

const Profile = ({student, departmentId}) => {

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button variant="outline" className="w-full m-0 hover:bg-primary">View Profile</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Student Profile</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
            <div key={student.id} className="flex justify-between py-6">
              <div className="flex gap-6">
                  <Avatar className="size-20">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                      <p className="text-lg font-bold text-nowrap">{student.name}</p>
                      <p className="text-lg font-bold text-nowrap pb-1">Class: {departmentId}</p>
                      <div className="flex gap-4"><Phone/><Mail/></div>
                  </div>
              </div>
              <div className="font-medium">
                <p>Enrollment Id: <span className="text-primary-foreground">{student.rollNo}</span></p>
                <p>Academic Year: <span className="text-primary-foreground">2023-24</span></p>
                <p>Father Name: <span className="text-primary-foreground">{student.fatherName}</span></p>
                <p>Mother Name: <span className="text-primary-foreground">{student.motherName}</span></p>
                <p>Contact no: <span className="text-primary-foreground">{student.contactNumber}</span></p>
              </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default Profile;
