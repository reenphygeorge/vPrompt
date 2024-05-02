import React, { useState, useContext } from "react";
import { BsArrowRightSquareFill } from "react-icons/bs";
import DragAndDropInput from "@/components/ui/DragAndDropInput";
import SideBar from "@/components/ui/SideBar";
import { VideoContext } from "../context/VideoContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import ChatArea from "@/components/ui/ChatArea";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home(): JSX.Element {
  const [backgroundImage, setBackgroundImage] = useState<string>(
    "url('/background2.png')"
  );

  const { isProcessed, setIsProcessed } = useContext(VideoContext);

  const setBackground = (imageUrl: string) => {
    setBackgroundImage(imageUrl);
  };
  const [model, setModel] = React.useState("Select Model");

  return (
    <div
      className="relative flex w-screen font-sans "
      style={{ backgroundImage: backgroundImage }}
    >
      <SideBar />
      {!isProcessed && (
        <div
          className={
            "flex-col flex h-full w-full mt-10 items-center justify-center"
          }
        >
          <div className="flex w-full justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{model}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={model} onValueChange={setModel}>
                  <DropdownMenuRadioItem value="licence_plate">
                    License Plate
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="person_detect">
                    Person Detection
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex justify-center w-full h-80 items-center">
            <DragAndDropInput usecase={model} />
          </div>
        </div>
      )}
      {isProcessed && <ChatArea />}
    </div>
  );
}
