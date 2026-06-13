import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar/Sidebar";
import Navbar from "../components/layout/Navbar/Navbar";
import Loader from "../components/common/Loader/Loader";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";

export default function MainLayout() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const user = auth.currentUser;
  const [search, setSearch] = useState("");
  const location = useLocation();
  const [pageLoading, setPageLoading] = useState(true);

  // Responsive screen detection
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;

      setIsMobile(mobile);

      if (mobile) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Page Loader
  useEffect(() => {
    setPageLoading(true);

    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (pageLoading) {
    return <Loader text="Loading page..." />;
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar
        user={user}
        handleLogout={handleLogout}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isMobile={isMobile}
      />

      <div
        style={{
          flex: 1,

          marginLeft: isMobile
            ? "0"
            : isOpen
            ? "220px"
            : "70px",

          transition: "margin-left 0.3s ease",

          minWidth: 0,
        }}
      >
        <Navbar
          search={search}
          setSearch={setSearch}
          handleLogout={handleLogout}
          user={user}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />

        <div
          style={{
            padding: isMobile ? "10px" : "20px",
          }}
        >
          <Outlet context={{ search }} />
        </div>
      </div>
    </div>
  );
}