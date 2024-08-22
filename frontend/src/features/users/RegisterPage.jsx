import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../authentication";
import * as Users from "../../api/users";
import Header from "../../common/Header";
import Footer from "../../common/Footer";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [user, login, logout] = useAuthentication();
  const [statusMessage, setStatusMessage] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    unitNumber: "",
    streetNumber: "",
    streetType: "Street",
    streetName: "",
    suburb: "",
    postcode: "",
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    unitNumber: "",
    streetNumber: "",
    streetType: "Street",
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

  function validateForm() {
    let valid = true;
    const newErrors = {};

    if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
      valid = false;
    }

    if (!/^[a-zA-Z\s\-]+$/.test(formData.firstName)) {
      newErrors.firstName = "Invalid first name";
      valid = false;
    }

    if (!/^[a-zA-Z\s\-]+$/.test(formData.lastName)) {
      newErrors.lastName = "Invalid last name";
      valid = false;
    }

    if (!/^04\d{8}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber =
        "Phone number must start with '04' and be 10 digits long";
      valid = false;
    }

    if (formData.unitNumber && !/^\d+$/.test(formData.unitNumber)) {
      newErrors.unitNumber = "Invalid unit number";
      valid = false;
    }

    if (!/^\d+$/.test(formData.streetNumber)) {
      newErrors.streetNumber = "Invalid street number";
      valid = false;
    }

    if (!/^[a-zA-Z\s\-]+$/.test(formData.streetName)) {
      newErrors.streetName = "Invalid street name";
      valid = false;
    }

    if (!/^[a-zA-Z\s\-]+$/.test(formData.suburb)) {
      newErrors.suburb = "Invalid suburb";
      valid = false;
    }

    if (!/^\d{4}$/.test(formData.postcode)) {
      newErrors.postcode = "Postcode must be exactly 4 digits";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  function onRegisterSubmit(e) {
    e.preventDefault();
    setStatusMessage("");

    if (!validateForm()) {
      setStatusMessage("Please correct the errors above");
      return;
    }

    setStatusMessage("Registering...");

    // Register then attempt login
    Users.registerUser(formData).then((result) => {
      setStatusMessage(result.message);
      login(formData.email, formData.password)
        .then((result) => {
          setStatusMessage(result.message);
          navigate("/");
        })
        .catch((error) => {
          setStatusMessage("Login failed: " + error);
        });
    });
  }

  return (
    <div>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
        <div className="bg-white p-10 rounded-lg shadow-2xl max-w-md w-full">
          <h1 className="text-3xl font-extrabold text-center text-blue-800 mb-6">
            Register
          </h1>
          <form onSubmit={onRegisterSubmit} className="space-y-5">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter your first name"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter your last name"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Phone Number</span>
              </label>
              <input
                type="text"
                placeholder="Enter your phone number"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Unit Number</span>
              </label>
              <input
                type="text"
                placeholder="Enter your unit number"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.unitNumber}
                onChange={(e) =>
                  setFormData({ ...formData, unitNumber: e.target.value })
                }
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Street Number</span>
              </label>
              <input
                type="text"
                placeholder="Enter your street number"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.streetNumber}
                onChange={(e) =>
                  setFormData({ ...formData, streetNumber: e.target.value })
                }
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Street Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter your street name"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.streetName}
                onChange={(e) =>
                  setFormData({ ...formData, streetName: e.target.value })
                }
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Street Type</span>
              </label>
              <select
                className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.streetType}
                onChange={(e) => setFormData({ ...formData, streetType: e.target.value })}
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
                <span className="label-text">Suburb</span>
              </label>
              <input
                type="text"
                placeholder="Enter your suburb"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.suburb}
                onChange={(e) =>
                  setFormData({ ...formData, suburb: e.target.value })
                }
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Postcode</span>
              </label>
              <input
                type="text"
                placeholder="Enter your postcode"
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.postcode}
                onChange={(e) =>
                  setFormData({ ...formData, postcode: e.target.value })
                }
              />
            </div>
            <div className="mt-6">
              <button type="submit" className="btn btn-primary w-full">
                Register
              </button>
            </div>
            {statusMessage && (
              <div className="mt-4 text-center text-red-500">
                {statusMessage}
              </div>
            )}
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already a member?{" "}
              <button
                className="text-blue-600 hover:underline"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
