import { teachers } from "@/assets/data/data.json";
import Message from "../home/Message";
import CallBlock from "./CallBlock";

const Call = () => {
  return (
    <div className="w-full md:w-9/12 flex flex-col md:mx-6 md:mr-0">
      <h1 className="text-4xl font-bold py-5">Schedule Call</h1>
      <div className="flex flex-wrap justify-center items-center gap-4">
        {teachers.map((teacher) => {
          return <CallBlock name={teacher.name} dest={teacher.designation} />;
        })}
      </div>
    </div>
  );
};

export default Call;
