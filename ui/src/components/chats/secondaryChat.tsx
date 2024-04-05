"use client";
import { redirect, useRouter } from "next/navigation";
import Image from "next/image";
import { FormEvent, useRef, useState } from "react";
import VideosPlay from "./videosPlay";
import { AiOutlineEnter } from "react-icons/ai";
import SecondaryVideosPlay from "./secondaryVideo";

export default function SecondaryChatSnippet(props: any) {
  const inputPromptRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [videoData, setVideoData] = useState<String[] | null>([]);
  const [changeInput, setChangeInput] = useState("");
  const datas = props.chatId;
  const allResponses = datas.flatMap((item: any) => item.response);

  console.log(allResponses);

  function onChangeKeyValues(event: any) {
    event.preventDefault();
    setChangeInput(event.target.value);
    // console.log(event.target.value);
  }
  async function promptTextHandler(event: FormEvent) {}

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
        <div className="flex gap-24">
          <div className="p-10">
            <>
              {allResponses.map((url: any) => (
                <div key={1}>
                  <SecondaryVideosPlay item={url} />
                </div>
              ))}
            </>
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
