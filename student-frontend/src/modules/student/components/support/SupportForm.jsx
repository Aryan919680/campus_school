import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea"


import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  enrollNum: z
    .string({ required_error: "Enrollment number is required" })
    .min(2, {
      message: "Enter Student's Enrollment Number.",
    }),
  ParentPhoneNum: z
    .string({ required_error: "phone number is required" })
    .length(10, { message: "Must be exactly 10 characters long" }),
  ParentEmail: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  Feedback: z
    .string({ message: "field required" })
    .max(300, { message: "max 300 characters allowed" }),
});

function onSubmit(data) {
    console.log(data.enrollNum);
    console.log(data.ParentPhoneNum);
    console.log(data.ParentEmail);
    console.log(data.Feedback);
}


const SupportForm = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  return (
    <div className="w-8/12 mx-12">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="enrollNum"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student Enrollment Number</FormLabel>
                <FormControl>
                  <Input {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ParentPhoneNum"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ParentEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Email ID</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Feedback"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Query/Feedback</FormLabel>
                <FormControl>
                <Textarea {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="text-white w-full md:w-auto bg-primary-foreground hover:text-primary-foreground">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default SupportForm;
