import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const [user_id, setuser_id] = useState("");
  const [passcode, setPasscode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      toast.info("Already logged in");
      navigate("/");
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

      if (res.ok) {
        toast.success("Login Successful");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", user_id);
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
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <div>
            <label>User ID:</label>
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

          <Link to="/signup" className="signup-link">
            <button type="button" className="signup">
              Sign Up
            </button>
          </Link>
        </form>

        <ToastContainer theme="dark" />
      </div>
    </div>
  );
};

export default Login;
