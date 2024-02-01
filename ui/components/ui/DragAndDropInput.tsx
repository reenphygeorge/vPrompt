// DragAndDropInput.tsx
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
  };

  return (
    <div
      className={`border-2 border-dashed p-4 w-80 h-full mt-80 ${
        isDragging ? "border-blue-500" : "border-gray-300"
      } flex-col flex justify-center`}
      onDragEnter={handleDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Button className="text-center bg-blue-700 w-32 mx-auto mt-40">
        Browse
      </Button>
      <p className="m-auto">or drag and drop files here</p>
    </div>
  );
};

export default DragAndDropInput;
