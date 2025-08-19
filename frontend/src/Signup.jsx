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
      setMessage("Error connecting to server" + err);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>user_id:</label>
          <input
            value={user_id}
            onChange={(e) => setUser_id(e.target.value)}
            required
          />
        </div>
        <div>
          <label>passcode:</label>
          <input
            type="passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <p>{message}</p>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
