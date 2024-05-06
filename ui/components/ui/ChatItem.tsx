import React, { useContext } from "react";
import axios from "axios";
import { ChatContext, ChatsContext } from "@/context/ChatContext";
import { VideoContext } from "@/context/VideoContext";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ChatItemProps {
  id: string;
  title: string;
  onChatDeleted: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ id, title, onChatDeleted }) => {
  const { setIsNewChat, chatId, setChatId, setSuggestions } =
    useContext(ChatContext);
  const { setChats, chats, chatHistory, setChatHistory } =
    useContext(ChatsContext);
  const { isProcessed, setIsProcessed } = useContext(VideoContext);

  const handleChatDelete = () => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/${id}`)
      .then((response) => {
        const updatedChats = chats.filter((chat) => chat.id !== id);
        setChats(updatedChats);

        const updatedChatHistory = chatHistory.filter((chat) => chat.id !== id);
        setChatHistory(updatedChatHistory);

        onChatDeleted();
      })
      .catch((error) => {
        console.error("Error deleting chat:", error);
        toast.error("Error deleting chat. Please try again.");
      });
  };

  const handleClick = () => {
    setIsNewChat(false);
    setChatId(id);

    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chat`, {
        params: {
          id: chatId,
          page: 1,
          limit: 10,
        },
      })
      .then((response) => {
        const result = response.data.data.map((item: any) => ({
          id: item.id,
          prompt: item.prompt,
          response: item.response,
        }));

        setChats(result);

        if (response.data.suggestions) {
          setIsNewChat(true);
          setSuggestions(response.data.suggestions);
        }
        setIsProcessed(true);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
        toast.error("Error fetching messages. Please try again.");
      });
  };

  return (
    <div
      className="flex chat-item w-4/5 h-10 justify-between items-center gap-10 text-[#D4D4D4] my-2 mx-auto hover:bg-gray-900 rounded-md hover:text-white hover:cursor-pointer group"
      onClick={handleClick}
    >
      <div className="ml-3 chat-item-name truncate select-none w-4/5">
        {title}
      </div>
      <div className="mr-3 hidden group-hover:block">
        <MdDeleteOutline
          className="text-white hover:text-red-500"
          onClick={handleChatDelete}
        />
      </div>
    </div>
  );
};

export default ChatItem;
