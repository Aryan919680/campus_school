import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MessageCircleQuestion } from "lucide-react";
import { AuthContext } from "@/auth/context/AuthContext";

const formSchema = z.object({
  query: z
    .string({ message: "Field required" })
    .max(300, { message: "Maximum 300 characters allowed" }),
  errorpage: z.string({ required_error: "This is required" }),
  errorrole: z.string({ required_error: "This is required" }),
});

const SupportPage = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const { data } = useContext(AuthContext);
  const [errorRole, setErrorRole] = useState("");

  const teacherData = JSON.parse(localStorage.getItem("teacherData"));
  const campusId = teacherData?.campusId;
  const token = localStorage.getItem("token");

  const onSubmit = async (supportdata) => {
    try {
      const payload = {
        title: supportdata.errorpage,
        description: supportdata.query,
        snapshot: {
          name: data.name,
          email: data.email,
          contactNo: data.contactNumber,
          type: "teacher",
          campusName: data.campusName,
          errorrole: supportdata.errorrole,
        },
          portal: "EMPLOYEE"
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/support/campus/${campusId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

   alert("Request Sended")
      form.reset({
        query: "",
        errorpage: "",
        errorrole: "",
      });
    } catch (error) {
      console.error("Error submitting support query:", error);
      toast.error("There was an error submitting your query. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <ToastContainer />
      <div className="flex gap-2 text-3xl md:text-4xl items-center font-bold py-6">
        <MessageCircleQuestion className="md:size-10 text-primary-foreground" />
        Support/Help
      </div>
      <div className="w-8/12 mx-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="errorrole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select from which side you are facing problem</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setErrorRole(value);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select source of problem" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="errorpage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select the page</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select page" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {errorRole === "admin" && (
                            <>
                              <SelectItem value="dashboard">Dashboard</SelectItem>
                              <SelectItem value="classroom">Classroom</SelectItem>
                              <SelectItem value="provide-marks">Provide Marks</SelectItem>
                              <SelectItem value="leave">Leave</SelectItem>
                            </>
                          )}
                          {errorRole === "student" && (
                            <>
                              <SelectItem value="classroom">Classroom</SelectItem>
                              <SelectItem value="provide-marks">Provide Marks</SelectItem>
                              <SelectItem value="library">Library</SelectItem>
                              <SelectItem value="timetable">Timetable</SelectItem>
                            </>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Query/Feedback</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="text-white w-full md:w-auto bg-primary-foreground hover:text-primary-foreground"
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>

      <div className="flex items-center gap-6 w-8/12 my-6">
        <div className="line h-px w-full bg-gray-400"></div>
        <h1 className="font-semibold text-center text-sm md:text-md md:text-nowrap text-gray-800">
          Or Mail us at logo@schoolerp.com
        </h1>
        <div className="line h-px w-full bg-gray-400"></div>
      </div>
    </div>
  );
};

export default SupportPage;
