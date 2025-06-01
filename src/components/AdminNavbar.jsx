import React from "react";
import { useNavigate } from "react-router-dom";

const AdminNavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
      <div className="text-lg font-bold">Admin Panel</div>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="hover:underline"
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate("/admin-settings")}
          className="hover:underline"
        >
          Settings
        </button>
        <button
          onClick={() => navigate("/admin-logout")}
          className="hover:underline"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavBar;