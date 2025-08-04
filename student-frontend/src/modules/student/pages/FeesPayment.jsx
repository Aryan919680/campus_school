import { BadgeIndianRupee } from "lucide-react";
import StudentDetails from "../components/fees/StudentDetails";
import FeesDetails from "../components/fees/FeesDetails";

const FeesPayment = () => {
  return (
    <div className="flex flex-col md:flex-row w-full gap-6 mx-6">
      <FeesDetails />
    </div>
  );
};

export default FeesPayment;
