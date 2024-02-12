import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiArrowLeftDoubleLine, RiArrowRightDoubleFill } from "react-icons/ri";
import DragAndDropInput from "@/components/ui/DragAndDropInput";

type TabType = "upload" | "real-time";

export default function Home(): JSX.Element {
  const [activeTab, setActiveTab] = useState<TabType>("upload");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [backgroundImage, setBackgroundImage] = useState<string>(
    "url('/background2.png')"
  );

  const handleTabClick = (value: TabType) => {
    setActiveTab(value);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const setBackground = (imageUrl: string) => {
    setBackgroundImage(imageUrl);
  };

  return (
    <div
      className="relative flex w-screen "
      style={{ backgroundImage: backgroundImage }}
    >
      <div
        className={`flex-none bg-customBlack ${
          isSidebarCollapsed ? "w-0" : "w-40"
        } h-screen overflow-hidden transition-all`}
      >
        {/* Sidebar content goes here */}
      </div>
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className={`p-2 bg-gray-600 text-green  h-20 bg-transparent`}
        >
          {isSidebarCollapsed ? (
            <RiArrowRightDoubleFill className="text-[#67CCD6]" />
          ) : (
            <RiArrowLeftDoubleLine className="text-[#67CCD6]" />
          )}
        </button>
      </div>
      <div
        className={
          "flex-col flex h-full w-full mt-10 items-center justify-center"
        }
      >
        <div className="flex w-full justify-center">
          <Tabs defaultValue="upload">
            <TabsList>
              <TabsTrigger
                value="upload"
                onClick={() => {
                  handleTabClick("upload");
                  setBackground("url('/background1.png')");
                }}
              >
                upload
              </TabsTrigger>
              <TabsTrigger
                value="real-time"
                onClick={() => {
                  handleTabClick("real-time");
                  setBackground("url('/background2.png')");
                }}
              >
                live
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
