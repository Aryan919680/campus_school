import React, { useRef, useContext, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MessageCircleQuestion } from "lucide-react";
import { AuthContext } from "@/auth/context/AuthContext";

// Updated schema with year field
const formSchema = z.object({
  query: z
    .string({ message: "Field required" })
    .max(300, { message: "Maximum 300 characters allowed" }),
  errorpage: z.string({ required_error: "This is required" }),
  errorrole: z.string({ required_error: "This is required" }),
  photo: z.any().optional(), // Handle file input as any type
});

const SupportPage = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
  });
  const { data } = useContext(AuthContext);

  // State for managing the first dropdown selection
  const [errorRole, setErrorRole] = useState("");
  const fileInputRef = useRef(null);

  const onSubmit = async (supportdata) => {
    try {
      let photoUrl = "";

      if (supportdata.photo && supportdata.photo.length > 0) {
        const formData = new FormData();
        formData.append("file", supportdata.photo[0]);
        formData.append("cloud_name", "dcpvd9tay");
        formData.append("upload_preset", "pdf_preset");

        const cloudResponse = await axios.post("https://api.cloudinary.com/v1_1/dcpvd9tay/auto/upload", formData);
        photoUrl = cloudResponse.data.url;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/support/create`,
        {
          photo: photoUrl,
          name: data.name,
          email: data.email,
          contactNo: data.contactNumber,
          query: supportdata.query,
          type: 'teacher',
          campusName: data.campusName,
          errorpage: supportdata.errorpage,
          errorrole: supportdata.errorrole,
        }
      );

      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      form.reset({
        query: "",
        errorpage: "",
        errorrole: "",
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
              name="errorrole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select from which side you are facing problem</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setErrorRole(value); // Update the state based on the selected value
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
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Photo</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => field.onChange(e.target.files)}
                    />
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
