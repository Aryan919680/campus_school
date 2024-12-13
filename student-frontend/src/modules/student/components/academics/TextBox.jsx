import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TextBox = () => {
  return (
    <div className="flex gap-4 md:gap-6 my-6 p-4 md:p-6 bg-primary rounded-xl shadow-lg">
      <Avatar className="size-12 md:size-16">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <input
        type="text"
        placeholder="What's on your mind, Simran ?"
        className="w-full px-4 py-2 border rounded-xl md:text-lg"
      />
    </div>
  );
};

export default TextBox;
