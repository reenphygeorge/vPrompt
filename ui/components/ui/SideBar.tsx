import { useState, useContext, useEffect } from "react";
import { IoAdd } from "react-icons/io5";
import { VideoContext } from "../../context/VideoContext";
import { RiArrowLeftDoubleLine, RiArrowRightDoubleFill } from "react-icons/ri";
import { ChatContext } from "@/context/ChatContext";
import ChatItem from "./ChatItem";
import axios from "axios";
import { HiPlusSm } from "react-icons/hi";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/?page=1&limit=10`;

type ChatItem = {
  id: string;
  title: string;
  usecase: string;
  message: string | null;
  footage: string | null;
  created_at: string;
  footage_id: string;
};

const SideBar: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [chats, setChats] = useState<ChatItem[]>([]);
  const { isProcessed, setIsProcessed } = useContext(VideoContext);
  const { isNewChat, setIsNewChat } = useContext(ChatContext);
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      console.log(response.data.data);
      setChats(response.data.data);
      // Process the fetched data
    } catch (error) {
      // Handle error
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div
        className={`flex-none bg-customBlack ${isSidebarCollapsed ? "w-0" : "w-1/5"
          } h-screen overflow-hidden transition-all`}
      >
        <div className="vp-header h-12 m-7 rounded-md flex gap-5 items-center justify-center">
          <div className="text-white md:text-lg text-xs select-none vp-title">vPrompt</div>
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

        {chats.map((chat) => (
          <ChatItem key={chat.id} title={chat.title} id={chat.id} />
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
