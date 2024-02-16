import React, { useState, useRef, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  UploadGroupPhotoes,
  face,
  getEventsByPhotographer,
  sendImages,
} from "../../services/AdminServices";
import Loader from "../../utils/loadder";
import { MdDelete, MdOutlineDateRange } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import DateFormat from "../../utils/dateFormat";
import { Modal } from "antd";
import imageUpload from "../../assets/upload.png";
import upimg from "../../assets/upimg.png";
import DataTable from "react-data-table-component";
import { Tabs } from "antd";
const { TabPane } = Tabs;
import upload from "../../assets/uploadimg.png";

const Myevents = () => {
  const [selectedPictures, setSelectedPictures] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [savedPictures, setSavedPictures] = useState([]);
  const fileInputRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventId, setEventId] = useState("");
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [id, setId] = useState("");

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

  const handleSave = async (folderName) => {
    console.log(selectedPictures);
    if (selectedPictures.length > 0) {
      try {
        const formData = new FormData();
        selectedPictures.forEach((image) => {
          formData.append(`images`, image);
        });

        formData.append('eventId', folderName);
       
        console.log(formData)

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

  const handleDelete = (index) => {
    const newPictures = savedPictures.filter((i) => i !== index);
    setSavedPictures(newPictures);
  };

  const showModal = (data) => {
    setIsModalOpen(true);
    setEventId(data._id);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const faceMacth = async (folderName) => {
    try {
      let val = await sendImages(folderName);
      console.log(val.data);
    } catch (error) {}
  };

  const [events, setEvents] = useState([]);

  const [eventDetails, setEventDetails] = useState([]);

  const MyEvents = async () => {
    try {
      setLoader(true);
      let values = await getEventsByPhotographer();
      console.log(values);
      setEvents(values.data);
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    MyEvents();
  }, []);

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

  const getFormattedDate = (date) => {
    const dateObject = new Date(date);
  
    const formattedDate = `${('0' + dateObject.getDate()).slice(-2)}-${('0' + (dateObject.getMonth() + 1)).slice(-2)}-${dateObject.getFullYear()}`;
  
    return formattedDate;
  };

  const columns = [
    {
      name: <h1 className="text-base  text-gray-600">S.No</h1>,
      selector: (row, ind) => ind + 1,
    },
    {
      name: <h1 className="text-base  text-gray-600">Event Name</h1>,
      selector: (row) => <p className="capitalize">{row.eventName}</p>,
    },

    {
      name: <h1 className="text-base  text-gray-600">Event Date</h1>,
      selector: (row) => getFormattedDate(row.eventDate),
    },
    {
      name: <h1 className="text-base  text-gray-600">Event Location</h1>,
      selector: (row) => <p className="capitalize">{row.eventLocation}</p>,
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

  const handleUploadIamge = (data) => {
    console.log(data);
    setId(data._id);
    setEventDetails([data]);
    setIsModalOpen3(true);
  };

  const handleDeleteImage = (index) => {
    console.log("handle");
    const newPictures = savedPictures.filter((_, i) => i !== index);
    setSavedPictures(newPictures);
  };

  return (
    <>
      <Modal
        width={700}
        title={`Upload images`}
        open={isModalOpen}
        onCancel={handleCancel}
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
            {/* <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePictureChange}
              multiple
              className="pl-20"
            /> */}
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
                  onClick={() => handleDelete(index)}
                  className="w-[15%] mt-5"
                >
                  <FaTrash className="text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {loader ? <Loader date={loader} /> : null}
      <div className="w-full mx-auto px-5">
        <div className="w-full h-20 flex justify-between items-baseline">
          <input
            type="text"
            placeholder="Search Events"
            className=" h-9 bg-gray-200 p-4 rounded-md text-std"
            onChange={(event) => setSearchTerm(event.target.value)}
            value={searchTerm}
          />
        </div>
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
                      <img
                        src={upimg}
                        alt=""
                        onClick={() => showModal(data)}
                        className="w-[24px] h-[24px] cursor-pointer"
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
              </div>
            ))}
        </div> */}

        <Modal
          width={900}
          title={`${eventDetails[0]?.eventName}`}
          open={isModalOpen3}
          onCancel={() => setIsModalOpen3(false)}
          footer={false}
        >
          <div className="mt-5 w-full h-[500px] flex flex-col border-[1.5px] p-5 rounded overflow-y-scroll font-[Inter]">
            <Tabs defaultActiveKey="1">
              {new Array(2).fill(null).map((_, i) => {
                const id = String(i + 1);
                return (
                  <TabPane
                    className="ant-tabs-tab-btn"
                    tab={`${id == 1 ? `Event Details` : ""}
                   
                      ${id == 2 ? "Photo Delivery" : ""}`}
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
                                {d.photographerName}
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
                              onClick={() =>handleSave(eventDetails[0]?.folderName)}
                              className="w-32 bg-first rounded text-white h-9 hover:bg-second duration-200 shadow-sm shadow-first hover:shadow-second"
                            >
                              Share to guest
                            </button>
                            <button
                              onClick={() => faceMacth(eventDetails[0]?.folderName)}
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
                  </TabPane>
                );
              })}
            </Tabs>
          </div>
        </Modal>

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
};

export default Myevents;
