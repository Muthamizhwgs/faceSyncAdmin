import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import DataTable from "react-data-table-component";
import { useFormik } from "formik";
import {
  ManageAdminSchema,
  ManageAdminInitValue,
} from "../../Validation/manageAdmin.Validation";
import {
  getAdmins,
  createAdmin,
  AdminDeleteBySuperAdmin,
  EditeEvent,
} from "../../services/AdminServices";
import { useNavigate } from "react-router-dom/dist";
import Loader from "../../utils/loadder";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

function ManageAdminBySuperAdmin() {
  let navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [manageAdmin, setManageAdmin] = useState(false);
  const [datas, setdatas] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const [editmode, seteditmode] = useState(false);
  const forms = useFormik({
    initialValues: ManageAdminInitValue,
    validationSchema: ManageAdminSchema,
    onSubmit: (values) => {
      submitForms(values);
    },
  });

  async function edit(id) {
    try {
      let value = await EditeEvent(id, rowdata);
      console.log(value);
      // getAdmins()
    } catch (error) {
      console.log(error);
    }
  }

  const submitForms = async (values) => {
    console.log(values);
    setLoader(true);
    try {
      let val = await createAdmins(values);
      console.log(val);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    forms.resetForm();
  };
  const handleCancel2 = () => {
    setrowopen(false);
    forms.resetForm();
    seteditmode(false);
  };

  const createAdmins = async (val) => {
    setLoader(true);
    try {
      let data = await createAdmin(val);
      handleCancel();
    } catch (error) {
      if (error.response.status == 401) {
        navigate("/");
      }
    } finally {
      setLoader(false);
    }
  };

  const getAdminData = async () => {
    setLoader(true);
    try {
      let datas = await getAdmins();
      setdatas(datas.data);
    } catch (error) {
      if (error.response.status == 401) {
        navigate("/");
      }
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getAdminData();
  }, []);

  const columns = [
    {
      name: <h1 className="text-lg text-gray-500 ">S.No</h1>,
      selector: (row, ind) => ind + 1,
    },
    {
      name: <h1 className="text-lg text-gray-500">Name</h1>,
      selector: (row) => row.userName,
    },
    {
      name: <h1 className="text-lg text-gray-500">Mobile Number</h1>,
      selector: (row) => row.contact,
    },
    {
      name: <h1 className="text-lg text-gray-500">Email Address</h1>,
      selector: (row) => row.email,
    },
    {
      name: <h1 className="text-lg text-gray-500">Address</h1>,
      selector: (row) => row.address,
    },
    {
      name: <h1 className="text-lg text-gray-500">Actions</h1>,
      cell: (row) => (
        <div className="flex flex-row">
          <MdDelete
            className="w-10 h-6 cursor-pointer text-red-500"
            onClick={() => handleDelete(row._id)}
          />
          <FaEdit
            className="w-8 h-5 cursor-pointer text-blue-500"
            onClick={() => handleUpdate(row)}
          />
        </div>
      ),
    },
  ];

  const [rowOpen, setrowopen] = useState(false);
  const [rowdata, setrowdata] = useState(false);

  async function handleUpdate(row) {
    await setrowdata(row);
    console.log(rowdata);
    setrowopen(true);
  }

  async function handleDelete(id) {
    try {
      setLoader(true);
      let deletevalue = await AdminDeleteBySuperAdmin(id);
      console.log(deletevalue);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  }

  const customStyles = {
    rows: {
      style: {
        minHeight: "48px",
        minWidth: "800px",
      },
    },
    headCells: {
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
        backgroundColor: "#F3F4F6",
        color: "#6c737f",
        fontWeight: "bold",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
        fontSize: "16px",
        color: "#364353",
      },
    },
  };
  function handleChange(e) {
    setrowdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    seteditmode(true);
  }
  return (
    <div>
      {loader ? <Loader data={loader} /> : null}
      <div className="w-full h-20 flex sm:flex-row flex-col justify-between items-baseline">
        <input
          type="text"
          placeholder="Search organizer"
          className="h-9 bg-gray-200 p-4 rounded-md"
        />
        <button
          onClick={showModal}
          className="w-40 bg-first rounded-md text-white h-9 hover:bg-second duration-200 shadow-sm shadow-first hover:shadow-second"
        >
          {" "}
          + Add Organizer
        </button>
      </div>
      <Modal
        title="Add Event Organizer"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={false}
      >
        <div className="w-[90%] m-auto mt-10 flex flex-col items-center">
          <input
            type="text"
            placeholder="Name"
            className={`${
              forms.errors.userName && forms.touched.userName
                ? "border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
                : "w-[90%]  rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
            }`}
            name="userName"
            id="userName"
            onBlur={forms.handleBlur}
            value={forms.values.userName}
            onChange={forms.handleChange}
          />
          <input
            type="text"
            placeholder="Email Address"
            className={`${
              forms.errors.email && forms.touched.email
                ? "border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
                : "w-[90%]  rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
            }`}
            name="email"
            id="email"
            onBlur={forms.handleBlur}
            value={forms.values.email}
            onChange={forms.handleChange}
          />
          <input
            type="text"
            placeholder="Company Name (optional)"
            className={`${
              forms.errors.companyName && forms.touched.companyName
                ? "border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
                : "w-[90%]  rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
            }`}
            name="companyName"
            id="companyName"
            onBlur={forms.handleBlur}
            value={forms.values.companyName}
            onChange={forms.handleChange}
          />
          <input
            type="number"
            placeholder="Mobile Number"
            className={`${
              forms.errors.contact && forms.touched.contact
                ? "border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
                : "w-[90%]  rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
            }`}
            name="contact"
            id="contact"
            onBlur={forms.handleBlur}
            value={forms.values.contact}
            onChange={forms.handleChange}
          />
          <input
            type="text"
            placeholder="Address (optional)"
            className={`${
              forms.errors.address && forms.touched.address
                ? "border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
                : "w-[90%]  rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
            }`}
            name="address"
            id="addresss"
            onBlur={forms.handleBlur}
            value={forms.values.address}
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

      <Modal
        title="Add Event Organizer"
        open={rowOpen}
        onCancel={handleCancel2}
        footer={false}
      >
        <div className="w-[90%] m-auto mt-10 flex flex-col items-center">
          <input
            type="text"
            placeholder="Organizer Name"
            className={`${
              forms.errors.userName && forms.touched.userName
                ? "border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
                : "w-[90%]  rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
            }`}
            name="userName"
            id="userName"
            onBlur={forms.handleBlur}
            value={rowdata.userName}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Organizer email"
            className={`${
              forms.errors.email && forms.touched.email
                ? "border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
                : "w-[90%]  rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
            }`}
            name="email"
            id="email"
            onBlur={forms.handleBlur}
            value={rowdata.email}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Company Name (optional)"
            className={`${
              forms.errors.companyName && forms.touched.companyName
                ? "border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
                : "w-[90%]  rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
            }`}
            name="companyName"
            id="companyName"
            onBlur={forms.handleBlur}
            value={rowdata.companyName}
            onChange={handleChange}
          />
          <input
            type="number"
            placeholder="Organizer Contact"
            className={`${
              forms.errors.contact && forms.touched.contact
                ? "border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
                : "w-[90%]  rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
            }`}
            name="contact"
            id="contact"
            onBlur={forms.handleBlur}
            value={rowdata.contact}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Organizer Address"
            className={`${
              forms.errors.address && forms.touched.address
                ? "border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
                : "w-[90%]  rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
            }`}
            name="address"
            id="addresss"
            onBlur={forms.handleBlur}
            value={rowdata.address}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            onClick={() => edit(rowdata.userId)}
            className="w-28 bg-first rounded-md text-white h-9 hover:bg-second duration-200 shadow-sm shadow-first hover:shadow-second"
          >
            Submit
          </button>
        </div>
      </Modal>

      {datas && (
        <DataTable
          customStyles={customStyles}
          columns={columns}
          fixedHeader
          pagination
          data={datas}
          bordered
        />
      )}
    </div>
  );
}

export default ManageAdminBySuperAdmin;
