import React, { useEffect, useRef, useState } from "react";
import profile from "../../assets/profile-user.png";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const [showlog, setShowlog] = useState(false);

  const navigate = useNavigate();

  const logOut = () => {
    localStorage.clear();
    navigate("/");
  };

  const menuRef = useRef(null);

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setShowlog(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  return (
    <div
      className="w-full lg:w-4/5  h-16 flex flex-row justify-end px-4 fixed left-1/5 right-0 top-0
bg-fourth z-20 border-b border-stone-200"
    >
      <div className="flex items-center" ref={menuRef}>
        <img
          src={profile}
          className="w-8 h-8 cursor-pointer"
          onClick={() => setShowlog(!showlog)}
        />
      </div>
      {showlog && (
        <>
          <div className="fixed top-20 right-4 h-fit w-[145px] bg-white flex flex-col rounded-lg shadow border border-gray-50">
            <div className="flex flex-col p-3 gap-2">
              <span className="font-semibold  text-gray-800">Account</span>
              <span className="text-nav-ash font-md capitalize">Admin</span>
            </div>
            <div className="w-full h-px bg-gray-300"></div>
            <div className="w-full flex flex-col p-2 gap-2">
              <div className="flex flex-col  justify-between">
                {" "}
                <span
                  className="flex flex-row items-center gap-2 cursor-pointer text-nav-ash px-2 py-1 font-md hover:rounded hover:duration-300  hover:bg-regal-blue hover:text-white"
                  onClick={() => setShowlog(!showlog)}
                >
                   Settings
                </span>
              </div>

              <div className="flex flex-col  justify-between">
                <span
                  className="flex flex-row items-center gap-2 cursor-pointer px-2 py-1
                      hover:bg-first hover:text-white hover:rounded hover:duration-300 font-md"
                  onClick={logOut}
                >
                  
                  Log out
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NavBar;
