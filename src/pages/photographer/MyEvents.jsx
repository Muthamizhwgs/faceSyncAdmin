import React, { useState, useRef } from 'react';
import { FaTrash } from 'react-icons/fa';
import { UploadGroupPhotoes } from "../../services/AdminServices"
import Loader from '../../utils/loadder';

const Myevents = () => {

  const [selectedPictures, setSelectedPictures] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [savedPictures, setSavedPictures] = useState([]);
  const fileInputRef = useRef(null);
  const [loader, setLoader] = useState(false)
  const handlePictureChange = (e) => {
    const files = e.target.files;
    const urls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setSelectedPictures((prevSelectedPictures) => [...prevSelectedPictures, file]);
      const imageUrl = URL.createObjectURL(file);
      urls.push(imageUrl);
    }

    setUploadedImageUrls((prevUrls) => [...prevUrls, ...urls]);
  };

  const handleSave = async () => {
    console.log(selectedPictures)
    if (selectedPictures.length > 0) {
      try {
        const formData = new FormData();
        await selectedPictures.forEach((image) => {
          formData.append(`images`, image);
        });
        let datas = await UploadGroupPhotoes(formData)
        console.log(datas)

      } catch (error) {
        console.error(error)
      } finally {
        setLoader(false)
      }

      console.log('Saving pictures:', selectedPictures);
      setSavedPictures((prevSavedPictures) => [...prevSavedPictures, ...selectedPictures]);
      setSelectedPictures([]);
      fileInputRef.current.value = '';
    } else {
      console.log('No pictures selected');
    }
  };

  const handleDelete = (index) => {
    const newPictures = savedPictures.filter((picture, i) => i !== index);
    setSavedPictures(newPictures);
  };

  return (
    <>
      {loader ? < Loader data={loader} /> : null}
      <div className='flex flex-col justify-center'>
        <div className='flex flex-col justify-center items-center space-y-5 border-2 border-dashed h-[30vh]'>
          {/* Use ref to access the file input element */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePictureChange}
            multiple
            className='pl-20'
          />
          <button onClick={handleSave} className='bg-blue-500 px-8 py-2 text-white rounded-lg'>Upload</button>
        </div>
        <div className={`grid grid-cols-4 place-items-center  p-4 ${savedPictures.length > 0 ? 'border-2 border-dashed' : ''}`}>
          {savedPictures.map((picture, index) => (
            <div key={index}>
              <img src={URL.createObjectURL(picture)} alt={`Saved ${index}`} style={{ maxWidth: '100%', maxHeight: '300px', marginTop: '10px' }} className='w-48 h-48' />
              <button onClick={() => handleDelete(index)}><FaTrash className='text-red-500 -mt-10 ml-1' /></button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Myevents;
