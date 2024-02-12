import { useState } from "react";
import Login from "./pages/Login";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ManageEvents from "./pages/Admin/manageEvents";
import ManageAdmin from "./pages/supeAdmin/manageAdmin";
import { Event } from "./pages/event";
import ManagePhotographer from "./pages/Admin/ManagePhotographer";
<<<<<<< HEAD
import Myevents from './pages/photographer/MyEvents'
=======
import New from "./pages/photogar/New";
import ManageAdminBySuperAdmin from "./pages/supeAdmin/manageAdmin";
>>>>>>> 5e98a7102b512a2f4dc59645877955190f3f3cff

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
<<<<<<< HEAD
          <Route path="/home/manage-admin" Component={ManageAdmin} />
          <Route path="/home/manageMyevents" Component={Myevents} />
=======
          <Route path="/home/manage-admin" Component={ManageAdminBySuperAdmin} />
>>>>>>> 5e98a7102b512a2f4dc59645877955190f3f3cff
        </Route>
      </Routes>
    </>
  );
}

export default App;
