import React from "react";
import AdminPricePanel from "./AdminPricePanel";
import StatusUpdater from "../components/StatusUpdater";
import { useShopStatus } from "../context/ShopStatusContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { status, setStatus } = useShopStatus();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col items-center">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">Admin Dashboard</h1>
        
        {/* Status Updater */}
        <div className="w-full mb-8">
          <StatusUpdater status={status} setStatus={setStatus} />
        </div>

        {/* Price Panel */}
        <div className="w-full mb-8">
          <AdminPricePanel />
        </div>

        {/* Go to Print Queue Button */}
        <button
          onClick={() => navigate("/print-queue")}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
        >
          Go to Print Queue
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;