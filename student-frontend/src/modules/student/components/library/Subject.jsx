import { Toggle } from "@/components/ui/toggle";

const Subject = ({ Subjects, filterSubs, setFilterSubs }) => {

  return (
    <div>
      <h1 className="text-2xl font-bold py-10 ">Subjects</h1>
      {Subjects.map((item) => {
        return (
          <Toggle
            key={item}
            className=" rounded-full text-md border border-primary-foreground m-2 text-nowrap"
            onPressedChange={(pressed) => {
                if (pressed) {
                    filterSubs.push(`${item}`)
                    setFilterSubs(filterSubs)
                }
                else{
                    filterSubs.pop(`${item}`)
                    setFilterSubs(filterSubs)
                }
            }}
          >
            {item}
          </Toggle>
        );
      })}
    </div>
  );
};

export default Subject;
