import { Bell, Mail, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useContext } from "react";
import { AuthContext } from "@/auth/context/AuthContext";

const Searchbar = ({sidebar, setSidebar}) => {

  const {data} = useContext(AuthContext);

  return (
    <div className="px-6 py-4 md:px-10 bg-white md:bg-transparent flex md:gap-10 items-center justify-between">
      <Menu className=" md:size-12 lg:hidden" onClick={()=>{setSidebar(true)}}/>
      {/* <input
        type="text"
        placeholder="Search"
        className="w-full px-4 py-2 border rounded-full hidden md:inline"
      /> */}

      {/* <div className="icons grid gap-4 md:gap-8 lg:gap-6 grid-cols-2">
        <div className="message size-9 p-4 w-full rounded-full border border-gray-400">
          <Mail />
        </div>
          <Mail className="border border-gray-400 p-2 size-12 lg:size-10 rounded-full" />
          <Bell  className="border border-gray-400 p-2 size-12 lg:size-10 rounded-full" />
      </div> */}
      {/* <div className="profile items-center gap-4 hidden md:flex">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <p className="text-lg text-nowrap font-medium">{data.name}</p>
      </div> */}
    </div>
  );
};

export default Searchbar;
