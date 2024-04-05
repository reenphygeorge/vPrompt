import DragAndDrop from "@/components/dragAndDrop/dragAndDrop";
import SideDashBoard from "@/components/sideDashboard/sideDashBoard";
export default async function Home() {
  const fetchedData = await fetch(
    `https://ebeb-2409-4073-2eb0-5ccc-145c-43c8-a751-7de1.ngrok-free.app/api/chat/?page=1&limit=10`,
    { cache: "no-cache" }
  );
  const data = await fetchedData.json();
  const sideBarData = data.data;

  return (
    <>
      <div>
        <SideDashBoard item={sideBarData} />
      </div>
      <div className="ml-32 h-full   grid content-center justify-items-center">
        <div className="rounded-xl bg-slate-800  backdrop-filter backdrop-blur-lg bg-opacity-30 p-28 text-white">
          <DragAndDrop />
        </div>
      </div>
    </>
  );
}
