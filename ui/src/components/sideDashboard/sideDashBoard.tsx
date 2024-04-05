"use client";
import { RiArrowLeftDoubleLine, RiArrowRightDoubleFill } from "react-icons/ri";

import { useState } from "react";
import Link from "next/link";
import SideBarData from "./SideBarDatas";

export default function SideDashBoard(props: any) {
  const data = props.item;

  const [isDashOpen, setDashOpen] = useState(false);

  const onSideDashBoardOpen = () => {
    setDashOpen((flip) => !flip);
  };

  return (
    <>
      <div className={`fixed h-full w-80 ${isDashOpen ? "bg-black" : ""}`}>
        <p
          className={`text-4xl text-gray-200 pl-3 pt-3 absolute ${
            isDashOpen ? "opacity-0" : ""
          }`}
        >
          SL
        </p>

        {isDashOpen ? (
          <div className=" h-full border relative border-red-200 animation-all ">
            <div className="absolute top-0 -right-8 flex items-center h-full ">
              <RiArrowLeftDoubleLine
                className="text-[#67CCD6] "
                style={{ fontSize: "2rem", cursor: "pointer" }}
                onClick={onSideDashBoardOpen}
              />
            </div>

            <div className="">
              <div className="bg-gradient-to-r from-slate-900 to-gray-800 flex justify-end pr-5 py-2">
                <button className="drop-shadow-2xl w-12 h-12  rounded-full text-stone-50 text-xl bg-black ">
                  +
                </button>
              </div>
              <div className="grid gap-3 ml-2">
                {data.map((item: any) => (
                  <div key={item.id}>
                    <SideBarData items={item} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute top-0 left-5 flex items-center h-full">
            <RiArrowRightDoubleFill
              style={{ fontSize: "2rem", cursor: "pointer" }}
              onClick={onSideDashBoardOpen}
            />
          </div>
        )}
      </div>
    </>
  );
}
