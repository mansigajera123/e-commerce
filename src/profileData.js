import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./header";
import "./css/profileData.css";

export default function ProfileData() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const getUser = () => {
      const token = localStorage.getItem("authToken");
      fetch("https://outside-friend-jump-convicted.trycloudflare.com/user", {
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

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-card">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/005/544/770/small/profile-icon-design-free-vector.jpg"
            alt="User Avatar"
            className="profile-avatar"
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
