import React, { useEffect, useRef, useState } from "react";
import { Modal, Select, message } from "antd";
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
  updateEvent,
  getUsersByEventId,
  sendImages,
  UploadGroupPhotoes,
} from "../../services/AdminServices";
import DateFormat from "../../utils/dateFormat";
import { MdDelete } from "react-icons/md";
import pg from "../../assets/pg-black.png";
import qr from "../../assets/qr.png";
import upimg from "../../assets/upimg.png";
import upload from "../../assets/uploadimg.png";
import imageUpload from "../../assets/upload.png";
import { ExclamationCircleFilled } from "@ant-design/icons";
import DataTable from "react-data-table-component";
import { Tabs } from "antd";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
const { TabPane } = Tabs;

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
  const [eventDetails, setEventDetails] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const [getGuest, setGetGuest] = useState([]);

  // console.log(data);

  const handleAddEvent = () => {
    setIsModalOpen(true);
  };

  const handleEdit = (data) => {
    ManageEventsInitValue.eventName = data.eventName;
    ManageEventsInitValue.eventLocation = data.eventLocation;
    ManageEventsInitValue.eventDate = data.eventDate;
    ManageEventsInitValue.eventCategory = data.eventCategory;
    ManageEventsInitValue.assignPhotographer = data.assignPhotographer;
    ManageEventsInitValue.hostName = data.hostName;
    ManageEventsInitValue.hostEmail = data.hostEmail;
    ManageEventsInitValue.hostWhatsappNumber = data.hostWhatsappNumber;
    setId(data._id);
    console.log(data._id);
    setEdit(true);
    setIsModalOpen(true);
    console.log(data);
  };

  const handleAssign = (data) => {
    setId(data._id);
    setIsModalOpen2(true);
  };

  const getUsersByEvent = async (id) => {
    let getUserData = await getUsersByEventId(id);
    console.log(getUserData);
    setGetGuest(getUserData.data);
  };

  const handleUploadIamge = (data) => {
    console.log(data);
    setId(data._id);
    setEventDetails([data]);
    getUsersByEvent(data.folderName);
    setIsModalOpen3(true);
  };

  const handleSave = async (folderName) => {
    console.log(selectedPictures);
    if (selectedPictures.length > 0) {
      try {
        const formData = new FormData();
        selectedPictures.forEach((image) => {
          formData.append(`images`, image);
        });

        formData.append("eventId", folderName);

        console.log(formData);

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

  const faceMacth = async (folderName) => {
    try {
      console.log(folderName);
      let val = await sendImages(folderName);
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
      const data = { ...values };

      if (values.eventCategory === "Others") {
        data.eventCategory = values.other;
      }

      const finalData =
        values.eventCategory === "Others"
          ? Object.fromEntries(
              Object.entries(data).filter(([key]) => key !== "other")
            )
          : Object.fromEntries(
              Object.entries(data).filter(([key]) => key !== "other")
            );

      let val = await updateEvent(id, finalData);
      console.log(val);
      MyEvents();
      handleCancel();
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
      window.location.reload();
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
      // const data = {
      //   ...values,
      //   ...{ eventCategory: values.other},
      // };
      const data = { ...values };

      if (values.eventCategory === "Others") {
        data.eventCategory = values.other;
      }

      const finalData =
        values.eventCategory === "Others"
          ? Object.fromEntries(
              Object.entries(data).filter(([key]) => key !== "other")
            )
          : Object.fromEntries(
              Object.entries(data).filter(([key]) => key !== "other")
            );

      console.log(finalData, "ssss");
      let val = await createEvents(finalData);


      if(val.data){
        messageApi.open({
          type: "success",
          content: 'Event added successfully',
        });
      }
      
      MyEvents();
      handleCancel();
      forms.resetForm();
     
    } catch (error) {
      console.log(error);
    }finally{
      window.location.reload();
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

  const handleDelete = async (data) => {
    setLoader(true);
    console.log(data._id);
    try {
      let adminStatus = {
        active: false,
      };
      let val = await updateEvent(data._id, adminStatus);
      console.log(val);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
      MyEvents();
    }
  };

  const { confirm } = Modal;

  const showConfirm = (data) => {
    confirm({
      title: "Do you want to delete this event?",
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
    if (label.value === "Others") {
      setShowText(true);
    } else if (label.value !== "Others") {
      setShowText(false);
      forms.setFieldValue("other", "");
    }
    forms.setFieldValue("eventCategory", label.value);
  };

  const [filteredData, setFilteredData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const filterItem = (events) => {
      return Object.values(events).some((value) => {
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

    const filteredResult = events.filter(filterItem);

    setFilteredData(filteredResult);
  }, [events, searchTerm]);

  const [filteredData2, setFilteredData2] = useState([]);

  const [searchTerm2, setSearchTerm2] = useState("");

  useEffect(() => {
    const filterItem = (getGuest) => {
      return Object.values(getGuest).some((value) => {
        if (typeof value === "string") {
          const lowerCaseValue = value.toString().toLowerCase();
          return lowerCaseValue.includes(searchTerm2.toLowerCase());
        } else if (value instanceof Date) {
          const dateValue = value.toISOString().toLowerCase();
          return dateValue.includes(searchTerm2.toLowerCase());
        } else if (typeof value == "number") {
          const stringValue = value.toString().toLowerCase();
          return stringValue === searchTerm2.toLowerCase();
        }
        return false;
      });
    };

    const filteredResult = getGuest.filter(filterItem);

    setFilteredData2(filteredResult);
  }, [getGuest, searchTerm2]);

  const getFormattedDate = (date) => {
    const dateObject = new Date(date);

    const formattedDate = `${("0" + dateObject.getDate()).slice(-2)}-${(
      "0" +
      (dateObject.getMonth() + 1)
    ).slice(-2)}-${dateObject.getFullYear()}`;

    return formattedDate;
  };

  const columns = [
    {
      name: <h1 className="text-base  text-gray-600">S.No</h1>,
      selector: (row, ind) => ind + 1,
      width: "100px",
    },
    {
      name: <h1 className="text-base  text-gray-600">Event Name</h1>,
      selector: (row) => <p className="capitalize">{row.eventName}</p>,
      width: "140px",
    },

    {
      name: <h1 className="text-base  text-gray-600">Event Date</h1>,
      selector: (row) => getFormattedDate(row.eventDate),
      width: "150px",
    },
    {
      name: <h1 className="text-base  text-gray-600">Host Name</h1>,
      selector: (row) => <p className="capitalize ">{row.hostName}</p>,
      width: "150px",
    },
    {
      name: <h1 className="text-base  text-gray-600">Host Email Address</h1>,
      selector: (row) => <p className="">{row.hostEmail}</p>,
      width: "250px",
    },
    {
      name: <h1 className="text-base  text-gray-600">Host Whatsapp Number</h1>,
      selector: (row) => <p className="capitalize">{row.hostWhatsappNumber}</p>,
      width: "250px",
    },
    {
      name: <h1 className="text-base  text-gray-600">Actions</h1>,
      width: "100px",
      cell: (row) => (
        <div className="flex flex-row">
          <FaEdit
            className="w-8 h-5 cursor-pointer text-blue-500"
            onClick={() => {
              handleEdit(row);
            }}
          />
          <MdDelete
            className="w-10 h-6 cursor-pointer text-red-500"
            onClick={() => showConfirm(row)}
          />
        </div>
      ),
    },
  ];

  const columns2 = [
    {
      name: <h1 className="text-base text-gray-600">S.No</h1>,
      selector: (row, ind) => ind + 1,
    },
    {
      name: <h1 className="text-base text-gray-600">Name</h1>,
      selector: (row) => <p className="capitalize">{row.name}</p>,
    },

    {
      name: <h1 className="text-base text-gray-600">Mobile Number</h1>,
      selector: (row) => <p className="capitalize">{row.contact}</p>,
    },
    {
      name: <h1 className="text-base text-gray-600">Email Address</h1>,
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

//  console.log(ManageEventsInitValue)

  return (
    <>
       {contextHolder}
      {loader ? <Loader date={loader} /> : null}
      <div className="w-full mx-auto font-[Inter]">
        <div className="w-full h-20 flex justify-between items-baseline">
          <input
            type="text"
            placeholder="Search Events"
            className=" h-9 bg-gray-200 p-4 rounded-md text-sm"
            onChange={(event) => setSearchTerm(event.target.value)}
            value={searchTerm}
          />
          <button
            className="px-2 py-1 text-std bg-first rounded-md text-white h-9 hover:bg-second duration-200 shadow-sm shadow-first hover:shadow-second"
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
              className="w-[90%] h-[40px] mb-6 text-sm"
              placeholder="Select Event Category"
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
                  value: "Wedding",
                  label: "Wedding",
                },
                {
                  value: "Birthday",
                  label: "Birthday",
                },
                {
                  value: "Anniversary",
                  label: "Anniversary",
                },
                {
                  value: "New year",
                  label: "New year",
                },
                {
                  value: "Others",
                  label: "Others",
                },
              ]}
              // value={forms.values.eventCategory}
              onChange={(value, label) => handleOther(value, label)}
            />
            {forms.values.eventCategory === "Others" && (
              <input
                type="text"
                placeholder="Enter the event"
                className={`${
                  forms.errors.other && forms.touched.other
                    ? "border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6 text-sm"
                    : "w-[90%]  rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6 text-sm"
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
                  ? "border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6 text-sm"
                  : "w-[90%]  rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6 text-sm"
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
                  ? "border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6 text-sm"
                  : "w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6 text-sm"
              }`}
              name="eventLocation"
              id="eventLocation"
              onBlur={forms.handleBlur}
              value={forms.values.eventLocation}
              onChange={forms.handleChange}
            />

            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{
                      backgroundColor: "#F5F5F5",
                      color: "#105D50",
                      "& .MuiFormLabel-root.Mui-focused": {
                        color: "#105D50",
                      },

                      "& .MuiInputBase-root": {
                        height: 45,
                        width: 280,
                        fontSize: "14px",
                      },
                      "&:hover": {
                        // Apply styles when hovering over the TextField
                        backgroundColor: "#EEEDED", // Change background color on hover
                      },
                    }}
                    label="D.O.B *"
                    format="DD/MM/YYYY"
                    variant="outlined"
                    name="dob"
                    fullWidth
                    type="date"
                    //value={formData.dob}
                    onChange={handleDobChange}

                    //defaultValue={dayjs('')}
                  />
                </LocalizationProvider> */}
            <div className="mb-6">
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="en-gb"
              >
                <DatePicker
                  sx={{
                    backgroundColor: "#E5E7EB",
                    borderRadius: "6px",
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#105D50",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        border: "1.5px solid #E5E7EB",
                        borderRadius: "6px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#E5E7EB",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#E5E7EB",
                      },
                    },
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      height: "42px",
                      color: "#4B5563",
                    },
                    "& .MuiInputBase-root": {
                      fontSize: "14px",
                      height: "44px",
                      width: "425px",
                      "&:hover": {
                        backgroundColor: "#E5E7EB",
                      },
                    },
                    "& .MuiFormLabel-root": {
                      fontSize: "13px",
                      color: "#4B5563",
                    },
                  }}
                  name="eventDate"
                  placeholder="Event date"
                  id="eventDate"
                  
                  className={`${
                    forms.errors.eventDate
                      ? "border-red-500"
                      : ""
                  } `}
                  value={
                    forms.values.eventDate ? moment(forms.values.eventDate) : null
                  }
                  onChange={(date) =>
                    forms.setFieldValue("eventDate", date ? date.toDate() : null)
                  }
                />
              </LocalizationProvider>
            </div>

            {/* <DatePicker
              format="DD-MM-YYYY"
              name="eventDate"
              placeholder="Event date"
              id="eventDate"
              className={`${
                forms.errors.eventDate
                  ? "border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6 text-sm"
                  : " w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6 text-sm"
              } `}
              value={
                forms.values.eventDate ? moment(forms.values.eventDate) : null
              }
              onChange={(date) =>
                forms.setFieldValue("eventDate", date ? date.toDate() : null)
              }
            /> */}

            <input
              type="text"
              placeholder="Host Name"
              className={`${
                forms.errors.hostName && forms.touched.hostName
                  ? "border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6 text-sm"
                  : "w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6 text-sm"
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
                  ? "border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6 text-sm"
                  : "w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6 text-sm"
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
                  ? "border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-3 text-sm"
                  : "w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-3 text-sm"
              }`}
              name="hostWhatsappNumber"
              id="hostWhatsappNumber"
              onBlur={forms.handleBlur}
              value={forms.values.hostWhatsappNumber}
              onChange={forms.handleChange}
            />
            <Select
              showSearch
              className="w-[90%] h-[40px] mb-6"
              placeholder="Assign Photographer"
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
              // value={forms2.values.photographerId}
              onChange={(value) =>
                forms.setFieldValue("assignPhotographer", value)
              }
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              onClick={forms.handleSubmit}
              className="px-4 py-1 text-sm bg-first rounded-md text-white h-9 hover:bg-second duration-200 shadow-sm shadow-first hover:shadow-second"
            >
              Submit
            </button>
          </div>
        </Modal>

        {/* <Modal
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
        </Modal> */}

        <Modal
          width={900}
          title={`${eventDetails[0]?.eventName}`}
          open={isModalOpen3}
          onCancel={() => setIsModalOpen3(false)}
          footer={false}
        >
          <div className="mt-5 w-full h-[500px] flex flex-col border-[1.5px] p-5 rounded overflow-y-scroll font-[Inter]">
            <Tabs defaultActiveKey="1">
              {new Array(4).fill(null).map((_, i) => {
                const id = String(i + 1);
                return (
                  <TabPane
                    className="ant-tabs-tab-btn"
                    tab={`${id == 1 ? `Event Details` : ""}
                     ${id == 2 ? "Download QR Code" : ""}
                     ${id == 3 ? "Guests" : ""}
                      ${id == 4 ? "Photo Delivery" : ""}`}
                    key={id}
                  >
                    {id == 1 && (
                      <div className="w-full h-full flex">
                        {eventDetails?.map((d) => (
                          <div
                            className=" flex flex-col gap-5 my-5"
                            key={d.eventName}
                          >
                            <p className="text-sm text-gray-700 font-semibold font-[Inter]">
                              Event Name:{" "}
                              <span className="text-gray-500 font-medium">
                                {d.eventName}
                              </span>
                            </p>
                            <p className="text-sm text-gray-700 font-semibold font-[Inter]">
                              Event Date:{" "}
                              <span className="text-gray-500 font-medium">
                                {getFormattedDate(d.eventDate)}
                              </span>
                            </p>
                            <p className="text-sm text-gray-700 font-semibold font-[Inter]">
                              Event Location:{" "}
                              <span className="text-gray-500 font-medium">
                                {d.eventLocation}
                              </span>
                            </p>
                            <p className="text-sm text-gray-700 font-semibold font-[Inter]">
                              Event Category:{" "}
                              <span className="text-gray-500 font-medium">
                                {d.eventCategory}
                              </span>
                            </p>
                            <p className="text-sm text-gray-700 font-semibold font-[Inter]">
                              Assigned Photographer:{" "}
                              <span className="text-gray-500 font-medium">
                                {d.photographername}
                              </span>
                            </p>
                            <p className="text-sm text-gray-700 font-semibold font-[Inter]">
                              Host Name:{" "}
                              <span className="text-gray-500 font-medium">
                                {d.hostName}
                              </span>
                            </p>
                            <p className="text-sm text-gray-700 font-semibold font-[Inter]">
                              Host Email Address:{" "}
                              <span className="text-gray-500 font-medium">
                                {d.hostEmail}
                              </span>
                            </p>
                            <p className="text-sm text-gray-700 font-semibold font-[Inter]">
                              Host WhatsApp Number:{" "}
                              <span className="text-gray-500 font-medium">
                                {d.hostWhatsappNumber}
                              </span>
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    {id == 2 && (
                      <>
                        {eventDetails.map((d, id) => (
                          <div
                            className="w-full flex flex-col justify-center items-center gap-10 mt-5"
                            key={id}
                          >
                            <div className="w-[60%]">
                              <img
                                src={d.qrURL}
                                className="mx-auto w-[250px] h-[250px]"
                              />
                            </div>
                            <div>
                              <button
                                className="w-32 bg-first rounded-md text-white h-12 hover:bg-second duration-200 shadow-sm shadow-first hover:shadow-second"
                                onClick={() => handleDownloadQR(d)}
                              >
                                Download
                              </button>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                    {id == 4 && (
                      <div className="w-full flex flex-col justify-center h-fit mt-10">
                        <div className="flex flex-col justify-center items-center gap-10 border-2 border-dashed p-5">
                          {/* Use ref to access the file input element */}

                          <div className="text-center">
                            <input
                              accept="image/*"
                              id="image-upload"
                              type="file"
                              ref={fileInputRef}
                              name="uploadProfilePic"
                              style={{
                                display: "none",
                                backgroundColor: "white",
                              }}
                              onChange={handlePictureChange}
                              multiple
                            />
                            <label htmlFor="image-upload">
                              <div className="w-[140px] h-[140px] flex flex-col justify-center items-center rounded bg-white text-primary">
                                <img
                                  alt="uploaded"
                                  src={upload}
                                  className="w-36 h-36 object-contain cursor-pointer"
                                />
                              </div>
                            </label>
                          </div>
                          <div className="flex gap-4">
                            <button
                              onClick={() =>
                                handleSave(eventDetails[0]?.folderName)
                              }
                              className="w-32 bg-first rounded text-white h-9 hover:bg-second duration-200 shadow-sm shadow-first hover:shadow-second"
                            >
                              Share to guest
                            </button>
                            <button
                              onClick={() =>
                                faceMacth(eventDetails[0]?.folderName)
                              }
                              className="w-32 bg-first rounded text-white h-9 hover:bg-second duration-200 shadow-sm shadow-first hover:shadow-second"
                            >
                              Share to host
                            </button>
                          </div>
                        </div>
                        <div
                          className={`grid grid-cols-4 place-items-center gap-4  p-4 ${
                            savedPictures.length > 0
                              ? "border-2 border-dashed"
                              : ""
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
                                <FaTrash className="text-red-500 w-[14px] h-[14px]" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {id == 3 && (
                      <div className="w-full text-lg mt-4">
                        <div className="w-full h-20 flex justify-between items-baseline">
                          <input
                            type="text"
                            placeholder="Search Events"
                            className=" h-9 bg-gray-200 p-4 rounded-md text-sm"
                            onChange={(event) =>
                              setSearchTerm2(event.target.value)
                            }
                            value={searchTerm2}
                          />
                        </div>
                        <DataTable
                          columns={columns2}
                          data={filteredData2}
                          fixedHeader
                          pagination
                          bordered
                          customStyles={customStyles}
                          pointerOnHover
                          fixedHeaderScrollHeight="400px"
                        />
                      </div>
                    )}
                  </TabPane>
                );
              })}
            </Tabs>
          </div>
        </Modal>

        {/* cards */}

        {/* <div className="grid grid-cols-3 gap-5">
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
        </div> */}

        {events && (
          <div className="w-full overflow-auto">
            <DataTable
              columns={columns}
              data={filteredData}
              fixedHeader
              pagination
              bordered
              customStyles={customStyles}
              pointerOnHover
              onRowClicked={handleUploadIamge}
              fixedHeaderScrollHeight="400px"
            />
          </div>
        )}
      </div>
    </>
  );
}

export default ManageEvents;
