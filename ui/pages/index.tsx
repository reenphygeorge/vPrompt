import React, { useState, useContext } from "react";
import { BsArrowRightSquareFill } from "react-icons/bs";
import { IoAdd } from "react-icons/io5";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiArrowLeftDoubleLine, RiArrowRightDoubleFill } from "react-icons/ri";
import DragAndDropInput from "@/components/ui/DragAndDropInput";
import { VideoContext } from "../context/VideoContext";
import { ScrollArea } from "@/components/ui/scroll-area";

type TabType = "upload" | "real-time";

export default function Home(): JSX.Element {
  const [activeTab, setActiveTab] = useState<TabType>("upload");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [backgroundImage, setBackgroundImage] = useState<string>(
    "url('/background2.png')"
  );

  const { isProcessed, setIsProcessed } = useContext(VideoContext);

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
        <div className="flex bg-[#1D2233] p-2 ">
          <div className="text-white">vPrompt</div>
          <div className="p-2 bg-blue mx-2 text-2xl text-white relative h-10 w-10">
            {" "}
            <button
              onClick={() => {
                setIsProcessed(false);
              }}
              className="absolute border top-0.5 right-0 rounded-full bg-black"
            >
              <IoAdd />
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className={`p-2 bg-gray-600 h-20 bg-transparent`}
        >
          {isSidebarCollapsed ? (
            <RiArrowRightDoubleFill className="text-[#67CCD6]" />
          ) : (
            <RiArrowLeftDoubleLine className="text-[#67CCD6]" />
          )}
        </button>
      </div>

      {!isProcessed && (
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
                  }}
                >
                  upload
                </TabsTrigger>
                <TabsTrigger
                  value="real-time"
                  onClick={() => {
                    handleTabClick("real-time");
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
      )}
      {isProcessed && (
        <div className="flex relative justify-center w-full my-auto mr-10 h-screen">
          <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4 text-white w-4/5 m-8">
            Jokester began sneaking into the castle in the middle of the night
            and leaving jokes all over the place: under the king's pillow, in
            his soup, even in the royal toilet. The king was furious, but he
            couldn't seem to stop Jokester. And then, one day, the people of the
            kingdom discovered that the jokes left by Jokester were so funny
            that they couldn't help but laugh. And once they started laughing,
            they couldn't stop.
          </ScrollArea>

          <div className=" flex justify-center absolute h-12 bottom-10 flex-auto p-2 w-full ">
            <input
              type="text"
              className="w-4/5 rounded p-2 bg-customBlack text-white"
              placeholder="Enter your prompt"
            />
            <div className="flex items-center h-full justify-center">
              <button className="w-full p-2 text-xl h-full">
                <BsArrowRightSquareFill className="text-[#67CCD6]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
