import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams();

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    fetch(
      `https://believed-holder-univ-direction.trycloudflare.com/reset-password/${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      }
    )
      .then((res) => res.json())
      .then((user) => {
        console.log(user);
        if (user.message === "Password reset successful") {
          alert("Password reset successfully. You can now log in.");
          navigate("/login");
        } else {
          alert("Error resetting password");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("An error occurred while resetting the password.");
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="password">New password:</label>
        <input
          type="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <label htmlFor="confirmPassword">Confirm New password:</label>
        <input
          type="password"
          name="confirmPassword"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Reset password</button>
      </form>
    </>
  );
}
