import React, { useEffect, useState } from "react";
import { Modal, DatePicker, Select } from "antd";
import { useFormik } from "formik";
import {
  ManageEventsSchema,
  ManageEventsInitValue,
  ManageAssignPhotographers,
  ManageEventsSchema2,
} from "../../Validation/manageEvents.Validation";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineDateRange } from "react-icons/md";
import { MdOutlineDescription } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import moment from "moment";
import Loader from "../../utils/loadder";
import {
  createEvents,
  getEvents,
  EditeEvent,
  getPhotoGrapher,
  assignPhotographer,
} from "../../services/AdminServices";
import DateFormat from "../../utils/dateFormat";
import { MdDelete } from "react-icons/md";
import pg from "../../assets/pg-black.png";

function ManageEvents() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [loader, setLoader] = useState(false);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState("");

  const [events, setEvents] = useState([]);

  const [data, setData] = useState([]);

  console.log(data);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showModal2 = () => {
    setIsModalOpen2(true);
  };

  const forms = useFormik({
    initialValues: ManageEventsInitValue,
    validationSchema: ManageEventsSchema,
    onSubmit: (values) => {
      edit ? EditForms(values) : submitForms(values);
    },
  });

  const forms2 = useFormik({
    initialValues: ManageAssignPhotographers,
    validationSchema: ManageEventsSchema2,
    onSubmit: (values) => {
      return submitForms2(values);
    },
  });

  const handleedit = (data) => {
    ManageEventsInitValue.eventName = data.eventName;
    ManageEventsInitValue.eventLocation = data.eventLocation;
    ManageEventsInitValue.eventDate = data.eventDate;
    ManageEventsInitValue.eventSummary = data.eventSummary;
    setId(data._id);
    setEdit(true);
    setIsModalOpen(true);
    console.log(data);
  };

  const handleAssign = (data) => {
    setId(data._id);
    setIsModalOpen2(true);
  };

  const EditForms = async (values) => {
    setLoader(true);
    try {
      let val = await EditeEvent(id, values);
      console.log(val);
      MyEvents();
      handleCancel();
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  const handleDelete = async (data) => {
    setLoader(true);
    console.log(data._id);
    try {
      let adminStatus = {
        active: false,
      };
      let val = await EditeEvent(data._id, adminStatus);
      console.log(val);
      MyEvents();
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    forms.initialValues.eventName = "";
    forms.initialValues.eventLocation = "";
    forms.initialValues.eventDate = "";
    forms.initialValues.eventSummary = "";
    setEdit(false);
    setId("")
  };

  const handleCancel2 = () => {
    setIsModalOpen2(false);
    setId("")
    forms2.initialValues.eventId=""
    forms2.initialValues.photographerId=""
  };

  const submitForms = async (values) => {
 
    try {
      let val = await createEvents(values);
      console.log(val);
      MyEvents();
      handleCancel();
      forms.resetForm();
    } catch (error) {
    } 
  };

  const submitForms2 = async (values) => {
    console.log(values, "vlues")
    try {
      let val = await assignPhotographer(values);
      console.log(val);
      MyEvents();
      handleCancel2();
      forms2.resetForm();
    } catch (error) {
    } 
  };

  const MyEvents = async () => {
    try {
      setLoader(true);
      let values = await getEvents();
      let values2 = await getPhotoGrapher();
      console.log(values2);
      setEvents(values.data);

      const facultyOptions = values2.data.map((f) => ({
        value: f._id,
        label: f.userName,
      }));
      setData(facultyOptions);
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    MyEvents();
  }, []);

 

  return (
    <>
      {loader ? <Loader date={loader} /> : null}
      <div className="w-full mx-auto p-5 h-[100vh]">
        <div className="w-full h-20 flex justify-between items-baseline">
          <input
            type="text"
            placeholder="Search Events"
            className=" h-9 bg-gray-200 p-4 rounded-md"
          />
          <button
            className="w-28 bg-slate-600 rounded-md text-white h-9"
            onClick={showModal}
          >
            Add Events
          </button>
        </div>
        {/* model */}

        <Modal
          title={`${edit ? "Edit event" : "Create New Events"}`}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={false}
        >
          <div className="w-[90%] m-auto mt-5 flex flex-col items-center">
            <input
              type="text"
              placeholder="Event Name"
              className={`${
                forms.errors.eventName && forms.touched.eventName
                  ? "border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
                  : "w-[90%]  rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
              }`}
              name="eventName"
              id="eventName"
              onBlur={forms.handleBlur}
              value={forms.values.eventName}
              onChange={forms.handleChange}
            />
            <input
              type="text"
              placeholder="Event Location"
              className={`${
                forms.errors.eventLocation && forms.touched.eventLocation
                  ? "border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
                  : "w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
              }`}
              name="eventLocation"
              id="eventLocation"
              onBlur={forms.handleBlur}
              value={forms.values.eventLocation}
              onChange={forms.handleChange}
            />
            <DatePicker
              format="DD-MM-YYYY"
              name="eventDate"
              id="eventDate"
              className={`${
                forms.errors.eventDate
                  ? "border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
                  : " w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
              } `}
              value={
                forms.values.eventDate ? moment(forms.values.eventDate) : null
              }
              onChange={(date) =>
                forms.setFieldValue("eventDate", date ? date.toDate() : null)
              }
            />
            <input
              type="text"
              placeholder="Event Summary"
              className="w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
              name="eventSummary"
              id="eventSummary"
              onBlur={forms.handleBlur}
              value={forms.values.eventSummary}
              onChange={forms.handleChange}
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              onClick={forms.handleSubmit}
              className="w-28 bg-slate-600 rounded-md text-white h-9 b"
            >
              Submit
            </button>
          </div>
        </Modal>

        <Modal
          title="Assign Photographer"
          open={isModalOpen2}
          onCancel={handleCancel2}
          footer={false}
        >
          <form onSubmit={forms2.handleSubmit}>
          <div className="w-[90%] m-auto my-5 flex flex-col items-center">
            <Select
              showSearch
              className="w-[400px] h-[40px]"
              placeholder="Search to Select"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={data}
              value={forms2.values.photographerId}
              onChange={(value) => {forms2.setFieldValue("photographerId", value),forms2.setFieldValue("eventId", id)}}
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              // onClick={}
              className="w-28 bg-slate-600 rounded-md text-white h-9 b"
            >
              Submit
            </button>
          </div>
          </form>
        </Modal>

        {/* cards */}

        <div className="grid grid-cols-3 gap-5">
          {events &&
            events.map((data, ind) => (
              <div
                className="basis-[32%] h-32 p-3 bg-blue-100 rounded-md"
                key={ind}
              >
                <div className="w-full mx-auto flex justify-between overflow-auto">
                  <h1 className="mt-2 capitalize">{data.eventName}</h1>
                  <div className="flex gap-2 items-center">
                    <button>
                      <FaEdit
                        size={20}
                        onClick={() => {
                          handleedit(data);
                        }}
                        className="cursor-pointer"
                      />
                    </button>
                    <img
                      src={pg}
                      alt=""
                      className="w-[20px] h-[20px] cursor-pointer"
                      onClick={() => {
                        handleAssign(data);
                      }}
                    />
                    <button>
                      <MdDelete
                        size={22}
                        onClick={() => handleDelete(data)}
                        className="cursor-pointer"
                      />
                    </button>
                  </div>
                </div>
                <div className="w-full mx-auto flex justify-between">
                  <h1 className="mt-2 flex items-center capitalize">
                    <IoLocationOutline size={20} className="mr-[2px]" />
                    {data.eventLocation}
                  </h1>
                  <h1 className="mt-2 flex items-center">
                    <MdOutlineDateRange size={20} className="mr-[2px]" />
                    <DateFormat data={data.eventDate} />
                  </h1>
                </div>
                {/* <div className="w-full p-1 mx-auto px-3 flex justify-between">
                  <h1 className="mt-2 flex items-center">
                    <MdOutlineDescription size={20} />
                    {data.eventSummary}
                  </h1>
                </div> */}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default ManageEvents;
