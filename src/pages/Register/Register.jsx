import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../services/firebase";
import { useTheme } from "../../context/ThemeContext";
import Button from "../../components/common/Button/Button";

export default function Register() {
  const navigate = useNavigate();

  const { darkMode } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
      });

      toast.success("Registration Successful");

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.log(error);

      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already registered");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email");
      } else if (error.code === "auth/weak-password") {
        toast.error("Weak password");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div
              className={`card shadow p-4 ${
                darkMode ? "bg-dark text-light border-0" : ""
              }`}
            >
              <h2 className="text-center mb-4">Register</h2>

              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

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

                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                />

                <Button
                  type="submit"
                  className="w-100"
                  size="md"
                  variant="primary"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </Button>
              </form>

              <p className="text-center mt-3">
                Already have account? <Link to="/">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}