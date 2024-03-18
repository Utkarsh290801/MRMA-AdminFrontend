import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
const RegistrationSchema = Yup.object().shape({
  userRole: Yup.string().required("User role is required"),
  name: Yup.string().required("Name is required"),
  dob: Yup.date().required("DOB is required"),
  gender: Yup.string().required("Gender is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  address: Yup.object().shape({
    street: Yup.string().required("Street is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    pincode: Yup.string().required("Pincode is required"),
  }),
  mobileNumber: Yup.string()
    .required("Mobile number is required")
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
});

const FormComponent = () => {
  const [showOTPField, setShowOTPField] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch("http://localhost:5000/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      console.log(data.message);

      if (response.ok) {
        console.log("Form reset successfully");
        setShowOTPField(true);
        setMobileNumber(values.mobileNumber);
        Swal.fire({
          icon: "success",
          title: "Well Done",
          text: "OTP sent to the provided mobile number for verification",
        });
      } else {
        console.error("Error registering user:", data.message);
        Swal.fire({
          icon: "error",
          title: "Oops!!",
          text: "Something went wrong! Please try again.",
        });
      }
    } catch (error) {
      console.error("Error registering user:", error);
      Swal.fire({
        icon: "error",
        title: "Oops!!",
        text: "Something went wrong! Please try again.",
      });
    }
    setSubmitting(false);
  };
  const handleOTPVerification = async (otp, resetForm) => {
    try {
      const response = await fetch("http://localhost:5000/user/verify-mobile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobileNumber,
          verificationCode: otp,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsMobileVerified(true);
        // Handle success, e.g., redirect the user or show a success message
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: data.message,
        });
        resetForm();
      } else {
        // Handle error response
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: data.error || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong. Please try again.",
      });
    }
  };
  return (
    <div>
      <Formik
        initialValues={{
          name: "",
          dob: "",
          company: "",
          mobileNumber: "",
          address: {
            street: "",
            city: "",
            pincode: "",
            state: "",
          },
          gender: "",
          email: "",
          userRole: "",
          photo: "",
          aadharCard: "",
          laborCard: "",
          categoriesOfWork: [],
        }}
        validationSchema={RegistrationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue, resetForm }) => (
          <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-xl font-bold mb-4 mt-5">
              Personal Information
            </h2>

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
            {values.userRole === "worker" ||
            values.userRole === "contractor" ? (
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
            {showOTPField && !isMobileVerified && (
              <div className="mb-4 mt-7">
                <label
                  htmlFor="otp"
                  className="block text-xl font-bold text-gray-700"
                >
                  Enter OTP
                </label>
                <div className="flex items-center">
                  <Field
                    type="text"
                    name="otp"
                    maxLength="4"
                    pattern="[0-9]*"
                    className="form-input flex-grow w-full px-4 py-2 leading-tight text-xl text-center text-gray-700 bg-gray-200 border border-gray-200 rounded-l appearance-none focus:outline-none focus:bg-white focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
                    onClick={() => handleOTPVerification(values.otp, resetForm)}
                  >
                    Verify
                  </button>
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormComponent;
