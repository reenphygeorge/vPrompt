import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const DragAndDropInput: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    // Process the dropped files (you can handle file uploads here)
    console.log(files);
    handleFiles(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    // Process the selected files (you can handle file uploads here)
    console.log(files);
    handleFiles(files);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (validVideoTypes.includes(file.type)) {
        // File is a valid video type, you can further process or upload it
        console.log("Valid video file:", file);
      } else {
        // File is not a valid video type, handle accordingly
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
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="hidden "
        onChange={handleFileInputChange}
        accept="video/*"
        id="fileInput" // Add an ID to the file input
      />
      <Button
        className="text-center bg-blue-700 w-32 mx-auto mt-40"
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        Browse
      </Button>
      <p className="m-auto">or drag and drop files here</p>
    </div>
  );
};

export default DragAndDropInput;
