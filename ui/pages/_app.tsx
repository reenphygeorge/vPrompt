import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { VideoProvider } from "../context/VideoContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <VideoProvider>
      <Component {...pageProps} />{" "}
    </VideoProvider>
  );
}
