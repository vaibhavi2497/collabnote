import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard/Dashboard";
import Login from "../pages/Login/Login";
import Profile from "../pages/Profile/Profile";
import Register from "../pages/Register/Register";
import Home from "../pages/Home/Home";
import ProtectedRoute from "./ProtectedRoute";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import DeleteAccount from "../pages/DeleteAccount/DeleteAccount";
import MainLayout from "../Layout/MainLayout";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/delete-account" element={<DeleteAccount />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}