import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./header";
import "./css/login.css";

export default function Login() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    document.title = "Login";
  }, []);

  const navigate = useNavigate();

  const dataHandler = (identifier, value) => {
    setUserData((prevState) => {
      return {
        ...prevState,
        [identifier]: value,
      };
    });
  };

  const login = (e) => {
    e.preventDefault();
    fetch(`https://believed-holder-univ-direction.trycloudflare.com/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((res) => res.json())
      .then((user) => {
        if (user.token) {
          console.log(user.token);
          localStorage.setItem("authToken", user.token);
          localStorage.setItem("email", user.user.email);
          setUserData({ email: "", password: "" });
          navigate("/allproduct");
        } else {
          alert("Invalid login");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Header />
      <form className="login-form" onSubmit={login}>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          type="email"
          name="email"
          className="input"
          onChange={(e) => dataHandler("email", e.target.value)}
          required
        />
        <label htmlFor="password" className="label">
          Password
        </label>
        <input
          type="password"
          name="password"
          className="input"
          onChange={(e) => dataHandler("password", e.target.value)}
          required
        />
        <button type="submit" className="submit-button">
          Login
        </button>
        <br />
        <br />
        Don't have an Account? <Link to="/signup">Sign Up</Link>
      </form>
    </>
  );
}
