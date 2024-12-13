import LeaveTable from "../components/LeavePage/LeaveTable";
import LeaveForm from "../components/LeavePage/LeaveForm";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/auth/context/AuthContext";
import axios from "axios";

import { Input } from "@/components/ui/input";

const LeavePage = () => {
  const { data } = useContext(AuthContext);
  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);

  useEffect(() => {
    async function fetchLeaves(id) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/leave/fetch-leaves/${id}`
        );
        if(response.data.data){
          setLeaves(response.data.data);
          setSearchData(response.data.data);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchLeaves(data.id);
  }, []);

  function handleSearch(e) {
    setSearch(e.target.value);
  }

  useEffect(() => {
    setSearchData(() =>
      leaves.filter((leave) => leave.reason.includes(search))
    );
  }, [search, leaves]);

  return (
    <div className="w-full mx-6 md:mr-0">
      <div className="w-full flex justify-between align-bottom my-4">
        <h1 className="text-3xl font-bold">Leave Application</h1>
        <LeaveForm leaves={leaves} setLeaves={setLeaves} />
      </div>
      <Input
        className="w-72 bg-
      white mb-6"
        placeholder="Search"
        onChange={handleSearch}
      />
      <LeaveTable leaves={searchData} />
    </div>
  );
};

export default LeavePage;
