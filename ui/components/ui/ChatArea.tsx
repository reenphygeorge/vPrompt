import React, { useContext, useState, useEffect } from "react";
import { BsArrowRightSquareFill } from "react-icons/bs";
import { AiOutlineLoading } from "react-icons/ai";
import axios from "axios"; // Import Axios
import SuggestionItem from "./SuggestionItem";
import { ChatContext, ChatsContext } from "@/context/ChatContext";
import { ScrollArea } from "@/components/ui/scroll-area";

const ChatArea: React.FC = () => {
  const { setSuggestions, suggestions } = useContext(ChatContext);
  const { chats, setChats } = useContext(ChatsContext);

  // Determine the number of suggestions for each row
  const lowerRowSuggestions = Math.min(suggestions.length, 2);
  const upperRowSuggestions = Math.max(suggestions.length - 2, 0);

  const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/message`;

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const { isNewChat, chatId, setIsNewChat } = useContext(ChatContext);

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleSendClick = () => {
    setIsNewChat(false);
    setSuggestions([]);
    setLoading(true); // Set loading to true when sending request

    // Send Axios POST request
    axios
      .post(API_URL, { prompt, chat_id: chatId })
      .then((response) => {
        // Handle response if needed
        const responseData = response.data;

        // Map through the content array to create new chat objects
        const newChats = responseData.content.map((chatData: any) => ({
          id: Date.now().toString(),
          prompt: chatData.prompt_data,
          response: [
            {
              url: chatData.url,
              // Other properties if needed
            },
          ],
        }));

        // Concatenate the new chats with the existing chats
        setChats([...chats, ...newChats]);

        setPrompt("");
        setLoading(false); // Set loading to false when response is received
      })
      .catch((error) => {
        // Handle error if needed
        console.error("Error sending prompt:", error);
        setLoading(false); // Set loading to false in case of error
      });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendClick();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  useEffect(() => {
    console.log(chats);
  }, [chats]); // Run this effect whenever chats state changes

  return (
    <div className="flex relative justify-center w-full my-auto mr-10 h-screen">
      {/* Suggestions */}
      {isNewChat && (
        <div className="flex flex-col h-30 w-4/5 absolute bottom-20 m-10 text-[#F3F3F3]">
          {/* Lower row suggestions */}
          {lowerRowSuggestions > 0 && (
            <div className="flex h-12 w-full justify-between my-2">
              {suggestions
                .slice(0, lowerRowSuggestions)
                .map((suggestion, index) => (
                  <SuggestionItem
                    key={index}
                    suggestion={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                  />
                ))}
            </div>
          )}

          {/* Upper row suggestions */}
          {upperRowSuggestions > 0 && (
            <div className="flex h-12 w-full justify-between">
              {suggestions
                .slice(lowerRowSuggestions)
                .map((suggestion, index) => (
                  <SuggestionItem
                    key={index}
                    suggestion={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                  />
                ))}
            </div>
          )}
        </div>
      )}

      {/* Chat display */}
      {suggestions.length === 0 && (
        <ScrollArea className="flex flex-col bg-[#FFFFFF] mt-10 h-[500px] w-[350px] rounded-md p-4 w-full text-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
          {chats.map((chat, index) => (
            <div key={index} className="flex flex-col">
              <div className="w-full h-6 mt-2">{chat.prompt}</div>
              <div className="w-full h-40 flex flex-row ">
                {chat.response.map((video, idx) => (
                  <video
                    key={idx}
                    src={video.url}
                    className="w-1/5 h-full rounded-md mr-2 mb-2"
                    controls
                  />
                ))}
              </div>
            </div>
          ))}
        </ScrollArea>
      )}

      {/* Input box */}
      <div className="flex justify-center absolute h-12 bottom-10 flex-auto p-2 w-full">
        <input
          type="text"
          className="w-4/5 h-10 rounded-md p-4 bg-customBlack text-white"
          placeholder="Enter your prompt"
          value={prompt}
          onChange={handlePromptChange}
          onKeyPress={handleKeyPress}
        />
        <div className="flex items-center h-full justify-center">
          <button
            name="send"
            className="w-full px-3 text-xl h-full hover:scale-105 hover:text-blue-600"
            onClick={handleSendClick}
          >
            {loading ? (
              <AiOutlineLoading className="animate-spin" /> // Loading icon
            ) : (
              <BsArrowRightSquareFill className="text-[#67CCD6]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
