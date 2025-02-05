import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleClick = (e) => {
    e.preventDefault();

    fetch(`https://pink-places-build.loca.lt/forgot-password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));
  };

  return (
    <>
      <form onSubmit={handleClick}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">send reset link</button>
      </form>
    </>
  );
}
