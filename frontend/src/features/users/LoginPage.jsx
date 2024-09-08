import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../authentication";

import Header from "../../common/Header";

function LoginPage() {
  const navigate = useNavigate();
  const [authenticatedUser, login] = useAuthentication();
  const [statusMessage, setStatusMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const onLoginSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("Logging in...");

    if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/.test(formData.email)) {
      setStatusMessage("Invalid email address");
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      setStatusMessage("Login successful!");
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setStatusMessage("Email or password does not match.");
      } else {
        setStatusMessage("email or password does not match, please try again.")
      }  
    } 
  };

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center w-full h-screen p-4">
        <form
          className="flex flex-col max-w-sm w-full p-6 shadow-lg rounded-lg mt-4"
          onSubmit={onLoginSubmit}
        >
          <h2 className="text-3xl text-center mb-6">Login</h2>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="example@gmail.com"
              className="input input-bordered w-full"
              value={formData.email}
              onChange={(e) =>
                setFormData((existing) => ({
                  ...existing,
                  email: e.target.value,
                }))
              }
              required
            />
          </div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="******"
              className="input input-bordered w-full"
              value={formData.password}
              onChange={(e) =>
                setFormData((existing) => ({
                  ...existing,
                  password: e.target.value,
                }))
              }
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full mb-4">
            Login
          </button>
          <div className="text-center">
            <p className="text-sm">
              Not a member?{" "}
              <button
                className="btn btn-link"
                onClick={() => navigate("/register")}
              >
                Register here
              </button>
            </p>
          </div>
          {statusMessage && (
            <p className="text-red-500 text-center mt-4">{statusMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
