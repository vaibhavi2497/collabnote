import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../../services/authService";
import { useTheme } from "../../context/ThemeContext";
import Button from "../../components/common/Button/Button";

export default function Login() {
  const navigate = useNavigate();

  const { darkMode, setDarkMode } = useTheme();

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const user = await loginUser(email, password);

      console.log(user);

      toast.success("Login Successful");

      setTimeout(() => {
        navigate("/home");
      }, 1500);

    } catch (error) {
      console.log(error);
      toast.error("Invalid Email or Password");
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="container mt-5"
        style={{
          background: darkMode ? "#0f172a" : "#f8fafc",
          color: darkMode ? "#f8fafc" : "#0f172a",
          minHeight: "100vh",
        }}
      >
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div
              className="card shadow p-4"
              style={{
                background: darkMode ? "#1e293b" : "#ffffff",
                color: darkMode ? "#f8fafc" : "#0f172a",
                border: darkMode
                  ? "1px solid #334155"
                  : "1px solid #e2e8f0",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Login</h2>

                <button className="btn btn-secondary" onClick={toggleTheme}>
                  {darkMode ? "☀️ Light" : "🌙 Dark"}
                </button>
              </div>

              <form onSubmit={handleLogin}>
                <input
                  type="email"
                  className="form-control mb-3"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? "Logging..." : "Login"}
                </Button>
              </form>

              <Link to="/reset-password">Forgot Password?</Link>

              <p className="text-center mt-3">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      
    </>
  );
}