import React, { useEffect, useState } from "react";
import UserInputForm from "./UserInputForm";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../authentication";
import * as Users from "../../api/users";
import PageLayout from "../../common/PageLayout";

export default function MyProfilePage() {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const [user, login, logout] = useAuthentication();
  const [statusMessage, setStatusMessage] = useState("");
  const [initialData, setInitialData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    unitNumber: "",
    streetNumber: "",
    streetType: "",
    streetName: "",
    suburb: "",
    postcode: "",
  });

  const [errors, setErrors] = useState({})
  useEffect(() => {
    // Fetch user profile data
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/profile");
        const result = await response.json();
        if (result.success) {
          setUserData(result.data);
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileUpdate = async (formData) => {
    try {
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        setUserData(formData); // Update local state with new data
        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error("Error:", error);
      return { success: false, message: "Profile update failed." };
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <UserInputForm
        initialData={userData}
        onSubmit={handleProfileUpdate}
        onCancel={() => navigate("/")}
        formType="profile"
      />
    </div>
  );
}
