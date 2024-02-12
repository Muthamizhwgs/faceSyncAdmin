import { useState } from "react";
import Login from "./pages/Login";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ManageEvents from "./pages/Admin/manageEvents";
import ManageAdmin from "./pages/supeAdmin/manageAdmin";
import ManageAdmin from "./pages/supeAdmin/manageAdmin";
import { Event } from "./pages/event";
import ManagePhotographer from "./pages/Admin/ManagePhotographer";
import New from "./pages/photogar/New";
import ManageAdminBySuperAdmin from "./pages/supeAdmin/manageAdmin";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" Component={Login} />
      </Routes>
      <Routes>
        <Route path="/home" Component={Home}>
          <Route path="/home/manageevents" Component={ManageEvents} />
          <Route path="/home/manageAdmin" Component={ManageAdmin} />
          <Route path="/home/new" Component={New} />
          <Route path="/home/event" Component={Event} />
          <Route path="/home/manage-photographer" Component={ManagePhotographer} />
          <Route path="/home/manage-admin" Component={ManageAdminBySuperAdmin} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
