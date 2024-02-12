import React, { useEffect, useState } from 'react';
import { Modal, message } from 'antd';
import { ManageAdminInitValue, ManageAdminSchema } from "../../Validation/managePhotographer"
import { useFormik } from 'formik';
import { getAdmin } from '../../services/AdminServices';
import { useNavigate } from 'react-router-dom';
import Loader from '../../utils/loadder';
import DataTable from 'react-data-table-component';

const ManageAdmin = () => {
  let navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [manageAdmin, setManageAdmin] = useState(false);



  const [messageApi, contextHolder] = message.useMessage();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const forms = useFormik({
    initialValues: ManageAdminInitValue,
    validationSchema: ManageAdminSchema,
    onSubmit: (values) => {
      console.log(values)
      submitForms(values);
    },
  });

  const submitForms = async (values) => {
    setLoader(true)
    try {
      let data = await createAdmin(values)
      console.log(data.data)
      getAdmin()
      handleCancel()
    } catch (error) {
      if (error.response.status == 401) {
        navigate('/')
      }
      messageApi.open({
        type: 'error',
        content: error.response.data.message,
      });
    } finally {
      setLoader(false)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    forms.resetForm()
  };

  const createAdmin = async () => {
    setLoader(true)
    try {
      let data = await createAdmin()
      setManageAdmin(data.data)
    } catch (error) {
      if (error.response.status == 401) {
        navigate('/')
      }

    } finally {
      setLoader(false)
    }
  }
  useEffect(() => {
    getAdmin()
  }, [])


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
          Role
        </h1>
      ),
      selector: (row) => row.role,
    },
    {
      name: (
        <h1 className="text-lg text-gray-500">
          Phone Number
        </h1>
      ),
      selector: (row) => row.contact,
    },
    {
      name: (
        <h1 className="text-lg text-gray-500">
          email
        </h1>
      ),
      selector: (row) => row.email,
    },
    {
      name: (
        <h1 className="text-lg text-gray-500">
          Address
        </h1>
      ),
      selector: (row) => row.address,
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
      {loader ? <Loader data={loader} /> : null}
      {contextHolder}
      <div className='w-full mx-auto p-5'>
        <div className='w-full h-20 flex sm:flex-row flex-col justify-between items-baseline'>
          <input type="text" placeholder='Search' className='h-9 bg-gray-200 p-4 rounded-md' />
          <button className='w-40 bg-slate-600 rounded-md text-white h-9 b' onClick={showModal}> + Add Admin</button>
        </div>

        {/* models */}

        <Modal title="Create New Events" open={isModalOpen} onCancel={handleCancel} footer={false}>
          <div className='w-[90%] m-auto mt-5 flex flex-col items-center'>
            <input type="text" placeholder='Admin Name' className={`${forms.errors.Name && forms.touched.Name ? 'border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6' : 'w-[90%]  rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6'}`} name='name' id='name' onBlur={forms.handleBlur} value={forms.values.name} onChange={forms.handleChange} />
            <input type="text" placeholder='Admin Role' className={`${forms.errors.role && forms.touched.role ? 'border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6' : 'w-[90%]  rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6'}`} name='role' id='role' onBlur={forms.handleBlur} value={forms.values.role} onChange={forms.handleChange} />
            <input type="number" placeholder='Admin Contact' className={`${forms.errors.contact && forms.touched.contact ? 'border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6' : 'w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6'}`} name='contact' id='contact' onBlur={forms.handleBlur} value={forms.values.contact} onChange={forms.handleChange} />
            <input type="text" placeholder='Admin email' className={`${forms.errors.email && forms.touched.email ? 'border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6' : 'w-[90%]  rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6'}`} name='email' id='email' onBlur={forms.handleBlur} value={forms.values.email} onChange={forms.handleChange} />
            <input type="text" placeholder='Admin Address' className={`${forms.errors.address && forms.touched.address ? 'border-red-500 w-[90%] rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6' : 'w-[90%]  rounded-md p-2 -mt-3 border-2 bg-gray-200 mb-6'}`} name='address' id='addresss' onBlur={forms.handleBlur} value={forms.values.address} onChange={forms.handleChange} />
          </div>
          <div className='flex justify-center'>
            <button type='submit' onClick={forms.handleSubmit} className='w-28 bg-slate-600 rounded-md text-white h-9 b'>Submit</button>
          </div>
        </Modal>

        {manageAdmin && <div className='w-full overflow-auto'>
          <DataTable
            columns={columns}
            data={manageAdmin}
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

export default ManageAdmin