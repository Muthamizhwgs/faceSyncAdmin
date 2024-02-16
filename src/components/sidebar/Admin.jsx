import React from "react";
import pg from "../../assets/pg.png";
import { Link, useLocation } from "react-router-dom";
import SidebarHeader from "./SidebarHeader";
import event from "../../assets/event.png";
import { FaCalendar, FaCalendarAlt, FaCalendarCheck, FaCalendarDay, FaCalendarTimes, FaCalendarWeek, FaRegCalendar, FaRegCalendarCheck, FaUser } from "react-icons/fa";
import FaceSync from "./FaceSync";

const Admin = () => {
  let location = useLocation();
  return (
    <div className="w-full h-[100vh] bg-first font-[Inter]">
      <SidebarHeader />

      <div className="border-t border-gray-500 space-y-80">
        <ul className="flex flex-col gap-3 p-5">
          <Link to={"/home/manageevents"}>
            {" "}
            <li
              className={`${
                location.pathname == "/home/manageevents" ? "bg-second" : ""
              } flex flex-row   items-center gap-2 p-2 text-white text-[14px] font-medium
            hover:bg-second hover:duration-200 rounded hover:ease-in-out`}
            >
              <img  src={event} className="w-[17px] h-[17px]"/>
              Events
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
              <img src={pg} className="w-[18px] h-[18px]" />
              Photographers{" "}
            </li>
          </Link>
          {/* <Link to={"/home/manageMyevents"}>
            {" "}
            <li
              className={`${location.pathname == "/home/manageMyevents"
                  ? "bg-second"
                  : ""
                } flex flex-row   items-center gap-2 p-2 text-white text-[14px] font-medium
            hover:bg-second hover:duration-200 rounded hover:ease-in-out`}
            >
              <FaRegCalendarCheck />
              My Events
            </li>
          </Link> */}
        </ul>
        <FaceSync/>
      </div>
    </div>
  );
};

export default Admin;
