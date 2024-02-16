import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import Loader from "../../utils/loadder";
import DataTable from "react-data-table-component";
import { getAllUsers } from "../../services/AdminServices";

const User = () => {
  const [userData, setUserData] = useState([]);
  const [loader, setLoader] = useState(false);

  const getUsers = async () => {
    setLoader(true);
    try {
      let data = await getAllUsers();
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

  const [filteredData, setFilteredData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const filterItem = (userData) => {
      return Object.values(userData).some((value) => {
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

    const filteredResult = userData.filter(filterItem);

    setFilteredData(filteredResult);
  }, [userData, searchTerm]);

  return (
    <>
      {loader ? <Loader data={loader} /> : null}
      <div className="w-full mx-auto">
        <div className="w-full h-20 flex sm:flex-row flex-col justify-between items-baseline">
          <input
            type="text"
            placeholder="Search users"
            className="h-9 bg-gray-200 p-4 rounded-md text-std"
            onChange={(event) => setSearchTerm(event.target.value)}
            value={searchTerm}
          />
        </div>

        {userData && (
          <div className="w-full overflow-auto">
            <DataTable
              columns={columns}
              data={filteredData}
              fixedHeader
              pagination
              bordered
              customStyles={customStyles}
              fixedHeaderScrollHeight="340px"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default User;
