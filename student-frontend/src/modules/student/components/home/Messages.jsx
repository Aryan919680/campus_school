import { MessageSquareMore } from "lucide-react";

import { messages } from "@/assets/data/data.json";
import Message from "./Message";

const Messages = () => {

  return (
    <div className="bg-primary rounded-2xl mx-8">
      <div className="title text-2xl font-bold pt-4 flex gap-2 justify-center items-center">
        <MessageSquareMore />
        Messages
      </div>
      <div className="grid grid-cols-1 divide-y-2 divide-gray-300">
        {messages.slice(0,2).map((msg) => {
          return <Message key={msg.id} name = {msg.name} msg = {msg.message}/>
        })}
      </div>
    </div>
  );
};

// const Message = ({name, msg}) => {
//   return (
//     <div className="message flex gap-2 items-center px-4 py-4">
//       <Avatar className="size-12 lg:size-16">
//         <AvatarImage src="https://github.com/shadcn.png" />
//         <AvatarFallback>S</AvatarFallback>
//       </Avatar>
//       <div>
//         <div className="name text-lg md:text-xl font-bold">{name}</div>
//         <div className="msg text-sm line-clamp-1 pr-5">
//           {msg}
//         </div>
//       </div>
//     </div>
//   );
// };

export default Messages;
