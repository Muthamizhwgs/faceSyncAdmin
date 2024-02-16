import React from "react";
import logo from "../../assets/logofs.jpg";

const FaceSync = () => {
  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2">
      <span className="text-white text-[12px] font-light">Powered by</span>
      {/* <img alt="" src={logo} className="w-fit h-[40px] rounded-md"/> */}
      <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-pink-600 text-[18px]">FACE SYNC</p>
    </div>
  );
};
export default FaceSync;