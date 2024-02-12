import React, { useEffect, useState } from 'react';
import { Modal, message } from 'antd';
import { ManagephotographerSchema, PhotographerInitValue }from "../../Validation/managePhotographer"
import { useFormik } from 'formik';
import { CreatePhotoGrapher,getPhotoGrapher } from '../../services/AdminServices';
import { useNavigate } from 'react-router-dom';
import Loader from '../../utils/loadder';
import DataTable from 'react-data-table-component';


const ManagePhotographer = () => {
  let navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [photoGrapher, setphotoGrapher] = useState(false);



  const [messageApi, contextHolder] = message.useMessage();

  const showModal = () => {
    setIsModalOpen(true);
  };  

  const forms = useFormik({
    initialValues: PhotographerInitValue,
    validationSchema: ManagephotographerSchema,
    onSubmit: (values) => {
      console.log(values)
      submitForms(values);
    },
  });

  const submitForms = async(values)=>{
    setLoader(true)
    try {
      let data = await CreatePhotoGrapher(values)
      console.log(data.data)
      getPhotoGraphers()
      handleCancel()
    } catch (error) {
      if(error.response.status == 401){
        navigate('/')
      }
      messageApi.open({
        type: 'error',
        content: error.response.data.message,
      });
    }finally{
      setLoader(false)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    forms.resetForm()
  };

  const getPhotoGraphers = async ()=>{
    setLoader(true)
    try {
      let data = await getPhotoGrapher()
      setphotoGrapher(data.data)
    } catch (error) {
      if(error.response.status == 401){
        navigate('/')
      }

    }finally{
      setLoader(false)
    }
  }
  useEffect(()=>{
    getPhotoGraphers()
  },[])


  const columns = [
    {
      name: (
        <h1 className="text-lg text-gray-500">
          S.No
        </h1>
      ),
      selector: (row, ind) => ind + 1,
    },
    {
      name: (
        <h1 className="text-lg text-gray-500">
         Name
        </h1>
      ),
      selector: (row) => row.userName,
    },
    {
      name: (
        <h1 className="text-lg text-gray-500">
          Phone Number
        </h1>
      ),
      selector: (row) =>  row.contact,
    },
    {
      name: (
        <h1 className="text-lg text-gray-500">
          email
        </h1>
      ),
      selector: (row) => row.email,
    },
  ]

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


  return (
    <>
    {loader?<Loader data={loader}/>:null}
    {contextHolder}
    <div className='w-[90%] m-auto'>
      <div className='w-full h-24 flex justify-between items-baseline'>
        <input type="text" placeholder='Search Photographer' className='mt-10 h-9 bg-gray-200 p-4 rounded-md' />
        <button className='w-40 bg-slate-600 rounded-md text-white h-9 b' onClick={showModal}> + Add Photographer</button>
      </div>

      {/* models */}  

      <Modal title="Create New Events" open={isModalOpen} onCancel={handleCancel} footer={false}>
        <div className='w-[90%] m-auto mt-5 flex flex-col items-center'>
          <input type="text" placeholder='Photographer Name' className={`${forms.errors.userName && forms.touched.userName ? 'border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6' : 'w-[90%]  rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6'}`} name='userName' id='userName' onBlur={forms.handleBlur} value={forms.values.userName} onChange={forms.handleChange} />
          <input type="number" placeholder='Photographer Contact' className={`${forms.errors.contact && forms.touched.contact ? 'border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6' : 'w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6'}`} name='contact' id='contact' onBlur={forms.handleBlur} value={forms.values.contact} onChange={forms.handleChange} />          
          <input type="text" placeholder='Photographer email' className={`${forms.errors.email && forms.touched.email ? 'border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6' : 'w-[90%]  rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6'}`} name='email' id='email' onBlur={forms.handleBlur} value={forms.values.email} onChange={forms.handleChange} />
        </div>
        <div className='flex justify-center'>
          <button type='submit' onClick={forms.handleSubmit} className='w-28 bg-slate-600 rounded-md text-white h-9 b'>Submit</button>
        </div>
      </Modal>

      { photoGrapher &&  <div className='w-[95%] m-auto mt-5 overflow-auto'>
        <DataTable
          columns={columns}
          data={photoGrapher}
          fixedHeader
          pagination
          bordered
          customStyles={customStyles}
        />
      </div>}

    </div>
    </>
  )
}

export default ManagePhotographer