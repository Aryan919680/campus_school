import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const LessonPlanForm = ({ setRefresh }) => {
  const [open, setOpen] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      subjectDepartment: "",
      lessonPlanFile: null,
    },
  });

  const subjects = ["Math-Science", "English-Arts", "Physics-Engineering"];

  const onSubmit = (formData) => {
    console.log("Form submitted:", formData);
    setOpen(false);
    setRefresh(true);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button>Add Lesson Plan</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lesson Plan Form</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
            <div>
              <Label htmlFor="subjectDepartment">Subject-Department</Label>
              <Controller
                name="subjectDepartment"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a subject-department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {subjects.map((subject, index) => (
                          <SelectItem key={index} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="lessonPlanFile">Upload Lesson Plan:</Label>
              <Controller
                name="lessonPlanFile"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => field.onChange(e.target.files)}
                    className="py-1 font-medium"
                  />
                )}
              />
            </div>

            <Button type="submit">Submit</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LessonPlanForm;
