// context/VideoContext.tsx
import React, { createContext, useState, ReactNode } from "react";

interface VideoContextType {
  isProcessed: boolean;
  setIsProcessed: (processed: boolean) => void;
}

export const VideoContext = createContext<VideoContextType>({
  isProcessed: false,
  setIsProcessed: () => {},
});

interface VideoProviderProps {
  children: ReactNode;
}

export const VideoProvider: React.FC<VideoProviderProps> = ({ children }) => {
  const [isProcessed, setIsProcessed] = useState<boolean>(false);

  const setVideoProcessed = (processed: boolean) => {
    setIsProcessed(processed);
  };

  return (
    <VideoContext.Provider value={{ isProcessed, setIsProcessed }}>
      {children}
    </VideoContext.Provider>
  );
};
