import React, { useState, useRef, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  UploadGroupPhotoes,
  face,
  getEventsByPhotographer,
} from "../../services/AdminServices";
import Loader from "../../utils/loadder";
import { MdDelete, MdOutlineDateRange } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import DateFormat from "../../utils/dateFormat";
import { Modal } from "antd";
import imageUpload from "../../assets/upload.png";
import upimg from "../../assets/upimg.png";

const Myevents = () => {
  const [selectedPictures, setSelectedPictures] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [savedPictures, setSavedPictures] = useState([]);
  const fileInputRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventId, setEventId] = useState("");

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

  const faceMacth = async () => {
    try {
      let val = await face();
      console.log(val.data);
    } catch (error) {}
  };

  const [events, setEvents] = useState([]);

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
      <div className="w-full mx-auto px-5 h-[100vh]">
        <div className="w-full h-20 flex justify-between items-baseline">
          <input
            type="text"
            placeholder="Search Events"
            className=" h-9 bg-gray-200 p-4 rounded-md"
          />
        </div>
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
        </div>
      </div>
    </>
  );
};

export default Myevents;
