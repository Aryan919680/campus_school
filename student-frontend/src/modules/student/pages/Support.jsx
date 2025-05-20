import React, { useContext } from "react";
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
});

const SupportPage = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const { data } = useContext(AuthContext);

  const campusId = localStorage.getItem("campusId");
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
          type: data.role,
          campusName: data.campusName,
          year: data.year,
        },
         portal: "STUDENT"
      };

  
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/support/campus/${campusId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
   alert("Request sended")
      form.reset({
        query: "",
        errorpage: "",
      });
    } catch (error) {
      console.error("There was an error!", error);
      toast.error("There was an error submitting your query. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
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
              name="errorpage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select the section in which you are facing a problem</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="dashboard">Dashboard</SelectItem>
                          <SelectItem value="academics">TimeTable</SelectItem>
                          <SelectItem value="notices-events">Notices/Events</SelectItem>
                          <SelectItem value="library">Support</SelectItem>
                          <SelectItem value="fee-payment">Fee Payment</SelectItem>
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
