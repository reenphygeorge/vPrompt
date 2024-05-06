import React, { useState, useContext, useEffect } from "react";
import { RiArrowLeftDoubleLine, RiArrowRightDoubleFill } from "react-icons/ri";
import ChatItem from "./ChatItem";
import axios from "axios";
import { HiPlusSm } from "react-icons/hi";
import { ChatContext, ChatsContext } from "@/context/ChatContext";
import { VideoContext } from "../../context/VideoContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/?page=1&limit=10`;

const SideBar: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const { chatHistory, setChatHistory } = useContext(ChatsContext);
  const { isProcessed, setIsProcessed } = useContext(VideoContext);
  const { isNewChat, setIsNewChat } = useContext(ChatContext);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      console.log(response.data.data);
      setChatHistory(response.data.data);
      // Process the fetched data
    } catch (error) {
      // Handle error
      console.error("Error fetching data:", error);
      toast.error("Error fetching data. Please try again.");
    }
  };

  useEffect(() => {
    if (isNewChat) {
      fetchData(); // Call fetchData only if isNewChat is true
      setIsNewChat(false); // Reset isNewChat to false after fetching data
    }
  }, [isNewChat]);

  const fetchChats = () => {
    // Trigger fetchData when a chat item is deleted
    fetchData();
  };

  return (
    <>
      <div
        className={`flex-none bg-customBlack ${
          isSidebarCollapsed ? "w-0" : "w-1/5"
        } h-screen overflow-hidden transition-all`}
      >
        <div className="vp-header h-12 m-7 rounded-md flex gap-5 items-center justify-center">
          <div className="text-white md:text-lg text-xs select-none vp-title">
            vPrompt
          </div>
          <div>
            <button
              onClick={() => {
                setIsProcessed(false);
                setIsNewChat(true);
              }}
              className="rounded-full bg-black md:h-7 md:w-7 h-4 w-4 hover:opacity-60 flex justify-center items-center"
            >
              <HiPlusSm size={17} />
            </button>
          </div>
        </div>

        {chatHistory.map((chat) => (
          <ChatItem
            key={chat.id}
            title={chat.title}
            id={chat.id}
            onChatDeleted={fetchChats} // Pass callback function
          />
        ))}
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
    </>
  );
};

export default SideBar;
