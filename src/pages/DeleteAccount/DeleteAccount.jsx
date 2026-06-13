import { useState } from "react";
import { EmailAuthProvider, reauthenticateWithCredential, deleteUser,} from "firebase/auth";
import { auth } from "../../services/firebase";
import { toast } from "react-toastify";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

function DeleteAccount() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const currentUser = auth.currentUser;
  const { darkMode } = useTheme();

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);

      const password = prompt(
        "Enter your password to confirm account deletion"
      );

      if (!password?.trim()) {
        toast.error("Password is required");
        setLoading(false);
        return;
      }

      const user = auth.currentUser;

      if (!user) {
        toast.error("No user logged in");
        setLoading(false);
        return;
      }

      const credential = EmailAuthProvider.credential(
        user.email,
        password
      );

      await reauthenticateWithCredential(user, credential);
      await deleteUser(user);

      toast.success("Account deleted");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.log("Error:", error.code);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password"
      ) {
        toast.error("Incorrect password");
      } else {
        toast.error("Failed to delete account");
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
              <h3>Delete Account</h3>

              <p>
                Logged in as:{" "}
                <strong>{currentUser?.email}</strong>
              </p>

              <button
                className="btn btn-danger"
                onClick={handleDeleteAccount}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DeleteAccount;