import React, { useEffect, useState } from "react";
// import logo from "../assets/facesynclogo.png";
import ManageEvents from "./Admin/manageEvents";
import { Link, Outlet } from "react-router-dom";
import SuperAdmin from "../components/sidebar/superAdmin";
import Admin from "../components/sidebar/Admin";
import Photographer from "../components/sidebar/Photographer";
import ManageAdmin from "./manageAdmin";
import { Event } from "./event";
import "../App.css";

const Home = () => {
  const [roleLoggedIn, setRoleLoggedIn] = useState("");
  const [reload, setreload] = useState(false);

  useEffect(() => {
    setRoleLoggedIn(localStorage.getItem("facesyncrole"));
  }, [reload]);

  console.log(roleLoggedIn);

  return (
    <>
      <div>
        <div className="lg:flex flex-col w-1/5  h-screen  hidden md:fixed left-0 top-0 bg-primary overflow-y-scroll">
          {roleLoggedIn == "superAdmin" ? (
            <SuperAdmin />
          ) : roleLoggedIn == "admin" ? (
            <Admin />
          ) : (
            <Photographer />
          )}
        </div>

        <div
          className="w-full lg:w-4/5  h-16 flex flex-row justify-between px-4 fixed left-1/5 right-0 top-0
      bg-fourth  z-20 border-b border-stone-200"
        ></div>

        {/* <div className="main">
          {roleLoggedIn == "superAdmin" ? (
            <ManageAdmin />
          ) : roleLoggedIn == "admin" ? (
            <ManageEvents />
          ) : (
            <Event />
          )}
        </div> */}
        <div className="flex flex-col absolute left-1/5 right-0 top-16 w-full lg:w-4/5 pt-8 px-5 sm:px-8 z-0 ">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Home;
