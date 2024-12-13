// import { AuthContext } from "@/auth/context/AuthContext";
import { Badge } from "@/components/ui/badge";
// import axios from "axios";

// import { leaves } from "@/assets/data.json";
// import { useContext, useEffect, useState } from "react";
import { dateString } from "../../utils/dateFormatter";

const LeaveTable = ({leaves}) => {
  // const { data } = useContext(AuthContext);
  // const [leaves, setLeaves] = useState([]);

  // useEffect(() => {
  //   async function fetchLeaves(id) {
  //     try {
  //       const response = await axios.get(
  //         `https://erp-system-backend.onrender.com/api/v1/leave/fetch-leaves/${id}`
  //       );
  //       setLeaves(response.data.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  //   fetchLeaves(data.id);
  // }, []);

  return (
    <table className="w-full text-left bg-white rounded-xl shadow-lg">
      <tr className="text-lg font-medium text-gray-500 border-b-2">
        <td className="py-4 pl-6">Reason</td>
        <td>From</td>
        <td>To</td>
        <td>No of Days</td>
        <td>Status</td>
      </tr>
      { 

      leaves?

      leaves.map((leave) => (
        <tr
          key={leave.id}
          className="text-xl font-medium border-b-2 hover:bg-slate-100"
        >
          <td className="py-6 pl-6">{leave.reason}</td>
          <td>{dateString(leave.dateFrom)}</td>
          <td>{dateString(leave.dateTo)}</td>
          <td>{leave.noOfDays}</td>
          <td>
            <Badge>{leave.status || "pending" }</Badge>
          </td>
        </tr>
      ))
      :<div className="text-center py-4 text-xl font-medium" >No leaves</div>
      }
    </table>
  );
};

export default LeaveTable;
