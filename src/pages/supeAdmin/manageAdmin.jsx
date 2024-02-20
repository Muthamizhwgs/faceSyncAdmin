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
  updateEventOrganizer,
} from "../../services/AdminServices";
import { useNavigate } from "react-router-dom/dist";
import Loader from "../../utils/loadder";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { ExclamationCircleFilled } from "@ant-design/icons";

function ManageAdminBySuperAdmin() {
  let navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [datas, setdatas] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();
  const [editMode, setEditMode] = useState(false);
  const [id, setId] = useState("");

  const showModal = () => {
    setIsModalOpen(true);
  };

  const forms = useFormik({
    initialValues: ManageAdminInitValue,
    validationSchema: ManageAdminSchema,
    onSubmit: (values) => {
      editMode ? updateForms(values) : submitForms(values);
    },
  });

  const updateForms = async (values) => {
    setLoader(true);
    try {
      let value = await updateEventOrganizer(id, values);
      console.log(value);
      handleCancel();

      // getAdmins()
    } catch (error) {
      console.log(error);
    } finally {
      getAdminData();
      setLoader(false);
    }
  };

  const submitForms = async (values) => {
    console.log(values);
    setLoader(true);
    try {
      let val = await createAdmin(values);
      console.log(val);
      if (val.data) {
        messageApi.open({
          type: "success",
          content: "Event organizer added successfully",
        });
      }
      handleCancel();
    } catch (error) {
      console.log(error);
      if (error.response.data.code == 400) {
        console.log("trigger");
        messageApi.open({
          type: "error",
          content: error.response.data.message,
        });
      }
      handleCancel();
      if (error.response.status == 401) {
        navigate("/");
      }
    } finally {
      getAdminData();
      setLoader(false);
    }
  };

  const handleCancel = () => {
    (ManageAdminInitValue.userName = ""),
      (ManageAdminInitValue.email = ""),
      (ManageAdminInitValue.address = ""),
      (ManageAdminInitValue.companyName = ""),
      (ManageAdminInitValue.contact = "");
    setIsModalOpen(false);
    setEditMode(false);
    forms.resetForm();
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
      name: <h1 className="text-base text-gray-600 ">S.No</h1>,
      selector: (row, ind) => ind + 1,
      width: "60px",
    },
    {
      name: <h1 className="text-base text-gray-600">Name</h1>,
      selector: (row) => <p className="capitalize">{row.userName}</p>,
      width: "200px",
    },
    {
      name: <h1 className="text-base text-gray-600">Mobile Number</h1>,
      selector: (row) => <p className="capitalize">{row.contact}</p>,
    },
    {
      name: <h1 className="text-base text-gray-600">Email Address</h1>,
      selector: (row) => <p className="">{row.email}</p>,
    },
    {
      name: <h1 className="text-base text-gray-600">Actions</h1>,
      width: "100px",
      cell: (row) => (
        <div className="flex flex-row">
          <MdDelete
            className="w-10 h-6 cursor-pointer text-red-500"
            onClick={() => showConfirm(row._id)}
          />
          <FaEdit
            className="w-8 h-5 cursor-pointer text-blue-500"
            onClick={() => handleUpdate(row)}
          />
        </div>
      ),
    },
  ];

  async function handleUpdate(row) {
    setEditMode(true);
    (ManageAdminInitValue.userName = row.userName),
      (ManageAdminInitValue.email = row.email),
      (ManageAdminInitValue.address = row.address),
      (ManageAdminInitValue.companyName = row.companyName),
      (ManageAdminInitValue.contact = row.contact),
      setIsModalOpen(true);
    setId(row._id);
  }

  async function handleDelete(id) {
    try {
      setLoader(true);
      let deletevalue = await AdminDeleteBySuperAdmin(id);
      console.log(deletevalue);
      // if (error.response.data.code == 400) {
      //   messageApi.open({
      //     type: "success",
      //     content: error.response.data.message,
      //   });
      // }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
      getAdminData();
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
        backgroundColor: "#E5E7EB",
        color: "#6c737f",
        fontWeight: "bold",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
        fontSize: "14px",
        color: "#364353",
      },
    },
  };

  const { confirm } = Modal;

  const showConfirm = (id) => {
    confirm({
      title: "Do you want to delete this organizer?",
      icon: <ExclamationCircleFilled />,
      content: "",
      onOk() {
        handleDelete(id);
      },
      onCancel() {
        console.log("Cancel");
      },
      okButtonProps: {
        style: { color: "white", backgroundColor: "#0fa5e8" },
      },
    });
  };

  const [filteredData, setFilteredData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const filterItem = (datas) => {
      return Object.values(datas).some((value) => {
        if (typeof value === "string") {
          const lowerCaseValue = value.toString().toLowerCase();
          return lowerCaseValue.includes(searchTerm.toLowerCase());
        } else if (value instanceof Date) {
          const dateValue = value.toISOString().toLowerCase();
          return dateValue.includes(searchTerm.toLowerCase());
        } else if (typeof value == "number") {
          const stringValue = value.toString().toLowerCase();
          return stringValue === searchTerm.toLowerCase();
        }
        return false;
      });
    };

    const filteredResult = datas.filter(filterItem);

    setFilteredData(filteredResult);
  }, [datas, searchTerm]);

  return (
    <>
      {contextHolder}

      <div>
        {loader ? <Loader data={loader} /> : null}
        <div className="w-full h-20 flex sm:flex-row flex-col justify-between items-baseline">
          <input
            type="text"
            placeholder="Search organizers"
            className="h-9 bg-gray-200 p-4 rounded-md text-std"
            onChange={(event) => setSearchTerm(event.target.value)}
            value={searchTerm}
          />
          <button
            onClick={showModal}
            className="px-2 py-1 text-std bg-first rounded-md text-white h-9 hover:bg-second duration-200 shadow-sm shadow-first hover:shadow-second"
          >
            {" "}
            + Add Organizer
          </button>
        </div>
        <Modal
          title={editMode ? "Edit event organizer" : "Add event organizer"}
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
              {editMode ? "Update" : "Submit"}
            </button>
          </div>
        </Modal>

        {/* <Modal
        title="Edit Event Organizer"
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
            onClick={() => updateForms(rowdata._id)}
            className="w-28 bg-first rounded-md text-white h-9 hover:bg-second duration-200 shadow-sm shadow-first hover:shadow-second"
          >
            Submit
          </button>
        </div>
      </Modal> */}

        {datas && (
          <DataTable
            customStyles={customStyles}
            columns={columns}
            fixedHeader
            pagination
            data={filteredData}
            bordered
            fixedHeaderScrollHeight="340px"
          />
        )}
      </div>
    </>
  );
}

export default ManageAdminBySuperAdmin;
