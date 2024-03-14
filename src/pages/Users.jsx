import React, { useState, useEffect } from "react";
import styled from "styled-components"; // Import styled-components
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Search,
  Inject,
  Toolbar,
} from "@syncfusion/ej2-react-grids";
import { Header } from "../components";

const Users = () => {
  const [userData, setUserData] = useState([]); // State to store user data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to store error message

  useEffect(() => {
    // Function to fetch user data from the API
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/user/all-userdata"); // Make GET request to your API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json(); // Parse response body as JSON
        setUserData(data.users); // Update state with fetched user data
        setLoading(false); // Update loading status
        console.log("Fetched user data:", data.users);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.message); // Update error state
        setLoading(false); // Update loading status
      }
    };

    fetchUserData(); // Call the function to fetch user data when the component mounts
  }, []); // Empty dependency array ensures the effect runs only once

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  console.log("Render userData:", userData); // Log userData to ensure it's populated

  // Custom component to render the edit button
  const ActionButtonsTemplate = () => {
    return (
      <div>
        <button>Edit</button>
      </div>
    );
  };

  // Styled component for userRole
  // const UserRoleButton = styled.button`
  //   background-color: ${({ userRole }) =>
  //     userRole === "employer"
  //       ? "#007bff"
  //       : userRole === "contractor"
  //       ? "#28a745"
  //       : "#6c757d"};
  //   color: white;
  //   padding: 3px 10px;
  //   border: none;
  //   border-radius: 6px;
  //   cursor: pointer;
  //   transition: background-color 0.3s ease;

  //   &:hover {
  //     background-color: ${({ userRole }) =>
  //       userRole === "employer"
  //         ? "#0056b3"
  //         : userRole === "contractor"
  //         ? "#218838"
  //         : "#545b62"};
  //   }
  // `;
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

  const MobileVerficationState = ({ isMobileVerified }) => {
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

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Registered Users" />
      <GridComponent
        dataSource={userData}
        allowPaging
        allowSorting
        toolbar={["Search"]}
        width="auto"
      >
        {/* Render columns dynamically based on the userData */}
        <ColumnsDirective>
          <ColumnDirective
            field="userRole"
            headerText="Role"
            // template={({ userRole }) => (
            //   <UserRoleButton userRole={userRole}>{userRole}</UserRoleButton>
            // )}
            template={({ userRole }) => (
              <UserRoleButton userRole={userRole}></UserRoleButton>
            )}
          />
          <ColumnDirective field="name" headerText="Name" />
          <ColumnDirective field="mobileNumber" headerText="Mobile Number" />
          <ColumnDirective
            field="isMobileVerified"
            headerText="Verified"
            template={({ isMobileVerified }) => (
              <MobileVerficationState
                isMobileVerified={isMobileVerified}
              ></MobileVerficationState>
            )}
          />

          <ColumnDirective
            headerText="Actions"
            template={ActionButtonsTemplate}
          />
        </ColumnsDirective>
        <Inject services={[Page, Search, Toolbar]} />
      </GridComponent>
    </div>
  );
};

export default Users;
