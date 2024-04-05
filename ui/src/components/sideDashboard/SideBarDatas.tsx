import Link from "next/link";

export default function SideBarData(props: any) {
  const sidebarData = props.items;
  console.log(sidebarData);

  const footage_id = sidebarData.footage_id;

  return (
    <>
      {footage_id === null ? (
        <button className=" text-white">{sidebarData.title}</button>
      ) : (
        <Link href={`/${sidebarData.id}`}>
          <p className="text-white text-xl">{sidebarData.title}</p>
        </Link>
      )}
    </>
  );
}
