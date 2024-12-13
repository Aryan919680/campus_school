import { reviews } from "@/assets/data/data.json";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Reply, SmilePlus } from "lucide-react";

const Reviews = () => {
  return (
    <div>
      {reviews.map((item) => {
        return <Review key={item.id} item={item}/>
      })}
    </div>
  );
};

const Review = ({item}) => {
    return ( 
        <div className="bg-white rounded-xl shadow-md p-6 my-4" >
          <div className="heading flex items-center gap-2">
            <Avatar className="size-12 md:size-14">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
                <p className="text-lg font-bold">{item.teacher}</p>
                <p className="text-sm text-gray-600">{item.subject} teacher</p>
            </div>
          </div>
          <div className="pt-4">{item.message}</div>
          <div className="flex justify-between pt-4">
          <SmilePlus className="size-10 p-2 text-white bg-primary-foreground rounded-full"/>
          <Reply className="size-10 p-2 text-white bg-primary-foreground rounded-full"/>
          </div>
        </div>
     );
}

export default Reviews;
