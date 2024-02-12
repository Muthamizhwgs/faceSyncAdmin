import React from "react";
import Logo from "../../assets/bird.jpg";
import { Link, useLocation } from "react-router-dom";
import SidebarHeader from "./SidebarHeader";
const Admin = () => {
  let location = useLocation();
  return (
    <div className="w-full h-[100vh] bg-slate-600">
      <SidebarHeader />

      <div className="border-t border-gray-500">
        <ul className="flex flex-col gap-3 p-5">
          <Link to={"/home/manageAdmin"}>
            {" "}
            <li
              className={`${
                location.pathname == "/home/manageevents" ? "bg-second" : ""
              } flex flex-row   items-center gap-2 p-2 text-white text-[14px] font-medium
            hover:bg-second hover:duration-200 rounded hover:ease-in-out`}
            >
              <FaUser />
              Manage Events
            </li>
          </Link>
          <Link to={"/home/manage-photographer"}>
            <li
              className={`${
                location.pathname == "/home/manage-photographer"
                  ? "bg-second"
                  : ""
              } flex flex-row items-center gap-2 p-2 text-white text-[14px] font-medium
              hover:bg-second hover:duration-200 rounded hover:ease-in-out`}
            >
              <img src={pg} className="w-5 h-[18px]" />
              Manage Photographer{" "}
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Admin;
