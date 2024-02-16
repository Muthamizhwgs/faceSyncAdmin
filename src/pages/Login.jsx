import React from "react";
import { message } from "antd";
import EventImg from "../assets/facesync.png";
import { LoginInitValue, LoginSchema } from "../Validation/LoginValidation";
import { useFormik } from "formik";
import { LoginUsers } from "../services/AdminServices";
import { useNavigate } from "react-router-dom";
import Home from "./Home";
import fs from "../assets/logofs.jpg";

function Login() {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const forms = useFormik({
    initialValues: LoginInitValue,
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      submitForms(values);
    },
  });

  const submitForms = async (values) => {
    try {
      let val = await LoginUsers(values);
      localStorage.setItem("facesyncrole", val.data.data.role);
      localStorage.setItem("facesynctoken", val.data.token.access.token);
      localStorage.setItem("username", val.data.data.userName);

      if (val.data.data.role === "superAdmin") {
        navigate("/home/manageAdmin");
      } else if (val.data.data.role === "admin") {
        navigate("/home/manageevents");
      } else if (val.data.data.role === "photographer") {
        navigate("/home/manageMyevents");
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.response.data.message,
      });
    }
  };

  return (
    <>
      {contextHolder}
      <div className="w-full h-[100vh] bg-gradient-to-tl from-[#af2d73] via-[#510e6d] to-transparent flex md:flex-row flex-col justify-between ">
        <div className="md:w-[50%]">
          <img
            src={EventImg}
            alt="asd"
            className="w-full h-full object-cover rounded-tr-2xl rounded-br-2xl md:block hidden"
          />
        </div>
        <div className="md:w-[50%] w-full h-full flex justify-center items-center">
          <div className="w-[90%] px-5 py-10 bg-white rounded-xl flex flex-col ">
            <div className="w-full ">
              <img
                src={fs}
                alt="logo"
                className="w-[400px] h-[180px] mx-auto"
              />
            </div>
            <div className=" w-[70%] mx-auto ">
              <form onSubmit={forms.handleSubmit}>
                <div className="flex flex-col mb-5">
                  {/* <label htmlFor="" className="mb-3  text-xl font-medium text-first">
                                        Email Address 
                                    </label> */}
                  <input
                    type="text"
                    placeholder="Email Address"
                    className={
                      forms.errors.userName && forms.touched.userName
                        ? "w-full bg-sky-50 h-14 pl-4 rounded border-red-600 border-2"
                        : "bg-sky-50 h-14 pl-4 rounded border-2"
                    }   
                    name="userName"
                    id="userName"
                    onBlur={forms.handleBlur}
                    value={forms.values.userName}
                    onChange={forms.handleChange}
                  />
                  {/* {forms.errors.userName && forms.touched.userName ? <div style={{ width: "100%", color: "red", paddingLeft: "15px", paddingTop: "10px" }}>{forms.errors.userName}</div> : null} */}
                </div>
                <div className="flex flex-col mb-5 ">
                  {/* <label htmlFor="" className="mb-3 text-xl font-medium text-first">
                                        Password 
                                    </label> */}
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    id="password"
                    className={
                      forms.errors.password && forms.touched.password
                        ? "w-full h-14 pl-4 rounded border-red-600 border-2"
                        : "bg-sky-50 h-14 pl-4 rounded border-2"
                    }
                    onBlur={forms.handleBlur}
                    value={forms.values.password}
                    onChange={forms.handleChange}
                  />
                  {/* {forms.errors.userName && forms.touched.password ? <div style={{ width: "100%", color: "red", paddingLeft: "15px", paddingTop: "10px" }}>{forms.errors.password}</div> : null} */}
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="px-8 py-2 text-lg bg-first rounded-md text-white hover:bg-second duration-200 shadow-sm shadow-first hover:shadow-second"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
