import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import "./signup.css"; // Make sure to import the CSS file

export default function SignUp() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    confirmpassword: "",
  });

  const [errors, setErrors] = useState("");
  const navigate = useNavigate();

  const dataHandler = (identifier, value) => {
    setUserData((prevState) => {
      return {
        ...prevState,
        [identifier]: value,
      };
    });
  };

  const signUp = (e) => {
    e.preventDefault();
    fetch(`https://pink-places-build.loca.lt/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message == "Email is already in use") {
          setErrors("Email is exists");
        } else if (!data.errors) {
          alert("Signup successful");
          setUserData({
            email: "",
            password: "",
            confirmpassword: "",
          });
          navigate("/login");
        }
        if (data.errors) {
          setErrors(data.errors);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Header />
      <div className="signup-container">
        <form onSubmit={signUp} className="signup-form">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            onChange={(e) => dataHandler("email", e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            onChange={(e) => dataHandler("password", e.target.value)}
            required
          />
          <label htmlFor="confirmpassword">Confirm Password</label>
          <input
            type="password"
            name="confirmpassword"
            onChange={(e) => dataHandler("confirmpassword", e.target.value)}
            required
          />
          {errors && (
            <p className="error" style={{ color: "red" }}>
              {errors}
            </p>
          )}
          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>
      </div>
    </>
  );
}
