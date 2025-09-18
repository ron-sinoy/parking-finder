import "./login.css";
import { Link } from "react-router-dom";
import { useState } from "react";

const Signup = () => {
  const [user_id, setUser_id] = useState("");
  const [passcode, setPasscode] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, passcode }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Signup successful! You can now login.");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Error connecting to server: " + err);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <div>
          <label>User ID:</label>
          <input
            value={user_id}
            onChange={(e) => setUser_id(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>

        {/* Login link styled same as Sign Up link in Login page */}
        <Link to="/login" className="signup-link">
          <button type="button">Login</button>
        </Link>
      </form>

      <p style={{ color: "#fefefe", marginTop: "10px" }}>{message}</p>
    </div>
  );
};

export default Signup;
