import React from "react";
import { Link, useLocation } from "react-router-dom";
import SidebarHeader from "./SidebarHeader";
import { FaUser } from "react-icons/fa";
import pg from "../../assets/pg.png";
import user from "../../assets/user.png";
import FaceSync from "./FaceSync";

const SuperAdmin = () => {
  let location = useLocation()

  return (
    <div className="w-full h-[100vh] bg-first">
      <SidebarHeader />
      <div className="border-t border-gray-500 h-[75%] relative">
        <ul className="flex flex-col gap-3 p-5 ">
          <Link to={"/home/manageAdmin"}>
            {" "}
            <li
              className={`${location.pathname == "/home/manageAdmin"
                  ? "bg-second"
                  : ""
                } flex flex-row   items-center gap-2 p-2 text-white text-[14px] font-medium
            hover:bg-second hover:duration-200 rounded hover:ease-in-out`}
            >
              <img className="w-4 h-4" src={user}/>
              Event Organizer
            </li>
          </Link>
          <Link to={"/home/manage-photographer"}>
            <li
              className={`${location.pathname == "/home/manage-photographer"
                  ? "bg-second"
                  : ""
                } flex flex-row items-center gap-2 p-2 text-white text-[14px] font-medium
              hover:bg-second hover:duration-200 rounded hover:ease-in-out`}
            >
              <img src={pg} className="w-4 h-4" />
              Photographer{" "}
            </li>
          </Link>
          <Link to={"/home/users"}>
            {" "}
            <li
              className={`${location.pathname == "/home/users"
                  ? "bg-second"
                  : ""
                } flex flex-row   items-center gap-2 p-2 text-white text-[14px] font-medium
            hover:bg-second hover:duration-200 rounded hover:ease-in-out`}
            >
              <FaUser className="w-4 h-4"/>
              Users
            </li>
          </Link>
        </ul>
        <FaceSync/>
      </div>
    </div>
  );
};

export default SuperAdmin;
