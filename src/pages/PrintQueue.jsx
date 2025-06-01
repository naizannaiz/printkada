import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

const PrintQueue = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      const q = query(collection(db, "printRequests"), orderBy("createdAt", "asc"));
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setRequests(data);
      setLoading(false);
    };
    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">Print Queue</h1>
        {loading ? (
          <p>Loading...</p>
        ) : requests.length === 0 ? (
          <p>No print requests yet.</p>
        ) : (
          <ul>
            {requests.map((req, idx) => (
              <li key={req.id} className="mb-4 p-4 border rounded shadow-sm">
                <div className="font-semibold">Token: {req.token || "Pending"}</div>
                <div>Pages: {req.pageCount}</div>
                <div>Type: {req.colorType}, Side: {req.sideType}</div>
                <div>Status: <span className="font-bold">{req.status}</span></div>
                <div>Requested At: {req.createdAt?.toDate().toLocaleString()}</div>
                {req.pdfUrl && (
                  <a href={req.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Download PDF
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PrintQueue;