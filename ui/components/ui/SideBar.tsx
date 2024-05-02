import { useState, useContext, useEffect } from "react";
import { IoAdd } from "react-icons/io5";
import { VideoContext } from "../../context/VideoContext";
import { RiArrowLeftDoubleLine, RiArrowRightDoubleFill } from "react-icons/ri";
import { ChatContext } from "@/context/ChatContext";
import ChatItem from "./ChatItem";
import axios from "axios";

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
        className={`flex-none bg-customBlack ${
          isSidebarCollapsed ? "w-0" : "w-1/5"
        } h-screen overflow-hidden transition-all`}
      >
        <div className="flex bg-[#1D2233] p-2 items-center justify-center">
          <div className="text-white text-2xl">vPrompt</div>
          <div className=" text-white text-2xl h-10 w-10 flex items-center justify-center">
            <button
              onClick={() => {
                setIsProcessed(false);
                setIsNewChat(true);
              }}
              className="rounded-full bg-customBlack hover:scale-110 hover:text-gray-700"
            >
              <IoAdd />
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
