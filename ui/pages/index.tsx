import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DragAndDropInput from "@/components/ui/DragAndDropInput";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("upload");

  const handleTabClick = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="flex w-screen">
      <div className="flex-none bg-customBlack w-40 h-screen"></div>
      <div className="flex-col flex h-full w-screen mt-10 items-center justify-center">
        <div className="flex w-full justify-center ">
          <Tabs defaultValue="upload">
            <TabsList>
              <TabsTrigger
                value="upload"
                onClick={() => handleTabClick("upload")}
              >
                upload a footage
              </TabsTrigger>
              <TabsTrigger
                value="real-time"
                onClick={() => handleTabClick("real-time")}
              >
                real-time footage
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex justify-center w-full h-80 items-center">
          {activeTab === "upload" && <DragAndDropInput />}
        </div>
      </div>
    </div>
  );
}
