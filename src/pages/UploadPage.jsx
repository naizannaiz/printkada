import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageCounter from "../components/PageCounter";
import { useShopStatus } from "../context/ShopStatusContext";
import { storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, Timestamp, query, where, getDocs } from "firebase/firestore";
import PrintTokenStatusCard from "../components/PrintTokenStatusCard";

const UploadPage = () => {
  const [pageCount, setPageCount] = useState(0);
  const [file, setFile] = useState(null);
  const [colorType, setColorType] = useState("");
  const [sideType, setSideType] = useState("");
  const [copies, setCopies] = useState(1);
  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prevToken, setPrevToken] = useState(localStorage.getItem("printToken") || "");
  const [prevStatus, setPrevStatus] = useState("");
  const [prevDetails, setPrevDetails] = useState(null);
  const [recentTokens, setRecentTokens] = useState([]);
  const [recentStatuses, setRecentStatuses] = useState([]);
  const [statusLoading, setStatusLoading] = useState(false);
  const navigate = useNavigate();
  const { status } = useShopStatus();

  useEffect(() => {
    sessionStorage.removeItem("printToken");
  }, []);

  // Fetch all tokens from localStorage for last 2 days
  useEffect(() => {
    const tokens = JSON.parse(localStorage.getItem("printTokens") || "[]");
    const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
    const recent = tokens.filter(t => t.createdAt > twoDaysAgo);
    setRecentTokens(recent);
  }, []);

  // Fetch statuses for all recent tokens
  useEffect(() => {
    const fetchStatuses = async () => {
      setStatusLoading(true);
      const statuses = [];
      for (const t of recentTokens) {
        const q = query(collection(db, "printRequests"), where("token", "==", t.token));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const docData = snap.docs[0].data();
          statuses.push({
            token: t.token,
            status: docData.status,
            details: docData,
          });
        }
      }
      setRecentStatuses(statuses);
      setStatusLoading(false);
    };
    if (recentTokens.length > 0) fetchStatuses();
    else setRecentStatuses([]);
  }, [recentTokens]);

  // Fetch previous token status
  useEffect(() => {
    const fetchPrevStatus = async () => {
      if (!prevToken) return;
      setStatusLoading(true);
      const q = query(collection(db, "printRequests"), where("token", "==", prevToken));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const docData = snap.docs[0].data();
        setPrevStatus(docData.status);
        setPrevDetails(docData);
      } else {
        setPrevStatus("not found");
        setPrevDetails(null);
      }
      setStatusLoading(false);
    };
    fetchPrevStatus();
  }, [prevToken]);

  // Modified PageCounter handler to support loading
  const handlePageCount = async (count, selectedFile, isLoading = false) => {
    setLoading(isLoading);
    setPageCount(count);
    setFile(selectedFile);
    if (!isLoading) setLoading(false);
  };

  const handleProceedToPayment = async () => {
    if (status === "closed") return;
    if (pageCount > 0 && colorType && sideType && file) {
      setLoading(true);
      try {
        // 1. Upload PDF to Firebase Storage
        const storageRef = ref(storage, `pdfs/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const pdfUrl = await getDownloadURL(storageRef);

        // 2. Create Firestore document with status "pending"
        const docRef = await addDoc(collection(db, "printRequests"), {
          pageCount,
          colorType,
          sideType,
          pdfUrl,
          copies, // Include copies here
          createdAt: Timestamp.now(),
          status: "pending",
        });

        sessionStorage.setItem("printRequestId", docRef.id);
        setLoading(false);
        navigate("/payment", { state: { pageCount, colorType, sideType, copies } }); // Pass copies to payment page
      } catch (error) {
        setLoading(false);
        setShowWarning(true);
      }
    } else {
      setShowWarning(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 relative">
      {/* Admin Icon Button */}
      <div className="absolute top-6 right-8">
        <button
          onClick={() => navigate("/admin-login")}
          className="bg-white p-2 rounded-full shadow hover:bg-blue-100 transition"
          title="Admin Login"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-blue-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>
      {/* Main Upload Card */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md z-10">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Upload PDF Document
        </h2>
        {/* Status Display */}
        <div
          className={`mb-4 text-center font-semibold ${
            status === "open" ? "text-green-700" : "text-red-700"
          }`}
        >
          Print Shop is {status === "open" ? "Open" : "Closed"}
        </div>
        {status === "closed" && (
          <div className="mb-4 text-red-600 font-bold text-center">
            Print requests are not accepted right now.
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center my-4">
            <svg
              className="animate-spin h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
            <span className="ml-2 text-blue-600 font-semibold">
              Processing PDF...
            </span>
          </div>
        )}

        <PageCounter
          onCount={(count, selectedFile) => handlePageCount(count, selectedFile, false)}
          setLoading={setLoading}
        />

        {/* Color or Black & White */}
        <div className="mt-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Print Type:
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="colorType"
                value="blackwhite"
                checked={colorType === "blackwhite"}
                onChange={() => setColorType("blackwhite")}
                className="mr-2"
                disabled={status === "closed"}
              />
              Black & White
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="colorType"
                value="color"
                checked={colorType === "color"}
                onChange={() => setColorType("color")}
                className="mr-2"
                disabled={status === "closed"}
              />
              Color
            </label>
          </div>
        </div>

        {/* Single or Double Side */}
        <div className="mt-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Print Side:
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="sideType"
                value="single"
                checked={sideType === "single"}
                onChange={() => setSideType("single")}
                className="mr-2"
                disabled={status === "closed"}
              />
              Single Side
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="sideType"
                value="double"
                checked={sideType === "double"}
                onChange={() => setSideType("double")}
                className="mr-2"
                disabled={status === "closed"}
              />
              Double Side
            </label>
          </div>
        </div>

        {/* Number of Copies */}
        <div className="mt-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Number of Copies:
          </label>
          <input
            type="number"
            min={1}
            value={copies || 1}
            onChange={e => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-24 px-2 py-1 border rounded focus:outline-none focus:ring"
            disabled={status === "closed"}
          />
        </div>

        {pageCount > 0 && (
          <p className="mt-4 text-lg text-green-700 font-semibold text-center">
            Page Count: {pageCount}
          </p>
        )}
        {showWarning && (
          <div className="mt-2 text-red-600 font-medium text-center">
            Please select print type and side before proceeding.
          </div>
        )}
        <button
          onClick={handleProceedToPayment}
          disabled={
            loading ||
            status === "closed" ||
            pageCount === 0 ||
            !colorType ||
            !sideType
          }
          className={`mt-6 w-full py-2 px-4 rounded-lg font-semibold transition ${
            loading ||
            status === "closed" ||
            pageCount === 0 ||
            !colorType ||
            !sideType
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>

      {/* All Recent Token Statuses Section */}
      <div className="flex flex-col items-center w-full mt-8">
        {statusLoading && <div>Loading your recent tokens...</div>}
        {!statusLoading && recentStatuses.length === 0 && (
          <div className="text-gray-400">No print requests in the last 2 days.</div>
        )}
        {recentStatuses.map(({ token, status, details }) => (
          <PrintTokenStatusCard
            key={token}
            token={token}
            status={status}
            details={details}
          />
        ))}
      </div>
    </div>
  );
};

export default UploadPage;