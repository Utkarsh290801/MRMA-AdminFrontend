import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Swal from "sweetalert2";

const EditForm = () => {
  const { _id } = useParams(); // Get the ID parameter from the URL
  console.log("_id:", _id);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("_id:", _id);
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/user/user-data/${_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUserData(data.user);
        console.log("Fetched user data:", data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle error
      }
    };

    fetchUserData();
  }, [_id]);
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch(
        `http://localhost:5000/user/update/${_id}`, // Send PUT request to update user
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values), // Send updated user data in the request body
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      const data = await response.json();
      console.log("User updated successfully:", data);
      // Redirect to a success page or navigate to another route
      Swal.fire({
        icon: "success",
        title: "User updated successfully",
      });
      navigate("/user");
    } catch (error) {
      console.error("Error updating user:", error);
      // Handle error
    } finally {
      setSubmitting(false);
    }
  };
  if (!userData) {
    return <div>Loading...</div>;
  }
  const handleSubmitConfirmation = (values, { setSubmitting }) => {
    Swal.fire({
      title: "Confirm Update",
      text: "Are you sure you want to update this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmit(values, { setSubmitting });
      }
    });
  };
  return (
    <Formik
      initialValues={{
        name: userData.name,
        dob: userData.dob
          ? new Date(userData.dob).toISOString().split("T")[0]
          : "",
        company: userData.company,
        mobileNumber: userData.mobileNumber,
        address: {
          street: userData.address.street,
          city: userData.address.city,
          pincode: userData.address.pincode,
          state: userData.address.state,
        },
        gender: userData.gender,
        email: userData.email,
        userRole: userData.userRole,
        photo: "",
        aadharCard: "",
        laborCard: "",
        categoriesOfWork: userData.categoriesOfWork,
      }}
      onSubmit={handleSubmitConfirmation}
    >
      {({ isSubmitting, values, setFieldValue, resetForm }) => (
        <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold mb-4 mt-5">
              Personal Information
            </h2>
            <NavLink to={`/user`} className="mt-9 border-color">
              Close
            </NavLink>
          </div>

          <div className="mb-4">
            <label
              htmlFor="userRole"
              className="block text-sm font-bold text-gray-700"
            >
              User Role
            </label>
            <Field
              as="select"
              name="userRole"
              onChange={(e) => {
                setFieldValue("userRole", e.target.value);
                // Clear fields if not worker or contractor
                if (
                  e.target.value !== "worker" &&
                  e.target.value !== "contractor"
                ) {
                  setFieldValue("photo", "");
                  setFieldValue("aadharCard", "");
                  setFieldValue("laborCard", "");
                  setFieldValue("categoriesOfWork", []);
                }
              }}
              className="block w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-indigo-500"
            >
              <option value="">Select User Role</option>
              <option value="employer">Employer</option>
              <option value="contractor">Contractor</option>
              <option value="worker">Worker</option>
            </Field>
            <ErrorMessage
              name="userRole"
              component="div"
              className="text-red-500 text-xs italic"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-bold text-gray-700"
              >
                Name
              </label>
              <Field
                type="text"
                name="name"
                className="form-input block w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-indigo-500"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-xs italic"
              />
            </div>
            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-bold text-gray-700"
              >
                Date of Birth
              </label>
              <Field
                type="date"
                name="dob"
                className="form-input block w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-indigo-500"
              />
              <ErrorMessage
                name="dob"
                component="div"
                className="text-red-500 text-xs italic"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-bold text-gray-700"
              >
                Gender
              </label>
              <Field
                as="select"
                name="gender"
                className="form-input block w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-indigo-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Field>
              <ErrorMessage
                name="gender"
                component="div"
                className="text-red-500 text-xs italic"
              />
            </div>
            <div>
              <label
                htmlFor="mobileNumber"
                className="block text-sm font-bold text-gray-700"
              >
                Mobile Number
              </label>
              <Field
                type="text"
                name="mobileNumber"
                className="form-input block w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-indigo-500"
                disabled={values.userRole}
              />
              <ErrorMessage
                name="mobileNumber"
                component="div"
                className="text-red-500 text-xs italic"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="address.street"
                className="block text-sm font-bold text-gray-700"
              >
                Street
              </label>
              <Field
                type="text"
                name="address.street"
                className="form-input block w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-indigo-500"
                placeholder="Enter street"
              />
              <ErrorMessage
                name="address.street"
                component="div"
                className="text-red-500 text-xs italic"
              />
            </div>

            <div>
              <label
                htmlFor="address.city"
                className="block text-sm font-bold text-gray-700"
              >
                City
              </label>
              <Field
                type="text"
                name="address.city"
                className="form-input block w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-indigo-500"
                placeholder="Enter city"
              />
              <ErrorMessage
                name="address.city"
                component="div"
                className="text-red-500 text-xs italic"
              />
            </div>
            <div>
              <label
                htmlFor="address.state"
                className="block text-sm font-bold text-gray-700"
              >
                State
              </label>
              <Field
                type="text"
                name="address.state"
                className="form-input block w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-indigo-500"
                placeholder="Enter state"
              />
              <ErrorMessage
                name="address.state"
                component="div"
                className="text-red-500 text-xs italic"
              />
            </div>
            <div>
              <label
                htmlFor="address.pincode"
                className="block text-sm font-bold text-gray-700"
              >
                Pincode
              </label>
              <Field
                type="text"
                name="address.pincode"
                className="form-input block w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-indigo-500"
                placeholder="Enter Pincode"
              />
              <ErrorMessage
                name="address.pincode"
                component="div"
                className="text-red-500 text-xs italic"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {" "}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-gray-700"
              >
                Email
              </label>
              <Field
                type="email"
                name="email"
                id="email"
                className="block w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-indigo-500"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-xs italic"
              />
            </div>
            <div className="">
              <label
                htmlFor="company"
                className="block text-sm font-bold text-gray-700"
              >
                Company
              </label>
              <Field
                type="text"
                name="company"
                id="company"
                className="block w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-indigo-500"
              />
              <ErrorMessage
                name="company"
                component="div"
                className="text-red-500 text-xs italic"
              />
            </div>
          </div>
          {values.userRole === "worker" || values.userRole === "contractor" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="photo"
                  className="block text-sm font-bold text-gray-700"
                >
                  Photo
                </label>
                <Field
                  type="file"
                  name="photo"
                  className="block w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-indigo-500"
                />
                <ErrorMessage
                  name="photo"
                  component="div"
                  className="text-red-500 text-xs italic"
                />
              </div>
              {/* Aadhar Card */}
              <div>
                <label
                  htmlFor="aadharCard"
                  className="block text-sm font-bold text-gray-700"
                >
                  Aadhar Card
                </label>
                <Field
                  type="file"
                  name="aadharCard"
                  className="block w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-indigo-500"
                />
                <ErrorMessage
                  name="aadharCard"
                  component="div"
                  className="text-red-500 text-xs italic"
                />
              </div>
              {/* Labor Card */}
              <div>
                <label
                  htmlFor="laborCard"
                  className="block text-sm font-bold text-gray-700"
                >
                  Labor Card
                </label>
                <Field
                  type="file"
                  name="laborCard"
                  className="block w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-indigo-500"
                />
                <ErrorMessage
                  name="laborCard"
                  component="div"
                  className="text-red-500 text-xs italic"
                />
              </div>
              {/* Categories of Work */}
              <div>
                <label
                  htmlFor="categoriesOfWork"
                  className="block text-sm font-bold text-gray-700"
                >
                  Categories of Work
                </label>
                <Field
                  type="text"
                  name="categoriesOfWork"
                  className="block w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-indigo-500 mt-1"
                />
                <ErrorMessage
                  name="categoriesOfWork"
                  component="div"
                  className="text-red-500 text-xs italic"
                />
              </div>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 mt-6 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
          >
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default EditForm;
