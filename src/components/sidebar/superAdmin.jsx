import React from "react";
import { Link } from "react-router-dom";
import SidebarHeader from "./SidebarHeader";
import { FaUser } from "react-icons/fa";
import pg from "../../assets/pg.png";

const SuperAdmin = () => {
  return (
    <div className="w-full h-[100vh] bg-first">
      <SidebarHeader />
      <div className="border-t border-gray-500">
        <ul className="flex flex-col gap-3 p-5">
          <Link to={"/home/manageAdmin"}>
            {" "}
            <li
              className={`${
                location.pathname == "/home/manageAdmin"
                  ? "bg-second"
                  : ""
              } flex flex-row   items-center gap-2 p-2 text-white text-[14px] font-medium
            hover:bg-second hover:duration-200 rounded hover:ease-in-out`}
            >
              <FaUser />
              Manage Admin
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
              <img src={pg} className="w-4 h-4"/>
              Manage Photographer{" "}
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default SuperAdmin;