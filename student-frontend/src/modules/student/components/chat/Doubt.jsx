import { CircleHelp } from "lucide-react";
import Message from "../home/Message";
import { messages } from "@/assets/data/data.json";

const Doubt = () => {
  return (
    <div className="bg-primary m-6 rounded-xl px-6">
      <div className="heading text-2xl font-bold flex gap-2 items-center justify-center pt-6">
      <CircleHelp /> Ask Doubt
      </div>
      <div className="grid grid-rows-4 divide-y-2 divide-white pb-2 ">
        {messages.map((msg) => {
          return <Message key={msg.id} name={msg.name} msg={msg.message} />;
        })}
      </div>
    </div>
  );
};

export default Doubt;
