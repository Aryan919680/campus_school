import Searchbar from "./components/Searchbar";
import { Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import OutsideClick from "./hooks/outsideClick";
import Sidebar from "./components/Sidebar";
import Statsbar from "./components/Statsbar";

const Dashboard = () => {
  const [sideBar, setSideBar] = useState(false);
  const boxRef = useRef(null);
  const boxOutsideClick = OutsideClick(boxRef);

  useEffect(() => {
    if (boxOutsideClick) {
      setSideBar(false);
    }
  }, [boxOutsideClick]);

  return (
    <div className="flex w-full">
      <Sidebar sidebar={sideBar} boxRef={boxRef} />
      <div className="flex flex-col w-full bg-secondary z-0">
      <Searchbar sidebar={sideBar} setSidebar={setSideBar} />
        <div className="flex justify-between">
          <Outlet />
        <Statsbar/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
