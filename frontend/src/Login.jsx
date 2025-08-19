import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const [user_id, setuser_id] = useState("");
  const [passcode, setPasscode] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      toast.info("Already logged in");
      navigate("/"); // Redirect to home or dashboard
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, passcode }),
      });

      const data = await res.json();
      console.log(user_id);

      if (res.ok) {
        toast.success("Login Successful");
        localStorage.setItem("token", data.token); // save JWT
        window.location.replace("http://localhost:5173");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>user_id:</label>
          <input
            value={user_id}
            onChange={(e) => setuser_id(e.target.value)}
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
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
      <p>
        No account? <Link to="/signup">Sign Up</Link>
      </p>
      <ToastContainer theme="dark" />
    </div>
  );
};

export default Login;
