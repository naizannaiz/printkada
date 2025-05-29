import React, { useState } from "react";
import { countPagesInPDF } from "../utils/pdfUtils";

const PageCounter = ({ file }) => {
  const [pageCount, setPageCount] = useState(0);
  const [error, setError] = useState("");

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      try {
        const count = await countPagesInPDF(selectedFile);
        setPageCount(count);
        setError("");
      } catch (err) {
        setError("Error counting pages. Please try again.");
        setPageCount(0);
      }
    } else {
      setError("Please upload a valid PDF file.");
      setPageCount(0);
    }
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      {pageCount !== null && <div>Page Count: {pageCount}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default PageCounter;