import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Message = ({name, msg}) => {
    return (
        <div className="message flex gap-2 items-center px-4 py-4">
          <Avatar className="size-10 lg:size-14">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>S</AvatarFallback>
          </Avatar>
          <div>
            <div className="name text-lg md:text-xl font-bold">{name}</div>
            <div className="msg text-sm line-clamp-1 pr-5">
              {msg}
            </div>
          </div>
        </div>
      );
}

export default Message
