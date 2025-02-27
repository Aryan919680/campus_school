import { AuthContext } from "@/auth/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MoveRight } from "lucide-react";
import { useContext } from "react";

const ViewClass = () => {
  const { data } = useContext(AuthContext);

  return (
    <Dialog>
      <DialogTrigger className="flex gap-2">
        View Class <MoveRight />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subjects</DialogTitle>
        </DialogHeader>

        {/* {data.subject.map((item) => (
          <div className="text-2xl font-bold">{item.subjectName}</div>
        ))} */}
      </DialogContent>
    </Dialog>
  );
};

export default ViewClass;
