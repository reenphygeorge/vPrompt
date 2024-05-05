import React, { useContext, useState } from "react";
import axios from "axios"; // Import Axios
import { ChatContext, ChatsContext } from "@/context/ChatContext";
import { VideoContext } from "@/context/VideoContext";
import { MdDeleteOutline } from "react-icons/md";

interface ChatItemProps {
  id: string;
  title: string;
}

const ChatItem: React.FC<ChatItemProps> = ({ id, title }) => {
  const { setIsNewChat, chatId, setChatId, setSuggestions } =
    useContext(ChatContext);
  const { setChats, chats } = useContext(ChatsContext);
  const { isProcessed, setIsProcessed } = useContext(VideoContext);

  const handleClick = () => {
    setIsNewChat(false);
    setChatId(id);
    // Send Axios GET request
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chat`, {
        params: {
          id: chatId,
          page: 1, // Example value for page
          limit: 10, // Example value for limit
        },
      })
      .then((response) => {
        // Handle response if needed
        console.log("Messages:", response.data);
        const result = response.data.data.map((item: any) => ({
          id: item.id,
          prompt: item.prompt,
          response: item.response,
        }));

        setChats(result);

        // Check if suggestions field exists in response data
        if (response.data.suggestions) {
          setIsNewChat(true);
          setSuggestions(response.data.suggestions);
        }
        setIsProcessed(true);
      })
      .catch((error) => {
        // Handle error if needed
        console.error("Error fetching messages:", error);
      });
  };

  return (
    <div
      className="flex chat-item w-4/5 h-10 justify-between items-center gap-10 text-[#D4D4D4] my-2 mx-auto hover:bg-gray-900 rounded-md hover:text-white hover:cursor-pointer group"
      onClick={handleClick}
    >
      <div className="ml-3 chat-item-name truncate w-4/5">{title}</div>
      <div className="mr-3 hidden group-hover:block">
        <MdDeleteOutline className="text-white hover:text-red-500" />
      </div>
    </div>
  );
};

export default ChatItem;
