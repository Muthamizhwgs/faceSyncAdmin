import React from "react";
import { message } from 'antd';
import EventImg from "../assets/event.jpg";
import { LoginInitValue, LoginSchema } from "../Validation/LoginValidation";
import { useFormik } from "formik";
import { LoginUsers } from "../services/AdminServices"
import { useNavigate } from "react-router-dom";
import Home from "./Home";

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
            let val = await LoginUsers(values)
            localStorage.setItem('facesyncrole', val.data.data.role)
            localStorage.setItem('facesynctoken', val.data.token.access.token)
            navigate('/home')
        } catch (error) {
            if (error.response.status == 401) {
                navigate('/')
            }
            messageApi.open({
                type: 'error',
                content: error.response.data.message,
            });

        }

    }


    return (
        <>
            {contextHolder}
            <div className="w-full h-[100vh]  bg-[#cbc2f7] flex md:flex-row flex-col justify-between ">
                <div className="md:w-[50%]">
                    <img
                        src={EventImg}
                        alt="asd"
                        className="w-full h-full object-cover rounded-tr-2xl md:block hidden"
                    />
                </div>
                <div className="md:w-[50%] w-full h-full flex justify-center items-center">
                    <div className="w-[90%] pb-20 pt-10 bg-white rounded-xl xl:px-0 lg:px-18 md:px-20 px-8">
                        <div className="text-center mt-9">
                            <h1 className="text-2xl text-sky-900 font-bold">
                                Welcome Back To Dashboard
                            </h1>
                        </div>
                        <div className=" w-full mx-auto mt-10  xl:w-[60%] ">
                            <form onSubmit={forms.handleSubmit}>
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="" className="mb-3  text-xl font-medium text-first">
                                        User Name :
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter User Name"
                                        className={forms.errors.userName && forms.touched.userName ? "w-full bg-sky-50 h-14 pl-4 rounded border-red-600 border-2" : "bg-sky-50 h-14 pl-4 rounded border-2"}
                                        name="userName"
                                        id="userName"
                                        onBlur={forms.handleBlur} value={forms.values.userName} onChange={forms.handleChange}
                                    />
                                    {/* {forms.errors.userName && forms.touched.userName ? <div style={{ width: "100%", color: "red", paddingLeft: "15px", paddingTop: "10px" }}>{forms.errors.userName}</div> : null} */}
                                </div>
                                <div className="flex flex-col mb-5 ">
                                    <label htmlFor="" className="mb-3 text-xl font-medium text-first">
                                        Password :
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter Password"
                                        name='password'
                                        id='password'
                                        className={forms.errors.password && forms.touched.password ? "w-full h-14 pl-4 rounded border-red-600 border-2" : "bg-sky-50 h-14 pl-4 rounded border-2"}
                                        onBlur={forms.handleBlur} value={forms.values.password} onChange={forms.handleChange}
                                    />
                                    {/* {forms.errors.userName && forms.touched.password ? <div style={{ width: "100%", color: "red", paddingLeft: "15px", paddingTop: "10px" }}>{forms.errors.password}</div> : null} */}
                                </div>

                                <div className="flex justify-center">
                                    <button type="submit" className="bg-second w-40 h-10 mt-5 rounded-md text-white">
                                        Login
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
