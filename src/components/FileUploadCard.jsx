import React, { useRef } from "react";

const FileUploadCard = ({ onFileSelect, uploading }) => {
  const fileInputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="bg-indigo-50 rounded-2xl shadow-lg p-8 w-full max-w-lg mx-auto flex flex-col items-center">
      {/* Upload Icon and Title */}
      <div className="flex items-center mb-2">
        <svg className="h-12 w-12 text-indigo-400 mr-3" fill="none" viewBox="0 0 48 48" stroke="currentColor">
          <rect width="48" height="48" rx="12" fill="#EEF2FF"/>
          <path d="M24 34V14M24 14l-7 7m7-7l7 7" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div>
          <div className="text-2xl font-bold text-gray-800">Upload your files</div>
          <div className="text-gray-500 text-sm mt-1">We support all popular formats like PDF, JPG, PNG, JPEG etc</div>
        </div>
      </div>
      {/* Drop Area */}
      <div
        className="w-full border-2 border-dashed border-indigo-200 rounded-lg flex flex-col items-center justify-center py-8 my-6 bg-white cursor-pointer transition hover:border-indigo-400"
        onClick={() => fileInputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
      >
        <svg className="h-10 w-10 text-indigo-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 16v-8m0 0l-4 4m4-4l4 4" stroke="#A5B4FC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div className="text-indigo-400 font-semibold mb-1">Drop files here</div>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
      {/* Upload Button */}
      <button
        type="button"
        onClick={() => fileInputRef.current.click()}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg text-lg transition mb-2"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload your files"}
      </button>
      {/* Info Text */}
      <div className="text-gray-400 text-xs mt-1">
        Maximum upload file size: 50 MB &nbsp;•&nbsp; Maximum files: 15
      </div>
    </div>
  );
};

export default FileUploadCard;