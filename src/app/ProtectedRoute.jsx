import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function ProtectedRoute() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Loading state
  if (user === undefined) {
    return <h1>Loading...</h1>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/" />;
  }

  // Logged in
  return <Outlet />;
}