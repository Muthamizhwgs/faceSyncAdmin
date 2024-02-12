import React, { useEffect, useState } from "react";
import logo from "../assets/facesynclogo.png";
import ManageEvents from "./Admin/manageEvents";
import { Link } from 'react-router-dom';
import SuperAdmin from "../components/sidebar/superAdmin";
import Admin from "../components/sidebar/Admin";
import Photographer from "../components/sidebar/Photographer";
import ManageAdmin from "./manageAdmin";
import { Event } from "./event";
import "../App.css"

const Home = () => {
    const [roleLoggedIn, setRoleLoggedIn] = useState("");
    const [reload, setreload] = useState(false);

    useEffect(() => {
        setRoleLoggedIn(localStorage.getItem("facesyncrole"));
    }, [reload]);


    return (
        <>
            <div>
                <div className="side">
                    {
                        roleLoggedIn == 'superAdmin' ? <SuperAdmin /> : roleLoggedIn == 'admin' ? <Admin /> : <Photographer />
                    }
                </div>

                <div className="main">
                    {
                        roleLoggedIn == 'superAdmin' ? <ManageAdmin /> : roleLoggedIn == 'admin' ? <ManageEvents /> : <Event />
                    }
                </div>

            </div>

        </>
    );
};

export default Home;

