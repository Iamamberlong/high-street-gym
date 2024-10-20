import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../authentication";
import * as Users from "../../api/users";
import { UserCircleIcon } from "@heroicons/react/solid";
import validator from "validator";
import PageLayout from "../../common/PageLayout";

export default function MyProfilePage() {
  const navigate = useNavigate();
  const [user, login, logout] = useAuthentication();
  const [userID, setUserID] = useState(null)
  console.log("user from useAuthentication: ", user)

  const [statusMessage, setStatusMessage] = useState("");
  const [initialData, setInitialData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    phone: "",
    unitNumber: "",
    streetNumber: "",
    streetType: "",
    streetName: "",
    suburb: "",
    postcode: "",
  });

  

  const streetTypes = [
    "Street",
    "Road",
    "Avenue",
    "Boulevard",
    "Court",
    "Crescent",
    "Drive",
    "Lane",
    "Parade",
    "Place",
    "Terrace",
    "Way",
    "Close",
    "Esplanade",
    "Square",
    "Highway",
    "Circuit",
    "Gardens",
    "Grove",
  ];

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    phone: "",
    unitNumber: "",
    streetNumber: "",
    streetName: "",
    suburb: "",
    postcode: "",
  });

  useEffect(() => {
    console.log("user in the useEffect: ", user)

    setUserID(user.userID)
    // Fetch the user profile data
    if (!user || !user.userID) {
      setStatusMessage("User is not defined.")
      return 
    }

    Users.getUserById(user.userID).then((profileData) => {
      const extractedAddress = extractAddressComponents(profileData.address);

      const initialProfileData = {
        ...profileData,
        ...extractedAddress,
      };

      setFormData(initialProfileData);
      setInitialData(initialProfileData); 
      setInitialPassword(profileData.password)// Set initial data for reset
    });
  }, [user.userID]);

  function extractAddressComponents(address) {
    let unitNumber = "";
    let streetNumber = "";
    let streetName = "";
    let streetType = "";
    let suburb = "";
    let postcode = "";

    if (address.startsWith("Unit")) {
      // If the address starts with "Unit", extract the unit number
      const unitMatch = address.match(/^Unit\s+(\d+),\s*/i);
      if (unitMatch) {
        unitNumber = unitMatch[1]; // Extract unit number
        address = address.replace(unitMatch[0], ""); // Remove "Unit 324, " from the address
      }
    }

    // Now, split the remaining address by commas
    const parts = address.split(",").map((part) => part.trim());

    if (parts.length >= 3) {
      // Extract street components
      const streetMatch = parts[0].match(/^(\d+)\s+([\w\s\-]+?)\s+(\w+)$/i);
      if (streetMatch) {
        streetNumber = streetMatch[1]; // Extract street number
        streetName = streetMatch[2]; // Extract street name
        streetType = streetMatch[3]; // Extract street type (e.g., Street, Road)
      }

      suburb = parts[1]; // Extract suburb
      postcode = parts[2]; // Extract postcode
    } else {
      console.error("Address format is invalid");
    }

    return {
      unitNumber,
      streetNumber,
      streetName,
      streetType,
      suburb,
      postcode,
    };
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    console.log("e.target", e.target)
    setFormData({ ...formData, [name]: value });
    // setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  }

  // function validateForm() {
  //   let valid = true;
  //   const newErrors = {};

  //   if (!validator.isEmail(formData.email)) {
  //     newErrors.email = "Invalid email format.";
  //     valid = false;
  //   }

  //   if (
  //     !validator.isAlpha(formData.firstname) ||
  //     !validator.isLength(formData.firstname, { min: 2 })
  //   ) {
  //     newErrors.firstname = "First name must be at least 2 letters long.";
  //     valid = false;
  //   }

  //   if (
  //     !validator.isAlpha(formData.lastname) ||
  //     !validator.isLength(formData.lastname, { min: 2 })
  //   ) {
  //     newErrors.lastname = "Last name must be at least 2 letters long.";
  //     valid = false;
  //   }

  //   if (
  //     !validator.isMobilePhone(formData.phone, "any", {
  //       strictMode: false,
  //     })
  //   ) {
  //     newErrors.phone = "Invalid phone number format.";
  //     valid = false;
  //   }

  //   if (formData.unitNumber != null && formData.unitNumber !== "") {
  //     const unitNumberStr = String(formData.unitNumber).trim();
  //     valid = false;

  //     if (!validator.isNumeric(unitNumberStr, { no_symbols: true })) {
  //       newErrors.unitNumber = "Unit number has to be a number or null.";
  //       valid = false;
  //     }
  //   }

  //   if (!validator.isNumeric(streetNumber, { no_symbols: true })) {
  //     newErrors.streetNumber = "Street number has to be a number.";
  //     valid = false;
  //   }

  //   if (
  //     !validator.isAlpha(formData.streetName) ||
  //     !validator.isLength(formData.streetName, { min: 2 })
  //   ) {
  //     newErrors.firstname = "Street name must be at least 2 letters long.";
  //     valid = false;
  //   }

  //   if (
  //     !validator.isAlpha(formData.suburb) ||
  //     !validator.isLength(formData.suburb, { min: 2 })
  //   ) {
  //     newErrors.suburb = "Suburb must be at least 2 letters long.";
  //     valid = false;
  //   }

  //   if (
  //     !validator.isLength(formData.postcode, { min: 4, max: 4 }) ||
  //     !validator.isNumeric(formData.postcode)
  //   ) {
  //     newErrors.postcode = "Postcode must be a 4-digit number.";
  //     valid = false;
  //   }
  //   console.log("newErrors are: ", newErrors)
  //   setErrors(newErrors);
  //   return newErrors;
  // }

  function validateForm() {
    let valid = true;
    const newErrors = {};

    if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
      console.log("newErrors.email: ", newErrors.email);
      valid = false;
    }

    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters long";
        valid = false;
    }
    
    }

    if (!/^[a-zA-Z\s\-]+$/.test(formData.firstname)) {
      newErrors.firstname = "First Name can only have letters.";
      valid = false;
    }

    if (!/^[a-zA-Z\s\-]+$/.test(formData.lastname)) {
      newErrors.lastname = "Last Name can only have letters.";
      valid = false;
    }

    if (!/^04\d{8}$/.test(formData.phone)) {
      newErrors.phone =
        "Phone number must start with '04' and be 10 digits long";
      console.log("Is valid: ", /^04\d{8}$/.test(formData.phone));
      valid = false;
    }

    if (formData.unitNumber && !/^\d+$/.test(formData.unitNumber)) {
      newErrors.unitNumber = "Invalid unit number";
      valid = false;
    }

    if (!formData.streetNumber) {
      newErrors.streetNumber = "Street number is required";
      valid = false;
    } else if (!/^\d+$/.test(formData.streetNumber)) {
      newErrors.streetNumber = "Street number must be a valid number";
      valid = false;
    }

    if (!/^[a-zA-Z\s\-]+$/.test(formData.streetName)) {
      newErrors.streetName = "Street Name must be letters.";
      valid = false;
    }

    if (!/^[a-zA-Z\s\-]+$/.test(formData.suburb)) {
      newErrors.suburb = "Suburb names can only be letters or space!";
      valid = false;
    }

    if (!/^\d{4}$/.test(formData.postcode)) {
      newErrors.postcode = "Postcode must be exactly 4 digits";
      valid = false;
    }

    console.log("Validation errors: ", newErrors);

    setErrors(newErrors);
    return valid;
  }

  function handleSave(e) {
    e.preventDefault();
    setStatusMessage("");

    console.log("userID is: ", userID)

    if (!validateForm()) {
      setStatusMessage("Please correct the errors above");
      return;
    }  

    setStatusMessage("Updating...");

    const updatedProfileData = {
      ...formData,
      address: `${formData.unitNumber ? `Unit ${formData.unitNumber}/, ` : ""}${
        formData.streetNumber
      } ${formData.streetName} ${formData.streetType}, ${formData.suburb}, ${
        formData.postcode
      }`,
    };

    if (formData.password) {
      updatedProfileData.password = formData.password
    }

    console.log("userID above update function is: ", userID)
    Users.update(updatedProfileData, userID)
      .then((result) => {
        console.log("Update result:", result);
        if (result.status === 200) {
          setStatusMessage("Profile updated successfully.");
          setIsSuccess(true);
          setInitialData(updatedProfileData); // Update initial data after save
          setIsEditing(false);
        } else if (result.error && result.error.includes("email")) {
          setStatusMessage("Email must be unique.");
          setIsSuccess(false);
        } else {
          setStatusMessage("Failed to update profile.");
          setIsSuccess(false);
        }
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        console.log("err: ", err)
        setStatusMessage(err.error);
        setIsSuccess(false);
      });
  }

  function handleCancel() {
    // Reset to initial data
    setFormData(initialData);
    setStatusMessage("");
    setIsEditing(false);
  }

  useEffect(() => {
    let timer;
    if (statusMessage) {
      timer = setTimeout(() => {
        setStatusMessage("");
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [statusMessage]);

  return (
    <PageLayout>
      <div className="flex items-center justify-center min-h-screen bg-slate-100 bg-gradient-to-br">
        <div className="p-10 rounded-lg shadow-2xl max-w-md w-full">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            My Profile
          </h1>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-base text-gray-800">Email</span>
              </label>
              <input
                type="text"
                name="email"
                pattern="^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$"
                title="Invalid email format."
                className="input input-bordered w-full border-md bg-white"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              {errors.email && (
                <span className="text-red-500 text-xs">{errors.email}</span>
              )}
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-base text-gray-800">Password</span>
              </label>
              <input
                type="password"
                name="password"
                className="input input-bordered w-full border-md bg-white"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}
            </div>

            <div className="form-control w-full ">
              <label className="label">
                <span className="label-text text-base text-gray-800">First Name</span>
              </label>
              <input
                type="text"
                name="firstname"
                className="input input-bordered w-full border-md bg-white"
                value={formData.firstname}
                onChange={handleInputChange}
                required
              />
              {errors.firstname && (
                <p className="text-red-500 text-xs">{errors.firstname}</p>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-base text-gray-800">Last Name</span>
              </label>
              <input
                type="text"
                name="lastname"
                // className="input input-bordered w-full"
                className="input input-bordered w-full border-md bg-white"
                value={formData.lastname}
                onChange={handleInputChange}
                required
              />
              {errors.lastname && (
                <p className="text-red-500 text-xs">{errors.lastname}</p>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-base text-gray-800">Phone Number</span>
              </label>
              <input
                type="text"
                name="phone"
                className="input input-bordered w-full border-md bg-white"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone}</p>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-base text-gray-800">Unit Number</span>
              </label>
              <input
                type="text"
                name="unitNumber"
                className="input input-bordered w-full border-md bg-white"
                value={formData.unitNumber}
                onChange={handleInputChange}
              />
              {errors.unitNumber && (
                <p className="text-red-500 text-xs">{errors.unitNumber}</p>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-base text-gray-800">Street Number</span>
              </label>
              <input
                type="text"
                name="streetNumber"
                className="input input-bordered w-full border-md bg-white"
                value={formData.streetNumber}
                onChange={handleInputChange}
              />
              {errors.streetNumber && (
                <p className="text-red-500 text-xs">{errors.streetNumber}</p>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-base text-gray-800">Street Name</span>
              </label>
              <input
                type="text"
                name="streetName"
                className="input input-bordered w-full border-md bg-white"
                value={formData.streetName}
                onChange={handleInputChange}
              />
              {errors.streetName && (
                <p className="text-red-500 text-xs">{errors.streetName}</p>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-base text-gray-800">Street Type</span>
              </label>
              <select
                className="select select-bordered w-full border-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.streetType}
                onChange={(e) =>
                  setFormData({ ...formData, streetType: e.target.value })
                }
              >
                <option value="">Select Street Type</option>
                {streetTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-base text-gray-800">Suburb</span>
              </label>
              <input
                type="text"
                name="suburb"
                className="input input-bordered w-full border-md bg-white"
                value={formData.suburb}
                onChange={handleInputChange}
              />
              {errors.suburb && (
                <p className="text-red-500 text-xs">{errors.suburb}</p>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-base text-gray-800">Post Code</span>
              </label>
              <input
                type="text"
                name="postcode"
                className="input input-bordered w-full border-md bg-white"
                value={formData.postcode}
                onChange={handleInputChange}
              />
              {errors.postcode && (
                <p className="text-red-500 text-xs">{errors.postcode}</p>
              )}
            </div>

            <div className="mt-6 flex justify-between">
              <button type="submit" className="btn btn-primary w-1/2 mr-2 mt-8 bg-blue-500 text-base text-white">
                Save
              </button>
              <button
                type="button"
                className="btn btn-secondary w-1/2 mt-8 bg-violet-400 border-0 text-base text-white"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
            {statusMessage && (
              <div
                className={`mt-4 text-center ${
                  isSuccess ? "text-green-500" : "text-red-500"
                } text-sm font-semibold`}
              >
                {statusMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    </PageLayout>
  );
}
