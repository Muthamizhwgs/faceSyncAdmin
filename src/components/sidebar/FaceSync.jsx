import React from "react";
import logo from "../../assets/logofs-removebg.png";

const FaceSync = () => {
  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-center ">
      <span className="text-white text-[12px] font-light">Powered by</span> &nbsp;
      {/* <img alt="" src={logo} className="w-[140px] h-[60px]"/> */}
      <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-pink-600 text-[18px]">FACE SYNC</p>
    </div>
  );
};
export default FaceSync;