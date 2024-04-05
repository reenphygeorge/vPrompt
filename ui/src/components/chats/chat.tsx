"use client";
import { redirect, useRouter } from "next/navigation";
import Image from "next/image";
import { FormEvent, useRef, useState } from "react";
import VideosPlay from "./videosPlay";
import { AiOutlineEnter } from "react-icons/ai";

export default function ChatSnippet(props: any) {
  const inputPromptRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [videoData, setVideoData] = useState<String[] | null>([]);
  const [changeInput, setChangeInput] = useState("");
  function onChangeKeyValues(event: any) {
    event.preventDefault();
    setChangeInput(event.target.value);
    // console.log(event.target.value);
  }
  async function promptTextHandler(event: FormEvent) {
    event.preventDefault();
    setChangeInput("");
    const keysData = inputPromptRef.current?.value;

    const fetchResponse = await fetch(
      "https://ebeb-2409-4073-2eb0-5ccc-145c-43c8-a751-7de1.ngrok-free.app/api/chat/message/",
      {
        cache: "no-cache",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: props.chatId,
          prompt: keysData,
        }),
      }
    );
    if (fetchResponse.ok) {
      const promptResponse = await fetchResponse.json();
      setVideoData(promptResponse.content);
      console.log(promptResponse.content);
      let urlsData = promptResponse.content;
      // const urls = urlsData.map((obj: any) => obj.url);
      const acurls: any = [];
      urlsData.forEach((element: any) => {
        if (element !== undefined) {
          acurls.push(element);
        }
      });
      console.log(acurls);
      setVideoData(acurls);
    } else {
      console.error("Failed to fetch prompt:", fetchResponse.statusText);
    }

    // router.push("/");
  }

  return (
    <div className="p-20 grid content-center justify-items-center h-full text-white ">
      <div className="p-5 flex flex-col w-full rounded-xl bg-slate-700  backdrop-filter backdrop-blur-lg bg-opacity-30">
        <div className="pt-4 pl-3">
          {inputPromptRef === null ? (
            ""
          ) : (
            <p>{inputPromptRef.current?.value}</p>
          )}
        </div>
        <div className="flex ">
          {/* <div className="p-6">
            <Image src="/car1.png" alt="car1" width={270} height={270} />
          </div> */}
          <div className="p-10 flex gap-24">
            {videoData === null ? (
              ""
            ) : (
              <>
                {videoData.map((url) => (
                  <div key={1}>
                    <VideosPlay item={url} />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="w-full px-20  bottom-4 fixed z-30">
        <form>
          <div className="w-full flex gap-3">
            <input
              className="outline-none bg-black rounded-xl px-4 w-full h-10"
              type="text"
              placeholder="Enter your prompt "
              ref={inputPromptRef}
              onChange={onChangeKeyValues}
              value={changeInput}
            />
            <button
              className="bg-black rounded-full p-3"
              onClick={promptTextHandler}
            >
              <AiOutlineEnter />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
