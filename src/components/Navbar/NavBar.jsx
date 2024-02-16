import React, { useEffect, useRef, useState } from "react";
import profile from "../../assets/profile-user.png";
import { useNavigate } from "react-router-dom";
import { Modal, DatePicker, Select, message } from "antd";
import { TbLogout } from "react-icons/tb";
import { RiSettings3Fill } from "react-icons/ri";
import { ChangePasswordInitValues, ChangePasswordSchema } from "../../Validation/changePasswordValidation";
import { updatePassword } from "../../services/AdminServices";
import { useFormik } from "formik";
import Loader from "../../utils/loadder";

const NavBar = () => {

  const [loader, setLoader] = useState(false);
  const forms = useFormik({
    initialValues: ChangePasswordInitValues,
    validationSchema: ChangePasswordSchema,
    onSubmit: (values) => {
      console.log(values)
      submitForms(values);
    },
  });

  const [messageApi, contextHolder] = message.useMessage();

  const submitForms = async (values) => {
    setLoader(true)
    try {
      let data = await updatePassword(values)
      handleCancel()
    } catch (error) {
      if (error.response.status == 401) {
        navigate('/')
      }
      messageApi.open({
        type: 'error',
        content: error.response.data.message,
      });
    } finally {
      setLoader(false)
    }
  }


  const navigate = useNavigate();

  const logOut = () => {
    console.log("trogger");
    localStorage.clear();
    navigate("/");
  };

  const menuRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCancel = () => {
    setIsModalOpen(false);
    forms.initialValues.oldPassword = "";
    forms.initialValues.newPassword = "";
    forms.initialValues.confirmPassword = "";
  };

  const [showlog, setShowlog] = useState(false);

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

  const handleAddEvent = () => {
    setIsModalOpen(true);
    setShowlog(!showlog);
  };
  const getName = localStorage.getItem("username")

  return (
    <>
      {loader ? <Loader date={loader} /> : null}
      <div
        className="w-full lg:w-4/5  h-16 flex flex-row justify-end px-4 fixed left-1/5 right-0 top-0
bg-gray-50 z-20 border-b border-stone-200 "
      >
        <div className="flex items-center" ref={menuRef}>
          <img
            src={profile}
            className="w-8 h-8 cursor-pointer rounded-full"
            onClick={() => setShowlog(!showlog)}
          />

          {showlog && (
            <>
              <div className="fixed top-20 right-4 h-fit w-[145px] bg-white flex flex-col rounded-lg shadow border border-gray-50">
                <div className="flex flex-col p-3 gap-2">
                  <span className="font-semibold  text-gray-800">Account</span>
                  <span className="text-nav-ash font-md capitalize">{getName}</span>
                </div>
                <div className="w-full h-px bg-gray-300"></div>
                <div className="w-full flex flex-col p-2 gap-2">
                  <div className="flex flex-col  justify-between">
                    {" "}
                    <span
                      className="flex flex-row items-center gap-2 cursor-pointer text-nav-ash px-2 py-1 font-md hover:rounded hover:duration-300  hover:bg-first hover:text-white"
                      onClick={handleAddEvent}
                    >
                      <RiSettings3Fill size={18} />Settings
                    </span>
                  </div>

                  <div className="flex flex-col  justify-between">
                    <span
                      className="flex flex-row items-center gap-2 cursor-pointer px-2 py-1
                      hover:bg-first hover:text-white hover:rounded hover:duration-300 font-md"
                      onClick={logOut}
                    >
                      <TbLogout size={18} />
                      <span>Log out</span>
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <Modal
          title="Change Password"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={false}
        >
          <div className="w-full flex flex-col gap-3 items-center mt-10 h-fit">
            <input
              type="password"
              placeholder="Current password"
              className={`${forms.errors.oldPassword && forms.touched.oldPassword
                ? "border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
                : "w-[90%]  rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
                }`}
              name="oldPassword"
              id="oldPassword"
              onBlur={forms.handleBlur}
              value={forms.values.curentpassword}
              onChange={forms.handleChange}
            />
            <input
              type="password"
              placeholder="New password"
              className={`${forms.errors.newPassword && forms.touched.newPassword
                ? "border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
                : "w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
                }`}
              name="newPassword"
              id="newPassword"
              onBlur={forms.handleBlur}
              value={forms.values.newPassword}
              onChange={forms.handleChange}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              className={`${forms.errors.confirmPassword && forms.touched.confirmPassword
                ? "border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
                : "w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
                }`}
              name="confirmPassword"
              id="confirmPassword"
              onBlur={forms.handleBlur}
              value={forms.values.confirmPassword}
              onChange={forms.handleChange}
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              onClick={forms.handleSubmit}
              className="w-28 bg-first rounded-md text-white h-9 hover:bg-second duration-200 shadow-sm shadow-first hover:shadow-second"
            >
              Submit
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default NavBar;
