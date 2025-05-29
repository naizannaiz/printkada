import React, { useState } from "react";
import { countPagesInPDF } from "../utils/pdfUtils";

const PageCounter = ({ onCount, setLoading }) => {
  const [pageCount, setPageCount] = useState(0);
  const [error, setError] = useState("");

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (setLoading) setLoading(true);
    if (selectedFile && selectedFile.type === "application/pdf") {
      try {
        const count = await countPagesInPDF(selectedFile);
        setPageCount(count);
        setError("");
        if (onCount) onCount(count, selectedFile);
      } catch (err) {
        setError("Error counting pages. Please try again.");
        setPageCount(0);
        if (onCount) onCount(0, null);
      }
    } else {
      setError("Please upload a valid PDF file.");
      setPageCount(0);
      if (onCount) onCount(0, null);
    }
    if (setLoading) setLoading(false);
  };

  return (
    <div>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {pageCount !== null && (
        <div className="mt-4 text-lg font-semibold text-green-700">
          Page Count: {pageCount}
        </div>
      )}
      {error && (
        <div className="mt-2 text-red-600 font-medium">
          {error}
        </div>
      )}
    </div>
  );
};

export default PageCounter; 