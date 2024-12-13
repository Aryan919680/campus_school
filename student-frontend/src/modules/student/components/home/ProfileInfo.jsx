import { AuthContext } from "@/auth/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useContext } from "react";

const ProfileInfo = () => {


  const {data} = useContext(AuthContext);
  const getGreeting = () => {
		const currentHour = new Date().getHours();
		if (currentHour < 12) {
			return "Good Morning";
		} else if (currentHour < 18) {
			return "Good Afternoon";
		} else {
			return "Good Evening";
		}
	};
  return (
    <>
      <div className="profile flex gap-4 lg:gap-6 justify-center items-center m-8">
        <Avatar className="size-24 lg:size-28">
          <AvatarImage src={data.photo} />
          <AvatarFallback>S</AvatarFallback>
        </Avatar>
        <div className="info">
          <div className="text-primary-foreground font-bold text-lg lg:text-xl text-nowrap">{getGreeting()},</div>
          <div className="font-bold text-lg lg:text-xl">{data.name.split(" ")[0]}</div>
          <div className="text-gray-400 font-bold text-lg lg:text-xl">{data.role}</div>
        </div>
      </div>
    </>
  );
};

export default ProfileInfo;
