import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { VideoProvider } from "../context/VideoContext";
import { ChatProvider } from "@/context/ChatContext";
import { ChatsProvider } from "@/context/ChatContext";
import { Toaster } from "@/components/ui/sonner";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultTheme="dark">
      <VideoProvider>
        <ChatsProvider>
          <ChatProvider>
            <Component {...pageProps} />{" "}
          </ChatProvider>
        </ChatsProvider>
      </VideoProvider>
      <Toaster className="text-[#D4D4D4] bg-black" />
    </ThemeProvider>
  );
}
