import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const DragAndDropInput: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setIsLoading(true);

    const files = e.dataTransfer.files;
    handleFiles(files);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setIsLoading(true);
    handleFiles(files);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (validVideoTypes.includes(file.type)) {
        console.log("Valid video file:", file);
      } else {
        console.log("Invalid file type:", file.type);
      }
    }
  };

  return (
    <div
      className={`border-2 border-dashed p-4 w-80 h-80 mt-40 ${
        isDragging ? "border-blue-500" : "border-[#606060]"
      } flex-col flex justify-center`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isLoading ? (
        <button
          type="button"
          className="text-center bg-blue-700 text-white w-40 mx-auto mt-40 py-2 px-4 rounded cursor-not-allowed"
          disabled
        >
          <svg
            className="animate-spin h-5 w-5 mr-3 inline-block"
            viewBox="0 0 24 24"
          >
            <circle
              className="text-white opacity-75"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
          </svg>
          Processing...
        </button>
      ) : (
        <>
          <input
            type="file"
            className="hidden"
            onChange={handleFileInputChange}
            accept="video/*"
            id="fileInput"
          />
          <Button
            className="text-center bg-blue-700 w-40 mx-auto mt-40"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            Browse
          </Button>
          <p className="m-auto text-white">or drag and drop files here</p>
        </>
      )}
    </div>
  );
};

export default DragAndDropInput;
