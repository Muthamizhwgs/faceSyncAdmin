import React from "react";
import logo from "../../assets/logofs-removebg.png";

const FaceSync = () => {
  return (
    <div className="w-full flex flex-col sm:flex-row items-center">
      <span className="text-white text-[12px]">Powered by</span>
      <img alt="" src={logo} className="w-[100px] h-[60px]"/>
    </div>
  );
};

export default FaceSync;
