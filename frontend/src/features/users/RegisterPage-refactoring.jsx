
// src/pages/Register.js
import React from "react";
import UserInputForm from "./UserInputForm";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const handleRegister = async (formData) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        navigate("/login");
        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error("Error:", error);
      return { success: false, message: "Registration failed." };
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <UserInputForm
        onSubmit={handleRegister}
        formType="register"
      />
    </div>
  );
}
