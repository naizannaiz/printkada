import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import PrintTokenStatusCard from "../components/PrintTokenStatusCard";

const CheckStatus = () => {
  const [token, setToken] = useState(localStorage.getItem("printToken") || "");
  const [status, setStatus] = useState("");
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async (tokenValue) => {
    setLoading(true);
    setStatus("");
    setDetails(null);
    const q = query(collection(db, "printRequests"), where("token", "==", tokenValue));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docData = snap.docs[0].data();
      setStatus(docData.status);
      setDetails(docData);
    } else {
      setStatus("not found");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchStatus(token);
  }, []);

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Check Print Status</h2>
      <input
        type="text"
        value={token}
        onChange={e => setToken(e.target.value)}
        placeholder="Enter your token"
        className="border px-3 py-2 rounded mb-4 w-full"
      />
      <button
        onClick={() => fetchStatus(token)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Check Status
      </button>
      {loading && <div>Loading...</div>}
      {status && !loading && (
        <div className="mt-4">
          {status === "not found" ? (
            <div className="text-red-600">No print request found for this token.</div>
          ) : (
            <div>
              <div className="text-lg mb-2">
                <b>Status:</b> <span className="capitalize">{status}</span>
              </div>
              {details && (
                <>
                  <div><b>Token:</b> {details.token}</div>
                  <div><b>Pages:</b> {details.pageCount}</div>
                  <div><b>Color Type:</b> {details.colorType}</div>
                  <div><b>Side Type:</b> {details.sideType}</div>
                  <div><b>Uploaded:</b> {details.createdAt?.toDate?.().toLocaleString?.()}</div>
                </>
              )}
              {status === "printed" && (
                <div className="text-green-600 mt-2 font-bold">
                  Your document is printed and ready for collection!
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <PrintTokenStatusCard details={details} status={status} token={token} />
    </div>
  );
};

export default CheckStatus;