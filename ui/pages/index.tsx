import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DragAndDropInput from "@/components/ui/DragAndDropInput";

export default function Home() {
  return (
    <div className="flex w-screen">
      <div className="flex-none bg-customBlack  basis-1/5  w-32 h-screen"></div>
      <div className="flex-col flex h-full w-screen mt-10 items-center justify-center">
        <div className="flex w-full justify-center ">
          <Tabs defaultValue="account">
            <TabsList className="">
              <TabsTrigger value="account">upload a footage</TabsTrigger>
              <TabsTrigger value="password">real-time footage</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex justify-center w-full h-80 items-center">
          <DragAndDropInput />
        </div>
      </div>
    </div>
  );
}
