import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import Loader from "../../utils/loadder";
import DataTable from "react-data-table-component";

const User = () => {
  const [userData, setUserData] = useState([]);
  const [loader, setLoader] = useState(false);

  const getUsers = async () => {
    setLoader(true);
    try {
      let data = await getPhotoGrapher();
      setUserData(data.data);
    } catch (error) {
      if (error.response.status == 401) {
        navigate("/");
      }
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    getUsers();
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
      name: <h1 className="text-lg text-gray-500">Phone Number</h1>,
      selector: (row) => row.contact,
    },
    {
      name: <h1 className="text-lg text-gray-500">email</h1>,
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

  return (
    <>
      {loader ? <Loader data={loader} /> : null}
      <div className="w-full mx-auto">
        <div className="w-full h-20 flex sm:flex-row flex-col justify-between items-baseline">
          <input
            type="text"
            placeholder="Search users"
            className="h-9 bg-gray-200 p-4 rounded-md"
          />
        </div>

        {userData && (
          <div className="w-full overflow-auto">
            <DataTable
              columns={columns}
              data={userData}
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

export default User;
