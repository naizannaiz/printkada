import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UploadPage.css";

const UploadPage = () => {
  const [pageCount, setPageCount] = useState(0);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handlePageCount = (count, selectedFile) => {
    setPageCount(count);
    setFile(selectedFile);
  };

  const handleProceedToPayment = () => {
    if (pageCount > 0) {
      navigate("/payment", { state: { pageCount } });
    } else {
      alert("Please upload a valid PDF and wait for page count.");
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload PDF Document</h2>
      <PageCounterWithCallback onCount={handlePageCount} />
      {pageCount > 0 && <p>Page Count: {pageCount}</p>}
      {pageCount > 0 && (
        <button onClick={handleProceedToPayment}>Proceed to Payment</button>
      )}
    </div>
  );
};

const PageCounterWithCallback = ({ onCount }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (selectedFile && selectedFile.type === "application/pdf") {
      const { countPagesInPDF } = await import("../utils/pdfUtils");
      try {
        const count = await countPagesInPDF(selectedFile);
        onCount(count, selectedFile);
      } catch {
        onCount(0, null);
      }
    } else {
      onCount(0, null);
    }
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
    </div>
  );
};

export default UploadPage;