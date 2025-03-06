import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { useContext, useState } from "react";
import { AuthContext } from "@/auth/context/AuthContext";
import axios from "axios";
import { dateString, daysBetween } from "../../utils/dateFormatter";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const formSchema = z.object({
  date: z.object({
    from: z.date(),
    to: z.date(),
  }),
  reason: z
    .string()
    .min(2, { message: "reason must be at least 2 characters." }),
});

const LeaveForm = ({leaves, setLeaves}) => {

  const { data } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("token");
  const teacherData = JSON.parse(localStorage.getItem("teacherData"));
  const campusId = teacherData?.campusId;
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: {},
      reason: "",
    },
  });

  async function onSubmit(formData) {
    const body = {
      from: dateString(formData.date.from),
      to: dateString(formData.date.to),
      reason: formData.reason
    };

    

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/leave/campus/${campusId}/employees`,
        body,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      console.log(response.data.success);
      console.log(response.data);
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setOpen(false)
      setLeaves(()=>[...leaves, body])
    } catch (err) {
      console.log(err);
    }
    console.log(leaves);
  }
  
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button>New Application</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Application Form</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* date range picker */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Range</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted",
                              "hover:bg-primary"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value?.from ? (
                              field.value.to ? (
                                <>
                                  {format(field.value.from, "LLL dd, y")} -{" "}
                                  {format(field.value.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(field.value.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={field.value?.from}
                            selected={field.value}
                            onSelect={field.onChange}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormDescription>
                      Select the date range for leave
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* reason input */}
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Textarea placeholder="reason of your leave" {...field} />
                    </FormControl>
                    <FormDescription>
                      Elaborate on the reason of your leave
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default LeaveForm;
