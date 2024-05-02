import React from "react";

interface SuggestionItemProps {
  suggestion: string;
  onClick: () => void;
}

const SuggestionItem: React.FC<SuggestionItemProps> = ({
  suggestion,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-[#FFFFFF] w-2/5 text-center rounded-md bg-opacity-30 backdrop-filter backdrop-blur-md flex items-center justify-center hover:scale-105 hover:cursor-pointer transition-transform"
    >
      {suggestion}
    </div>
  );
};

export default SuggestionItem;
