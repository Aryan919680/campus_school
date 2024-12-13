import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";

import eventsImg from "@/assets/images/events.png";

const MainContent = ({ events }) => {
  return (
    <Carousel
      className="self-center border rounded-xl w-full md:w-10/12"
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
          <CarouselItem key={events.id} className="flex justify-center">
            <img src={event.photo} alt="" className="w-full rounded-xl bg-cover" />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default MainContent;
