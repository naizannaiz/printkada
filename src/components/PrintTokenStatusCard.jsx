// You can place this in a new file, e.g. src/components/PrintTokenStatusCard.jsx

import { FaRegIdCard } from "react-icons/fa";

const PrintTokenStatusCard = ({ details, status, token }) => {
  if (!token) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full mx-auto mt-8 flex flex-col items-center">
      <div className="flex items-center mb-4 w-full">
        <FaRegIdCard className="text-2xl text-gray-700 mr-2" />
        <span className="font-semibold text-lg">Your Last Print Token</span>
      </div>
      <div className="space-y-3 w-full">
        <div className="bg-gray-50 rounded px-4 py-2 flex justify-between items-center">
          <span className="font-medium">Token Number:</span>
          <span className="font-bold text-gray-800">#{token}</span>
        </div>
        <div className="bg-gray-50 rounded px-4 py-2 flex justify-between items-center">
          <span className="font-medium">Status:</span>
          <span className="capitalize">{status || "Pending"}</span>
        </div>
        {details && (
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="bg-gray-50 rounded px-4 py-2">
              <div className="text-xs text-gray-400 font-medium">Pages</div>
              <div className="font-semibold">{details.pageCount}</div>
            </div>
            <div className="bg-gray-50 rounded px-4 py-2">
              <div className="text-xs text-gray-400 font-medium">Print Type</div>
              <div className="font-semibold capitalize">{details.colorType}</div>
            </div>
            <div className="bg-gray-50 rounded px-4 py-2">
              <div className="text-xs text-gray-400 font-medium">Print Side</div>
              <div className="font-semibold capitalize">{details.sideType}</div>
            </div>
            <div className="bg-gray-50 rounded px-4 py-2">
              <div className="text-xs text-gray-400 font-medium">Upload Date</div>
              <div className="font-semibold">
                {details.createdAt?.toDate?.().toLocaleDateString?.() || ""}
              </div>
            </div>
          </div>
        )}
        {status === "printed" && (
          <div className="text-green-600 font-bold text-center mt-4">
            Collect your print!
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintTokenStatusCard;