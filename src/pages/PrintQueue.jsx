import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { FaFilePdf, FaCheckCircle, FaTimesCircle, FaClock, FaArrowLeft } from "react-icons/fa";

const PrintQueue = () => {
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [confirmPrint, setConfirmPrint] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "printRequests"),
      where("status", "==", "paid"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setRequests(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  const handleSelect = (req) => setSelected(req);

  const handleMarkPrinted = async () => {
    if (selected) {
      await updateDoc(doc(db, "printRequests", selected.id), { status: "printed" });
      setSelected(null);
      setConfirmPrint(false);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <h2 className="text-3xl font-extrabold mb-8 text-blue-800 flex items-center gap-2">
        <FaFilePdf className="text-red-600" /> Print Queue <span className="text-base font-normal text-gray-500">(Paid)</span>
      </h2>
      {!selected ? (
        <div>
          {requests.length === 0 ? (
            <div className="text-gray-500 text-lg flex items-center gap-2">
              <FaClock className="text-yellow-500" /> No paid print requests found.
            </div>
          ) : (
            <ul className="grid md:grid-cols-2 gap-6">
              {requests.map(req => (
                <li
                  key={req.id}
                  className="border bg-white hover:shadow-xl transition-shadow p-6 rounded-xl flex flex-col items-center cursor-pointer group"
                  onClick={() => handleSelect(req)}
                >
                  {/* Highlighted Token */}
                  <div className="mb-4">
                    <span className="inline-block bg-gradient-to-r from-blue-600 to-blue-400 text-white text-3xl font-extrabold px-8 py-3 rounded-full shadow-lg border-4 border-blue-300 tracking-widest">
                      {req.token}
                    </span>
                  </div>
                  <div className="text-gray-700 mb-2"><b>Pages:</b> {req.pageCount}</div>
                  <div className="text-gray-700 mb-4"><b>Uploaded:</b> {req.createdAt?.toDate().toLocaleString()}</div>
                  <button
                    className="bg-blue-600 group-hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition"
                  >
                    View Details
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="border bg-white p-8 rounded-xl shadow-xl max-w-xl mx-auto animate-fade-in flex flex-col items-center">
          {/* Highlighted Token at the top */}
          <div className="mb-6">
            <span className="inline-block bg-gradient-to-r from-blue-600 to-blue-400 text-white text-4xl font-extrabold px-12 py-4 rounded-full shadow-lg border-4 border-blue-300 tracking-widest">
              {selected.token}
            </span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <FaFilePdf className="text-red-600 text-2xl" />
            <h3 className="text-2xl font-bold">PDF Details</h3>
          </div>
          <div className="mb-2"><b>Pages:</b> {selected.pageCount}</div>
          <div className="mb-2"><b>Color Type:</b> {selected.colorType}</div>
          <div className="mb-2"><b>Side Type:</b> {selected.sideType}</div>
          <div className="mb-2"><b>Payment ID:</b> {selected.paymentId}</div>
          <div className="mb-2 flex items-center gap-2">
            <b>Status:</b>
            <span className="inline-flex items-center gap-1">
              <FaCheckCircle className="text-green-600" /> {selected.status}
            </span>
          </div>
          <div className="mb-2"><b>Uploaded:</b> {selected.createdAt?.toDate().toLocaleString()}</div>
          <div className="my-4">
            <a
              href={selected.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline flex items-center gap-2"
            >
              <FaFilePdf /> Download PDF
            </a>
          </div>
          {!confirmPrint ? (
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded mr-2 font-semibold shadow transition"
              onClick={() => setConfirmPrint(true)}
            >
              Mark as Printed
            </button>
          ) : (
            <>
              <span className="mr-2 font-semibold text-red-600">Are you sure?</span>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mr-2 font-semibold shadow transition"
                onClick={handleMarkPrinted}
              >
                Yes
              </button>
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold shadow transition"
                onClick={() => setConfirmPrint(false)}
              >
                Cancel
              </button>
            </>
          )}
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded mt-4 flex items-center gap-2 transition"
            onClick={() => setSelected(null)}
          >
            <FaArrowLeft /> Back to Queue
          </button>
        </div>
      )}
    </div>
  );
};

export default PrintQueue;