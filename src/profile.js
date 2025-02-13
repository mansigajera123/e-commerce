import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/profile.css";
import Header from "./header";

export default function Profiler() {
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const response = await fetch(
          "https://believed-holder-univ-direction.trycloudflare.com/get-profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        alert("Failed to fetch profile data.");
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("You need to be logged in to update your profile.");
      return;
    }

    try {
      const response = await fetch(
        "https://believed-holder-univ-direction.trycloudflare.com/update-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profileData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      navigate("/profile");
      // alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleCancle = () => {
    navigate("/profile");
  };

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-form-card">
          <h2 className="profile-heading">Update Profile</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="profile-input"
              name="firstName"
              value={profileData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
            />
            <input
              type="text"
              className="profile-input"
              name="lastName"
              value={profileData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
            />
            <input
              type="tel"
              className="profile-input"
              name="phone"
              value={profileData.phone}
              onChange={handleInputChange}
              placeholder="Phone Number"
            />
            <input
              type="text"
              className="profile-input"
              name="address"
              value={profileData.address}
              onChange={handleInputChange}
              placeholder="Address"
            />
            <button type="submit" className="profile-submit-btn">
              Update Profile
            </button>
          </form>
          <button onClick={handleCancle}>Cancle</button>
        </div>
      </div>
    </>
  );
}
