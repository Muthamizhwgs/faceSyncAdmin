import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import {
  ManagephotographerSchema,
  PhotographerInitValue,
} from "../../Validation/managePhotographer";
import { useFormik } from "formik";
import {
  CreatePhotoGrapher,
  getAllPhotographers,
  getPhotoGrapher,
  photoGrapherDeleteBySuperAdmin,
  updatePhotographer,
} from "../../services/AdminServices";
import { useNavigate } from "react-router-dom";
import Loader from "../../utils/loadder";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { MdDelete } from "react-icons/md";

const ManagePhotographer = () => {
  let navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [photoGrapher, setphotoGrapher] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [id, setId] = useState("");

  const [messageApi, contextHolder] = message.useMessage();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const forms = useFormik({
    initialValues: PhotographerInitValue,
    validationSchema: ManagephotographerSchema,
    onSubmit: (values) => {
      console.log(values);
      editMode ? updateForms(values) : submitForms(values);
    },
  });

  const submitForms = async (values) => {
    setLoader(true);
    try {
      let data = await CreatePhotoGrapher(values);
      console.log(data.data);
      if (data.data) {
        messageApi.open({
          type: "success",
          content: "Photographer added successfully",
        });
        handleCancel();
      }
    } catch (error) {
      if (error.response.status == 401) {
        navigate("/");
      }
      if (error.response.data.code == 400) {
        console.log("trigger");
        messageApi.open({
          type: "error",
          content: error.response.data.message,
        });
        handleCancel();
      }
    } finally {
      setLoader(false);
      getPhotoGraphers();
    }
  };

  const updateForms = async (values) => {
    setLoader(true);
    try {
      let data = await updatePhotographer(id, values);
      handleCancel();
      console.log(data.data);
    } catch (error) {
      if (error.response.status == 401) {
        navigate("/");
      }
      messageApi.open({
        type: "error",
        content: error.response.data.message,
      });
    } finally {
      setLoader(false);
      getPhotoGraphers();
    }
  };

  const handleCancel = () => {
    (PhotographerInitValue.userName = ""),
      (PhotographerInitValue.email = ""),
      (PhotographerInitValue.contact = ""),
      forms.resetForm();
    setId("");
    setEditMode(false);
    setIsModalOpen(false);
  };

  const getPhotoGraphers = async () => {
    const getRole = localStorage.getItem("facesyncrole");

    setLoader(true);
    try {
      let alldata = await getAllPhotographers();
      let data = await getPhotoGrapher();
      if (getRole === "SuperAdmin") {
        setphotoGrapher(alldata.data);
      } else {
        setphotoGrapher(data.data);
      }
    } catch (error) {
      if (error.response.status == 401) {
        navigate("/");
      }
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    getPhotoGraphers();
  }, []);

  async function handleUpdate(row) {
    (PhotographerInitValue.userName = row.userName),
      (PhotographerInitValue.email = row.email),
      (PhotographerInitValue.contact = row.contact),
      setEditMode(true);
    setIsModalOpen(true);
    setId(row._id);
  }

  async function handleDelete(id) {
    try {
      setLoader(true);
      let deletevalue = await photoGrapherDeleteBySuperAdmin(id);
      console.log(deletevalue);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
      getPhotoGraphers();
    }
  }

  const { confirm } = Modal;

  const showConfirm = (data) => {
    confirm({
      title: "Do you want to delete this photographer?",
      icon: <ExclamationCircleFilled />,
      content: "",
      onOk() {
        handleDelete(data);
      },
      onCancel() {
        console.log("Cancel");
      },
      okButtonProps: {
        style: { color: "white", backgroundColor: "#0fa5e8" },
      },
    });
  };

  const columns = [
    {
      name: <h1 className="text-base text-gray-600">S.No</h1>,
      selector: (row, ind) => ind + 1,
      width: "80px",
    },
    {
      name: <h1 className="text-base text-gray-600">Name</h1>,
      selector: (row) => <p className="capitalize">{row.userName}</p>,
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
      width: "130px",
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

  const [filteredData, setFilteredData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const filterItem = (photoGrapher) => {
      return Object.values(photoGrapher).some((value) => {
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

    const filteredResult = photoGrapher.filter(filterItem);

    setFilteredData(filteredResult);
  }, [photoGrapher, searchTerm]);

  return (
    <>
      {loader ? <Loader data={loader} /> : null}
      {contextHolder}
      <div className="w-full mx-auto font-[Inter]">
        <div className="w-full h-20 flex sm:flex-row flex-col justify-between items-baseline">
          <input
            type="text"
            placeholder="Search Photographer"
            className="h-9 bg-gray-200 p-4 rounded-md text-sm"
            onChange={(event) => setSearchTerm(event.target.value)}
            value={searchTerm}
          />
          <button
            className="px-2 py-1 text-sm bg-first rounded-md text-white h-9 hover:bg-second duration-200 shadow-sm shadow-first hover:shadow-second"
            onClick={showModal}
          >
            {" "}
            + Add Photographer
          </button>
        </div>

        {/* models */}

        <Modal
          title={editMode ? "Edit Photographer" : "Add Photographer"}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={false}
        >
          <div className="w-full mt-10 flex flex-col gap-3 items-center">
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
              type="number"
              placeholder="Mobile Number"
              className={`${
                forms.errors.contact && forms.touched.contact
                  ? "border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
                  : "w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
              }`}
              name="contact"
              id="contact"
              onBlur={forms.handleBlur}
              value={forms.values.contact}
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

        {photoGrapher && (
          <div className="w-full overflow-auto">
            <DataTable
              columns={columns}
              data={filteredData}
              fixedHeader
              pagination
              bordered
              customStyles={customStyles}
              fixedHeaderScrollHeight="340px"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ManagePhotographer;
