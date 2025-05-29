import React, { useState } from "react";
import { usePrice } from "../context/PriceContext";
import { useShopStatus } from "../context/ShopStatusContext";

const AdminDashboard = () => {
  const { pricePerPage, setPricePerPage } = usePrice();
  const [input, setInput] = useState(pricePerPage);
  const { status, setStatus } = useShopStatus();

  const handleChange = (e) => setInput(e.target.value);
  const handleSave = () => setPricePerPage(Number(input));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">Admin Dashboard</h1>
        <h2 className="text-lg font-semibold mb-2">Set Price Per Page</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="number"
            value={input}
            onChange={handleChange}
            min={1}
            className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
        <p className="mb-6">Current Price Per Page: <span className="font-semibold">₹{pricePerPage}</span></p>
        <StatusUpdater status={status} setStatus={setStatus} />
      </div>
    </div>
  );
};

const StatusUpdater = ({ status, setStatus }) => (
  <div className="mt-6">
    <h2 className="text-lg font-semibold mb-2">Print Shop Status</h2>
    <div className="flex gap-4 mb-2">
      <button
        onClick={() => setStatus("open")}
        className={`px-4 py-2 rounded font-semibold transition ${
          status === "open"
            ? "bg-green-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-green-100"
        }`}
      >
        Open
      </button>
      <button
        onClick={() => setStatus("closed")}
        className={`px-4 py-2 rounded font-semibold transition ${
          status === "closed"
            ? "bg-red-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-red-100"
        }`}
      >
        Closed
      </button>
    </div>
    <p>
      Current Status:{" "}
      <span className={status === "open" ? "text-green-700 font-bold" : "text-red-700 font-bold"}>
        {status === "open" ? "Open" : "Closed"}
      </span>
    </p>
  </div>
);

export default AdminDashboard;