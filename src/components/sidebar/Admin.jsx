import React from "react";
import pg from "../../assets/pg.png";
import { Link, useLocation } from "react-router-dom";
import SidebarHeader from "./SidebarHeader";
import { FaUser } from "react-icons/fa";

const Admin = () => {
  let location = useLocation();
  return (
    <div className="w-full h-[100vh] bg-first">
      <SidebarHeader />

      <div className="border-t border-gray-500">
        <ul className="flex flex-col gap-3 p-5">
          <Link to={"/home/manageevents"}>
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
