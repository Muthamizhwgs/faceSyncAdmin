import React from "react";
import EventImg from "../assets/event.jpg";
import { LoginInitValue, LoginSchema } from "../Validation/LoginValidation";
import { useFormik } from "formik";
import { LoginUsers } from "../services/AdminServices"

function Login() {

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
            console.log(val.data)
        } catch (error) {

        }

    }


    return (
        <div className="w-full h-[100vh] bg-[#cbc2f7] flex justify-between">
            <div className="w-[50%]">
                <img
                    src={EventImg}
                    alt="asd"
                    className="w-full h-full object-cover rounded-tr-2xl"
                />
            </div>
            <div className="w-[50%] h-full flex justify-center items-center ">
                <div className="w-[90%] h-[80%] bg-white rounded-xl">
                    <div className="text-center mt-9">
                        <h1 className="text-2xl text-sky-900 text-bold">
                            Welcome Back To Dashboard
                        </h1>
                    </div>
                    <div className="w-[50%] m-auto mt-20">
                        <form onSubmit={forms.handleSubmit}>
                            <div className="flex flex-col mb-5">
                                <label htmlFor="" className="mb-3 pl-5 text-xl text-sky-900">
                                    User Name :
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Valid User Name"
                                    className={forms.errors.userName ? "w-full  bg-sky-50 h-14 pl-4 rounded-full border-red-300" : "bg-sky-50 h-14 pl-4 rounded-full"}
                                    name="userName"
                                    id="userName"
                                    onBlur={forms.handleBlur} value={forms.values.userName} onChange={forms.handleChange}
                                />
                                            {forms.errors.userName && forms.touched.userName ? <div style={{ width: "100%", color: "red", paddingLeft: "15px" }}>{forms.errors.userName}</div> : null}
                            </div>
                            <div className="flex flex-col mb-5 ">
                                <label htmlFor="" className="mb-3 pl-5 text-xl text-sky-900">
                                    Password :
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter Valid Password"
                                    name='password'
                                    id='password'
                                    className={forms.errors.password ? "w-full  bg-sky-50 h-14 pl-4 rounded-full border-red-600" : "bg-sky-50 h-14 pl-4 rounded-full"}
                                    onBlur={forms.handleBlur} value={forms.values.password} onChange={forms.handleChange}
                                />
                                            {forms.errors.userName && forms.touched.password ? <div style={{ width: "100%", color: "red", paddingLeft: "15px" }}>{forms.errors.password}</div> : null}

                            </div>
                            <div className="flex justify-center">
                                <button type="submit" className="bg-sky-950 w-40   h-10 rounded-full text-white">
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default Login;
