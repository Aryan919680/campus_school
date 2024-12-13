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

import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "@/auth/context/AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import { useContext } from "react";
// import { AuthContext } from "@/auth/context/AuthContext";
// import axios from "axios";

const formSchema = z.object({
  title: z.string().min(2, { message: "Minimum 2 characters required" }),
  subject: z.string(),
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, { message: "File is required" })
    .refine((files) => files[0]?.size <= 2 * 1024 * 1024, {
      message: "File size should be less than 2MB",
    }) // Example: max file size 2MB
    .refine((files) => files[0]?.type === "application/pdf", {
      message: "Only PDF files are allowed",
    }),
});

// const classes = [3, 5, 7, 8];

const BookForm = ({setRefresh}) => {

  const {data} = useContext(AuthContext);

  const [open, setOpen] = useState(false);

  const subjects = data.subject;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subject: "",
      file: null,
    },
  });

  async function onSubmit(formData) {

    let cloudData = new FormData();

    cloudData.append("file",formData.file[0])
    cloudData.append("cloud_name","dcpvd9tay")
    cloudData.append("upload_preset","pdf_preset")

    
    try {
      let cloudResponse = await axios.post("https://api.cloudinary.com/v1_1/dcpvd9tay/auto/upload",cloudData)
      console.log(cloudResponse.data.url);

      let response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/library/create-book`,{
        name: formData.title,
        file: cloudResponse.data.url,
        teacherId: data.id,
        subject:formData.subject,
        campusId:data.campusId
      })     
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
      setRefresh(true);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button>Add Book</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Form</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            <div>
              <Label htmlFor="title">Title</Label>
              <Controller
                name="title"
                control={control}
                defaultValue=""
                render={({ field }) => <Input type="text" {...field} />}
              />
              {errors.title && <p>{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor="subject">Subject:</Label>
              <Controller
                name="subject"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {subjects.map((subject)=>{
                          return <SelectItem key={subject.subjectName} value={subject.subjectName}>{subject.subjectName}</SelectItem>
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.subject && <p>{errors.subject.message}</p>}
            </div>

            <div className="flex flex-col">
              <Label htmlFor="file">Upload file:</Label>
              <Controller
                name="file"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <input
                  className="py-1 font-medium"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                )}
              />
              {errors.file && <p>{errors.file.message}</p>}
            </div>

            <Button type="submit">Submit</Button>
          </form>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default BookForm;
