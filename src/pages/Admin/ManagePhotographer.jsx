import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import {
  ManagephotographerSchema,
  PhotographerInitValue,
} from "../../Validation/managePhotographer";
import { useFormik } from "formik";
import {
  CreatePhotoGrapher,
  getPhotoGrapher,
} from "../../services/AdminServices";
import { useNavigate } from "react-router-dom";
import Loader from "../../utils/loadder";
import DataTable from "react-data-table-component";

const ManagePhotographer = () => {
  let navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [photoGrapher, setphotoGrapher] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const forms = useFormik({
    initialValues: PhotographerInitValue,
    validationSchema: ManagephotographerSchema,
    onSubmit: (values) => {
      console.log(values);
      submitForms(values);
    },
  });

  const submitForms = async (values) => {
    setLoader(true);
    try {
      let data = await CreatePhotoGrapher(values);
      console.log(data.data);
      getPhotoGraphers();
      handleCancel();
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
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    forms.resetForm();
  };

  const getPhotoGraphers = async () => {
    setLoader(true);
    try {
      let data = await getPhotoGrapher();
      setphotoGrapher(data.data);
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

  const columns = [
    {
      name: <h1 className="text-lg text-gray-500">S.No</h1>,
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
      <div className="w-full mx-auto ">
        <div className="w-full h-20 flex sm:flex-row flex-col justify-between items-baseline">
          <input
            type="text"
            placeholder="Search Photographer"
            className="h-9 bg-gray-200 p-4 rounded-md"
            onChange={(event) => setSearchTerm(event.target.value)}
            value={searchTerm}
          />
          <button
            className="w-40 bg-first rounded-md text-white h-9 hover:bg-second duration-200 shadow-sm shadow-first hover:shadow-second"
            onClick={showModal}
          >
            {" "}
            + Add Photographer
          </button>
        </div>

        {/* models */}

        <Modal
          title="Add Photographer"
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
              Submit
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
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ManagePhotographer;
