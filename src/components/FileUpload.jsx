import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      // Here you would typically call a function to count pages
      // For now, we'll just simulate a page count
      const simulatedPageCount = Math.floor(Math.random() * 100) + 1; // Simulate page count
      setPageCount(simulatedPageCount);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleUpload = () => {
    if (file) {
      // Handle the file upload logic here
      console.log("File uploaded:", file);
      console.log("Page count:", pageCount);
      // You can also call a function to process the payment here
    }
  };

  const handleProceedToPayment = () => {
    // You can add validation or upload logic here
    // Example: inside your upload handler or after counting pages
  navigate('/payment', { state: { pageCount } });
  };

  return (
    <div>
      <h2>Upload PDF Document</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {pageCount > 0 && <p>Page Count: {pageCount}</p>}
      {pageCount > 0 && (
        <button onClick={handleProceedToPayment}>Proceed to Payment</button>
      )}
    </div>
  );
};

export default FileUpload;