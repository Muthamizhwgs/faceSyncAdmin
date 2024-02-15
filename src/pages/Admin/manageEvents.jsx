import React, { useEffect, useRef, useState } from "react";
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
import { FaEdit, FaTrash } from "react-icons/fa";
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
import qr from "../../assets/qr.png";
import upimg from "../../assets/upimg.png";
import assign from "../../assets/assign.png";
import imageUpload from "../../assets/upload.png";
import { ExclamationCircleFilled } from "@ant-design/icons";

function ManageEvents() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [selectedPictures, setSelectedPictures] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [savedPictures, setSavedPictures] = useState([]);
  const [loader, setLoader] = useState(false);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState("");
  const fileInputRef = useRef(null);
  const [showText, setShowText] = useState(false);

  const [events, setEvents] = useState([]);

  const [data, setData] = useState([]);

  // console.log(data);

  const handleAddEvent = () => {
    setIsModalOpen(true);
  };

  const handleEdit = (data) => {
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

  const handleUploadIamge = (data) => {
    setId(data._id);
    setIsModalOpen3(true);
  };

  const handleSave = async () => {
    console.log(selectedPictures);
    if (selectedPictures.length > 0) {
      try {
        const formData = new FormData();
        selectedPictures.forEach((image) => {
          formData.append(`images`, image);
          formData.append(`eventId`, eventId);
        });
        let datas = await UploadGroupPhotoes(formData);
        console.log(datas);
      } catch (error) {
        console.error(error);
      } finally {
        setLoader(false);
      }

      console.log("Saving pictures:", selectedPictures);
      setSavedPictures((prevSavedPictures) => [
        ...prevSavedPictures,
        ...selectedPictures,
      ]);
      setSelectedPictures([]);
      fileInputRef.current.value = "";
    } else {
      console.log("No pictures selected");
    }
  };

  const faceMacth = async () => {
    try {
      let val = await face();
      console.log(val.data);
    } catch (error) {}
  };

  const handleDeleteImage = (index) => {
    console.log("handle");
    const newPictures = savedPictures.filter((_, i) => i !== index);
    setSavedPictures(newPictures);
  };

  const handleDownloadQR = async (data) => {
    const fileUrl = data.qrURL;

    if (data.qrURL === undefined || data.qrURL === "") {
      console.log("download is not available");
    } else {
      try {
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = `${data.qrURL?.eventName}`; // Set the desired file name

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(fileUrl);
      } catch (error) {
        console.error("Error downloading the file:", error);
      }
    }
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
    forms.initialValues.eventCategory = "";
    (forms.initialValues.hostName = ""),
      (forms.initialValues.hostEmail = ""),
      (forms.initialValues.hostWhatsappNumber = ""),
      setEdit(false);
    setId("");
  };

  const handleCancel2 = () => {
    setIsModalOpen2(false);
    setId("");
    forms2.initialValues.eventId = "";
    forms2.initialValues.photographerId = "";
  };

  const submitForms = async (values) => {
    try {
      const data = {
        ...values,
        ...{},
      };
      // let val = await createEvents(values);
      console.log(values, "ssss");
      // MyEvents();
      // handleCancel();
      // forms.resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  const submitForms2 = async (values) => {
    console.log(values, "vlues");
    try {
      let val = await assignPhotographer(values);
      console.log(val);
      MyEvents();
      handleCancel2();
      forms2.resetForm();
    } catch (error) {}
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

  const { confirm } = Modal;

  const showConfirm = (data) => {
    confirm({
      title: "Do you Want to delete these items?",
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

  const handlePictureChange = (e) => {
    const files = e.target.files;
    const urls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setSelectedPictures((prevSelectedPictures) => [
        ...prevSelectedPictures,
        file,
      ]);
      const imageUrl = URL.createObjectURL(file);
      urls.push(imageUrl);
    }

    setUploadedImageUrls((prevUrls) => [...prevUrls, ...urls]);
  };

  const handleOther = (value, label) => {
    // console.log(forms.values.eventCategory === "Others")
    // console.log(label.label);

    if (label.label === "Others") {
      console.log("trihh");
      setShowText(true);
    } else if (label.label !== "Others") {
      setShowText(false);
    }
    forms.setFieldValue("eventCategory", label.value);
  };

  return (
    <>
      {loader ? <Loader date={loader} /> : null}
      <div className="w-full mx-auto">
        <div className="w-full h-20 flex justify-between items-baseline">
          <input
            type="text"
            placeholder="Search Events"
            className=" h-9 bg-gray-200 p-4 rounded-md"
          />
          <button
            className="w-28 bg-first rounded-md text-white h-9 hover:bg-second duration-200 shadow-sm shadow-first hover:shadow-second"
            onClick={handleAddEvent}
          >
            + Add Events
          </button>
        </div>
        {/* model */}

        <Modal
          title={`${edit ? "Edit event" : "Add Event"}`}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={false}
        >
          <div className="w-full flex flex-col gap-3 items-center mt-10 h-fit">
            <Select
              showSearch
              className="w-[90%] h-[40px] mb-6"
              placeholder="Search to Select"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              // filterSort={(optionA, optionB) =>
              //   (optionA?.label ?? "")
              //     .toLowerCase()
              //     .localeCompare((optionB?.label ?? "").toLowerCase())
              // }
              options={[
                {
                  value: "1",
                  label: "Wedding",
                },
                {
                  value: "2",
                  label: "Birthday",
                },
                {
                  value: "3",
                  label: "Anniversary",
                },
                {
                  value: "4",
                  label: "New year",
                },
                {
                  value: "5",
                  label: "Others",
                },
              ]}
              value={forms.values.eventCategory}
              onChange={(value, label) => handleOther(value, label)}
            />
            {forms.values.eventCategory === "5" && (
              <input
                type="text"
                placeholder="Others"
                className={`${
                  forms.errors.other && forms.touched.other
                    ? "border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
                    : "w-[90%]  rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
                }`}
                name="other"
                id="other"
                onBlur={forms.handleBlur}
                value={forms.values.other}
                onChange={forms.handleChange}
              />
            )}

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
              placeholder="Host Name"
              className={`${
                forms.errors.hostName && forms.touched.hostName
                  ? "border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
                  : "w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
              }`}
              name="hostName"
              id="hostName"
              onBlur={forms.handleBlur}
              value={forms.values.hostName}
              onChange={forms.handleChange}
            />
            <input
              type="email"
              placeholder="Host Email"
              className={`${
                forms.errors.hostEmail && forms.touched.hostEmail
                  ? "border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
                  : "w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
              }`}
              name="hostEmail"
              id="hostEmail"
              onBlur={forms.handleBlur}
              value={forms.values.hostEmail}
              onChange={forms.handleChange}
            />
            <input
              type="number"
              placeholder="Host WhatsApp Number"
              className={`${
                forms.errors.hostWhatsappNumber &&
                forms.touched.hostWhatsappNumber
                  ? "border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
                  : "w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6"
              }`}
              name="hostWhatsappNumber"
              id="hostWhatsappNumber"
              onBlur={forms.handleBlur}
              value={forms.values.hostWhatsappNumber}
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
                onChange={(value) => {
                  forms2.setFieldValue("photographerId", value),
                    forms2.setFieldValue("eventId", id);
                }}
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                // onClick={}
                className="w-28 bg-first rounded-md text-white h-9 hover:bg-second duration-200 shadow-sm shadow-first hover:shadow-second"
              >
                Submit
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          width={700}
          title={`Upload images`}
          open={isModalOpen3}
          onCancel={() => setIsModalOpen3(false)}
          footer={false}
        >
          <div className="flex flex-col justify-center h-fit">
            <div className="flex flex-col justify-center items-center space-y-5 border-2 border-dashed p-5">
              {/* Use ref to access the file input element */}

              <div className="text-center py-6">
                <input
                  accept="image/*"
                  id="image-upload"
                  type="file"
                  ref={fileInputRef}
                  name="uploadProfilePic"
                  style={{ display: "none", backgroundColor: "white" }}
                  onChange={handlePictureChange}
                  multiple
                />
                <label htmlFor="image-upload">
                  <div className="w-[140px] h-[140px] flex flex-col justify-center items-center rounded bg-white text-primary">
                    <img
                      alt="uploaded"
                      src={imageUpload}
                      className="w-36 h-36 object-contain cursor-pointer"
                    />
                  </div>
                </label>
              </div>

              <button
                onClick={handleSave}
                className="bg-blue-500 px-8 py-2 text-white rounded-lg"
              >
                Upload
              </button>
              <button
                onClick={faceMacth}
                className="bg-blue-500 px-8 py-2 text-white rounded-lg"
              >
                Finish
              </button>
            </div>
            <div
              className={`grid grid-cols-4 place-items-center gap-4  p-4 ${
                savedPictures.length > 0 ? "border-2 border-dashed" : ""
              }`}
            >
              {savedPictures.map((picture, index) => (
                <div
                  key={index}
                  className="flex gap-2  w-[100px] h-[100px] items-start"
                >
                  <div className="w-[85%] h-full flex items-center">
                    <img
                      src={URL.createObjectURL(picture)}
                      alt={`Saved ${index}`}
                      className="object-contain "
                    />
                  </div>

                  <button
                    onClick={() => handleDeleteImage(index)}
                    className="w-[15%] mt-5"
                  >
                    <FaTrash className="text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
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
                          handleEdit(data);
                        }}
                        className="cursor-pointer"
                      />
                    </button>

                    <button>
                      <MdDelete
                        size={22}
                        onClick={() => showConfirm(data)}
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
                <div className="w-full mx-auto mt-3 flex gap-3 justify-end">
                  <img
                    src={assign}
                    alt=""
                    className="w-[20px] h-[20px] cursor-pointer"
                    onClick={() => {
                      handleAssign(data);
                    }}
                  />

                  <img
                    src={qr}
                    alt=""
                    className="w-[20px] h-[20px] cursor-pointer"
                    onClick={() => handleDownloadQR(data)}
                  />
                  <img
                    src={upimg}
                    alt=""
                    className="w-[20px] h-[20px] cursor-pointer"
                    onClick={() => handleUploadIamge(data)}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default ManageEvents;
