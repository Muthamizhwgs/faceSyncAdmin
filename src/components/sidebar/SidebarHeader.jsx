import React from "react";
import Logo from "../../assets/logofs.jpg";

const SidebarHeader = () => {
  return (
    <div className="w-full p-5 h-[25%]">
      <img src={Logo} alt="" className="w-full h-28 m-auto rounded" />
    </div>
  );
};

export default SidebarHeader;
