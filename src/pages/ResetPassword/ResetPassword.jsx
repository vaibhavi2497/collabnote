import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../services/firebase";
import { toast } from "react-toastify";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);

      toast.success("Reset email sent");
      console.log("Reset email requested for:", email);
    } catch (error) {
      console.error("ERROR:", error.code, error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div
            className={`card shadow p-4 ${
              darkMode ? "bg-dark text-light border-0" : ""
            }`}
          >
            <h2>Forgot Password</h2>

            <form onSubmit={handleResetPassword}>
              <input
                type="email"
                className="form-control mb-3"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button type="submit" className="btn btn-primary">
                Send Reset Link
              </button>

              <p className="mt-3 text-center">
                Remember your password?{" "}
                <span
                  style={{ cursor: "pointer", color: "blue" }}
                  onClick={() => navigate("/")}
                >
                  Login
                </span>
              </p>
            </form>
           
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;