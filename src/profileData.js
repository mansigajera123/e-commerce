import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./header";
import "./css/profileData.css";
import Swal from "sweetalert2";

export default function ProfileData() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const getUser = () => {
      const token = localStorage.getItem("authToken");
      fetch("https://believed-holder-univ-direction.trycloudflare.com/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((user) => {
          setUser(user);
        })
        .catch((err) => console.log(err));
    };
    getUser();
  }, []);

  const handleUploadClick = () => {
    Swal.fire({
      title: "Upload Profile Picture",
      input: "file",
      inputAttributes: {
        accept: "image/*",
      },
      showCancelButton: true,
      confirmButtonText: "Upload",
      preConfirm: (file) => {
        if (!file) {
          Swal.showValidationMessage("Please select a file");
          return false;
        }
        return file;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        uploadProfilePicture(result.value);
      }
    });
  };

  const uploadProfilePicture = (file) => {
    const formData = new FormData();
    formData.append("profilePicture", file);

    const token = localStorage.getItem("authToken");
    fetch(
      "https://believed-holder-univ-direction.trycloudflare.com/upload-profile-picture",
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setUser((prevUser) => ({
          ...prevUser,
          profilePicture: data.profilePicture,
        }));
        Swal.fire("Success", "Profile picture updated", "success");
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-card">
          <img
            src={
              user.profilePicture
                ? `https://believed-holder-univ-direction.trycloudflare.com${user.profilePicture}`
                : "https://static.vecteezy.com/system/resources/thumbnails/005/544/770/small/profile-icon-design-free-vector.jpg"
            }
            alt="User Avatar"
            className="profile-avatar"
            onClick={handleUploadClick}
          />
          <div className="profile-name">
            {user.firstName} {user.lastName}
          </div>

          {user.email && (
            <div className="profile-info">
              <span className="profile-label">Email:</span> {user.email}
            </div>
          )}
          {user.phone && (
            <div className="profile-info">
              <span className="profile-label">Phone:</span> {user.phone}
            </div>
          )}
          {user.address && (
            <div className="profile-info">
              <span className="profile-label">Address:</span> {user.address}
            </div>
          )}
        </div>

        <Link to="/update-profile" className="profile-link">
          Edit Profile
        </Link>
      </div>
    </>
  );
}
