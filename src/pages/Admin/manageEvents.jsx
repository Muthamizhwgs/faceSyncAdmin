import React, { useEffect, useState } from 'react';
import { Modal, DatePicker } from 'antd';
import { useFormik } from 'formik';
import { ManageEventsSchema, ManageEventsInitValue } from "../../Validation/manageEvents.Validation"
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineDateRange } from "react-icons/md";
import { MdOutlineDescription } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import moment from 'moment';
import Loader from '../../utils/loadder';
import { createEvents, getEvents, EditeEvent } from '../../services/AdminServices';
import DateFormat from '../../utils/dateFormat';

function ManageEvents() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState('');


  const [evets, setEvents] = useState([])


  const showModal = () => {
    setIsModalOpen(true);
  };

  const forms = useFormik({
    initialValues: ManageEventsInitValue,
    validationSchema: ManageEventsSchema,
    onSubmit: (values) => {
      edit ? EditForms(values) : submitForms(values);
    },
  });
  const handleedit = (data) => {
    ManageEventsInitValue.eventName = data.eventName;
    ManageEventsInitValue.eventLocation = data.eventLocation;
    ManageEventsInitValue.eventDate = data.eventDate;
    ManageEventsInitValue.eventSummary = data.eventSummary;
    setId(data._id)
    setEdit(true)
    setIsModalOpen(true);
    console.log(data)
  }
  const EditForms = async (values) => {
    setLoader(true)
    try {
      let val = await EditeEvent(id, values);
      console.log(val)
      MyEvents()
      handleCancel()
    } catch (error) {
      console.log(error)
    } finally {
      setLoader(false)
    }
  }


  const handleCancel = () => {
    setIsModalOpen(false);
    forms.resetForm()

  };

  const submitForms = async (values) => {
    setLoader(true)
    try {
      let val = await createEvents(values);
      console.log(val)
      MyEvents()
      handleCancel()
    } catch (error) {

    } finally {
      setLoader(false)
    }
  }

  const MyEvents = async () => {
    try {
      setLoader(true)
      let values = await getEvents()
      console.log(values)
      setEvents(values.data)
    } catch (error) {

    } finally {
      setLoader(false)
    }
  }

  useEffect(() => {
    MyEvents()
  }, [])


  return (
    <>
      {loader ? <Loader date={loader} /> : null}
      <div className='w-full mx-auto p-5 h-[100vh]'>
        <div className='w-full h-20 flex justify-between items-baseline'>
          <input type="text" placeholder='Search Events' className=' h-9 bg-gray-200 p-4 rounded-md' />
          <button className='w-28 bg-slate-600 rounded-md text-white h-9' onClick={showModal}>Add Events</button>
        </div>
        {/* model */}

        <Modal title="Create New Events" open={isModalOpen} onCancel={handleCancel} footer={false}>
          <div className='w-[90%] m-auto mt-5 flex flex-col items-center'>
            <input type="text" placeholder='Event Name' className={`${forms.errors.eventName && forms.touched.eventName ? 'border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6' : 'w-[90%]  rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6'}`} name='eventName' id='eventName' onBlur={forms.handleBlur} value={forms.values.eventName} onChange={forms.handleChange} />
            <input type="text" placeholder='Event Location' className={`${forms.errors.eventLocation && forms.touched.eventLocation ? 'border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6' : 'w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6'}`} name='eventLocation' id='eventLocation' onBlur={forms.handleBlur} value={forms.values.eventLocation} onChange={forms.handleChange} />
            <DatePicker format="DD-MM-YYYY" name='eventDate' id='eventDate' className={`${forms.errors.eventDate ? 'border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6' : ' w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6'} `} value={forms.values.eventDate ? moment(forms.values.eventDate) : null} onChange={date => forms.setFieldValue('eventDate', date ? date.toDate() : null)} />
            <input type="text" placeholder='Event Summary' className='w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6' name='eventSummary' id='eventSummary' onBlur={forms.handleBlur} value={forms.values.eventSummary} onChange={forms.handleChange} />
          </div>
          <div className='flex justify-center'>
            <button type='submit' onClick={forms.handleSubmit} className='w-28 bg-slate-600 rounded-md text-white h-9 b'>Submit</button>
          </div>
        </Modal>

        {/* cards */}

        <div className='grid grid-cols-3 gap-5'>
          {
            evets && evets.map((data, ind) => (
              <div className='basis-[32%] h-32 bg-blue-200 rounded-md' key={ind}>
                <div className='w-full p-1 mx-auto px-4 flex justify-between overflow-auto'>
                  <h1 className='mt-2'>{data.eventName}</h1>
                  <button><FaEdit size={20} onClick={() => { handleedit(data) }} /></button>
                </div>
                <div className='w-full p-1 px-3 mx-auto flex justify-between'>
                  <h1 className='mt-2 flex items-center'><IoLocationOutline size={20} />{data.eventLocation}</h1>
                  <h1 className='mt-2 flex items-center'><MdOutlineDateRange size={20} /><DateFormat data={data.eventDate} /></h1>
                </div>
                <div className='w-full p-1 mx-auto px-3 flex justify-between'>
                  <h1 className='mt-2 flex items-center'><MdOutlineDescription size={20} />{data.eventSummary}</h1>
                </div>
              </div>

            ))
          }

        </div>
      </div>
    </>
  )
}

export default ManageEvents