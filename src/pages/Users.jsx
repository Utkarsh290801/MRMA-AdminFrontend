import React, { useState, useEffect } from "react";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Search,
  Sort,
  Inject,
  Toolbar,
  Filter,
} from "@syncfusion/ej2-react-grids";
import { Header } from "../components";

import { NavLink } from "react-router-dom";

const Users = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/user/all-userdata");
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUserData(data.users);
        setLoading(false);
        console.log("Fetched user data:", data.users);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const ActionButtonsTemplate = () => {
    return (
      <div>
        <button>Edit</button>
      </div>
    );
  };

  const UserRoleButton = ({ userRole }) => {
    let backgroundColor;
    switch (userRole) {
      case "employer":
        backgroundColor = "#e91e64";
        break;
      case "worker":
        backgroundColor = "#673AB8";
        break;
      case "contractor":
        backgroundColor = "#02897B";
        break;
      default:
        backgroundColor = "#6c757d";
        break;
    }

    return (
      <button
        type="button"
        style={{ background: backgroundColor }}
        className="text-white py-1 px-2 capitalize rounded-2xl text-md"
      >
        {userRole}
      </button>
    );
  };
  const AddressTemplate = ({ address }) => (
    <div>
      <p>{address.street}</p>
      <p>{address.city}</p>
      <p>
        {address.state}, {address.pincode}
      </p>
    </div>
  );
  const MobileVerificationState = ({ isMobileVerified }) => {
    const StatusBg = isMobileVerified ? "green" : "red";

    return (
      <div className="flex gap-2 items-center text-gray-700 capitalize">
        <div
          style={{
            backgroundColor: StatusBg,
            borderRadius: "50%",
            width: "12px",
            height: "12px",
          }}
        />
        <p>{isMobileVerified ? "Verified" : "Not Verified"}</p>
      </div>
    );
  };
  const ApprovedState = ({ isApproved }) => {
    const StatusBg = isApproved ? "green" : "red";

    return (
      <div className="flex gap-2 items-center text-gray-700 capitalize">
        <div
          style={{
            backgroundColor: StatusBg,
            borderRadius: "50%",
            width: "12px",
            height: "12px",
          }}
        />
        <p>{isApproved ? "Approved" : "Not Approved"}</p>
      </div>
    );
  };
  const loadingIndicator = { indicatorType: "Shimmer" }; // Loading indicator configuration

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
      <div className="flex justify-between items-center mb-4">
        <Header category="Page" title="Registered Users" />
        <NavLink
          to="/form"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add User
        </NavLink>
      </div>
      <GridComponent
        dataSource={userData}
        allowPaging
        allowSorting
        allowFiltering
        toolbar={["Search"]}
        width="auto"
        loadingIndicator={loadingIndicator} // Add loading indicator
      >
        <ColumnsDirective>
          <ColumnDirective
            field="userRole"
            headerText="Role"
            template={({ userRole }) => (
              <UserRoleButton userRole={userRole}></UserRoleButton>
            )}
            width="100"
          />
          <ColumnDirective field="name" headerText="Name" width="90" />
          <ColumnDirective
            field="mobileNumber"
            headerText="Mobile Number"
            width="100"
          />
          <ColumnDirective
            field="address"
            headerText="Address"
            allowFiltering={false}
            template={AddressTemplate}
            width="100"
          />
          <ColumnDirective
            field="address.city"
            headerText="City"
            allowFiltering={true}
            width="100"
          />
          <ColumnDirective
            field="isApproved"
            headerText="Login Approved"
            template={({ isApproved }) => (
              <ApprovedState isApproved={isApproved}></ApprovedState>
            )}
            width="100"
          />
          <ColumnDirective
            field="isMobileVerified"
            headerText="Verified"
            template={({ isMobileVerified }) => (
              <MobileVerificationState
                isMobileVerified={isMobileVerified}
              ></MobileVerificationState>
            )}
            width="100"
          />
          <ColumnDirective
            headerText="Actions"
            template={ActionButtonsTemplate}
            width="100"
          />
        </ColumnsDirective>
        <Inject services={[Page, Search, Toolbar, Filter, Sort]} />
      </GridComponent>
    </div>
  );
};

export default Users;
