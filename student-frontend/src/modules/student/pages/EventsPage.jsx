import EventCarousel from "../components/events/EventCarousel";
import { events } from "@/assets/data/data.json";
import EventPoster from "../components/events/EventPoster";
import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { useContext} from "react";
import { AuthContext } from "@/auth/context/AuthContext";

const EventsPage = () => {
  
  const { data } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [searchData, setSearchData] = useState([])

  useEffect( () => {
    async function fetchData() {
      try{
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/event/fetchAll/${data.campusId}`
        );
        // console.log(response.data.data);
        setEvents(response.data.data);
        setSearchData(response.data.data);
        console.log(events);
      }
      catch(err){
        console.error(err);
      }
    }
    fetchData();
  }, []);

  useEffect(()=>{
    setSearchData(()=>events.filter((event)=>event.title.includes(search)))
  },[search])


  return (
    <div className="flex flex-col mx-6 mb-6">
      <EventCarousel events={events} />
      <h1 className="my-6 text-3xl font-bold">Upcoming Events</h1>
      <Input className="bg-white w-72" placeholder="search" onChange={(e)=>setSearch(e.target.value)}/>
      <div className="grid xl:grid-cols-2 gap-4">
        {searchData.map((event) => {
          return <EventPoster  event={event} />;
        })}
        {/* {JSON.stringify(events)} */}
      </div>
    </div>
  );
};

export default EventsPage;
