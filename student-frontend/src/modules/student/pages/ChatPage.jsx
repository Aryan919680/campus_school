import Call from "../components/chat/Call";
import Doubt from "../components/chat/Doubt";

const ChatPage = () => {
  return (
    <div className="flex">
      <Call />
      <div className="bg-white p-1 rounded-2xl mx-6 w-4/12 shadow-lg">
          <Doubt />
      </div>
    </div>
  );
};

export default ChatPage;
