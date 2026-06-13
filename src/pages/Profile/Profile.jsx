import React, { useState, useEffect, useRef } from "react";

import { useTheme } from "../../context/ThemeContext";

import { getAuth, signOut,} from "firebase/auth";

import { collection, query, where, onSnapshot,} from "firebase/firestore";

import { db } from "../../services/firebase";

import { useNavigate,} from "react-router-dom";

import { toast } from "react-toastify";

import Loader from "../../components/common/Loader/Loader";

export default function Profile() {

  const auth = getAuth();

  const user =
    auth.currentUser;

  const navigate =
    useNavigate();


  const { darkMode } = useTheme();

  const [notes, setNotes] =
    useState([]);


  const [profilePhoto, setProfilePhoto] = useState(
    localStorage.getItem(`profilePhoto_${user?.uid}`) || ""
  );
  const fileInputRef = useRef(null);

  // =========================
  // REALTIME NOTES
  // =========================

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notes"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNotes(notesData);
    });

    return () => unsubscribe();
  }, [user]);

  // =========================
  // STATS
  // =========================

  const favoriteNotes =
    notes.filter(
      (note) =>
        note.favorite
    ).length;

  const pinnedNotes =
    notes.filter(
      (note) =>
        note.pinned
    ).length;

  const archiveNotes =
    notes.filter(
      (note) =>
        note.archived
    ).length;

  // =========================
  // LOGOUT
  // =========================

  const handleLogout =
    async () => {

      try {

        await signOut(
          auth
        );

        toast.success(
          "Logout Successful"
        );

        navigate(
          "/login"
        );

      }

      catch (error) {

        console.log(
          error
        );

        toast.error(
          "Logout Failed"
        );

      }

    };



  
 
  // =========================
  // LOADING
  // =========================

  
  

if (!user) {
  return <Loader text="Loading Profile.." />;
}

  // =========================
  // RETURN
  // =========================

  return (

    <div

      className="container-fluid py-5"
      style={{
        background: darkMode ? "#0f172a" : "#f8fafc",
        color: darkMode ? "#f8fafc" : "#0f172a",
        minHeight: "100vh",
        transition: "0.3s",
      }}

    >

      <div className="row justify-content-center">

        <div className="col-lg-7 col-md-9">

          <div className="card border-0 shadow-lg p-4 p-md-5"
            style={{
              background: darkMode ? "#1e293b" : "#ffffff",
              color: darkMode ? "#f8fafc" : "#0f172a",
              borderRadius: "25px",
            }}  >

            {/* PROFILE */}

            <div className="text-center mb-4">

              <img

                src={
                  profilePhoto ||

                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }

                alt="profile"

                width="120"

                height="120"

                style={{

                  borderRadius: "50%",

                  objectFit: "cover",

                  border:
                    "4px solid #0d6efd",

                }}

              />

              <h2 className="fw-bold mt-3">

                {

                  user.displayName ||

                  user.email?.split("@")[0]

                }

              </h2>

              <p
                className="mb-0"
                style={{
                  color: darkMode ? "#cbd5e1" : "#64748b",
                }}
              >

                {user.email}

              </p>

              {/* IMAGE INPUT */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="form-control mt-3"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  if (file.size > 2048 * 2048) {
                    toast.error("Image size must be under 2MB");
                    return;
                  }

                  const reader = new FileReader();

                  reader.onload = () => {
                    localStorage.setItem(
                      `profilePhoto_${user.uid}`,
                      reader.result
                    );

                    setProfilePhoto(reader.result);

                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }

                    toast.success("Photo Uploaded");
                  };

                  reader.readAsDataURL(file);
                }}
              />

            </div>

            {/* STATS */}

            <div className="row g-3 mb-4">

              {/* NOTES */}

              <div className="col-6 col-md-3">

                <div

                  className="rounded p-3 text-center shadow-sm"
                  style={{
                    background: darkMode ? "#334155" : "#ffffff",
                    color: darkMode ? "#f8fafc" : "#0f172a",
                    border: darkMode
                      ? "1px solid #475569"
                      : "1px solid #e2e8f0",
                  }}

                >

                  <h3>
                    {notes.length}
                  </h3>

                  <small>
                    Notes
                  </small>

                </div>

              </div>

              {/* FAVORITES */}

              <div className="col-6 col-md-3">

                <div

                  className="rounded p-3 text-center shadow-sm"
                  style={{
                    background: darkMode ? "#334155" : "#ffffff",
                    color: darkMode ? "#f8fafc" : "#0f172a",
                    border: darkMode
                      ? "1px solid #475569"
                      : "1px solid #e2e8f0",
                  }}

                >

                  <h3>
                    {favoriteNotes}
                  </h3>

                  <small>
                    Favorites
                  </small>

                </div>

              </div>

              {/* PINNED */}

              <div className="col-6 col-md-3">

                <div

                  className="rounded p-3 text-center shadow-sm"
                  style={{
                    background: darkMode ? "#334155" : "#ffffff",
                    color: darkMode ? "#f8fafc" : "#0f172a",
                    border: darkMode
                      ? "1px solid #475569"
                      : "1px solid #e2e8f0",
                  }}

                >

                  <h3>
                    {pinnedNotes}
                  </h3>

                  <small>
                    Pinned
                  </small>

                </div>

              </div>

              {/* ARCHIVED */}

              <div className="col-6 col-md-3">

                <div

                  className="rounded p-3 text-center shadow-sm"
                  style={{
                    background: darkMode ? "#334155" : "#ffffff",
                    color: darkMode ? "#f8fafc" : "#0f172a",
                    border: darkMode
                      ? "1px solid #475569"
                      : "1px solid #e2e8f0",
                  }}

                >

                  <h3>
                    {archiveNotes}
                  </h3>

                  <small>
                    Archived
                  </small>

                </div>

              </div>

            </div>

            {/* ACCOUNT INFO */}

            <div className="mb-4">

              <h5 className="fw-bold mb-3">

                Account Information

              </h5>

              {/* EMAIL */}

              <div

                className="border rounded p-3 mb-3"
                style={{
                  borderColor: darkMode ? "#475569" : "#e2e8f0",
                }}

              >

                <strong>
                  Email:
                </strong>

                <br />

                {user.email}

              </div>

              {/* USER ID */}

              <div

                className="border rounded p-3"
                style={{
                  borderColor: darkMode ? "#475569" : "#e2e8f0",
                }}

              >

                <strong>
                  User ID:
                </strong>

                <br />

                <small
                  style={{
                    wordBreak:
                      "break-all",
                  }}
                >

                  {user.uid}

                </small>

              </div>

            </div>

            {/* LOGOUT */}

            <button

              className="btn btn-danger w-100 py-2"

              onClick={
                handleLogout
              }

            >

              Logout

            </button>

          </div>


        </div>

      </div>

    </div>

  );

}