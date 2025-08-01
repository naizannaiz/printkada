import React from "react";

const StatusUpdater = ({ status, setStatus }) => (
  <div className="flex flex-col items-center">
    <div className="mb-2 font-semibold">
      Shop Status:{" "}
      <span className={`ml-2 font-bold ${status === "open" ? "text-green-600" : "text-red-600"}`}>
        {status === "open" ? "Open" : "Closed"}
      </span>
    </div>
    <div className="flex gap-4">
      <button
        className={`px-4 py-2 rounded font-semibold transition ${
          status === "open"
            ? "bg-green-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-green-100"
        }`}
        onClick={() => setStatus("open")}
        disabled={status === "open"}
      >
        Open
      </button>
      <button
        className={`px-4 py-2 rounded font-semibold transition ${
          status === "closed"
            ? "bg-red-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-red-100"
        }`}
        onClick={() => setStatus("closed")}
        disabled={status === "closed"}
      >
        Close
      </button>
    </div>
  </div>
);

export default StatusUpdater;