import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext} from "react";
import { AuthContext } from "@/auth/context/AuthContext";

const MainContent = () => {

  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const { data } = useContext(AuthContext);

  useEffect( () => {
    async function fetchData() {
      try{
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/event/fetchAll/${data.campusId}`
        );
        // console.log(response.data.data);
        setEvents(response.data.data);
        console.log(events);
      }
      catch(err){
        console.error(err);
      }
    }
    fetchData();
  }, []);

  return (
    <Carousel
      className="self-center border rounded-xl w-full md:w-full"
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
    >
      <CarouselContent className="h-96">
      {events.map((event) => (
          <CarouselItem key={events.id} className="flex justify-center cursor-pointer">
            <img src={event.photo} alt="" className="w-full rounded-xl bg-cover" onClick={()=>{navigate("/events")}} />
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselPrevious />
          <CarouselNext /> */}
    </Carousel>
  );
};

export default MainContent;
