"use server";
import ChatSnippet from "@/components/chats/chat";
import SecondaryChatSnippet from "@/components/chats/secondaryChat";
import { redirect } from "next/navigation";

interface PageProps {
  params: {
    chatId: string;
  };
}
export default async function Page(props: PageProps) {
  const fetchedData = await fetch(
    `https://ebeb-2409-4073-2eb0-5ccc-145c-43c8-a751-7de1.ngrok-free.app/api/chat/?id=${props.params.chatId}&page=1&limit=10`,
    { cache: "no-cache" }
  );
  const data = await fetchedData.json();

  const sideBarData = data.data;
  const extractedData = sideBarData.map((item: any) => {
    return {
      prompt: item.prompt,
      response: item.response,
    };
  });

  console.log(extractedData);

  console.log(props.params.chatId);

  return (
    <>
      <ChatSnippet chatId={props.params.chatId} />
      {/* {sideBarData !== null} && <SecondaryChatSnippet chatId={sideBarData} /> */}
    </>
  );
}
