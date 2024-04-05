// "use client";

// import {
//   Button,
//   Dropdown,
//   DropdownItem,
//   DropdownMenu,
//   DropdownTrigger,
// } from "@nextui-org/react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { useDropzone } from "react-dropzone";

// export default function DragAndDrop() {
//   const [videoFile, setVideoFile] = useState<File>();
//   const [isLoading, setIsLoading] = useState(false);
//   const [useCaseSelection,setUseCaseSelection] = useState<any>("");
//   const router = useRouter();
//   const onDrop = (files: any) => {
//     setVideoFile(files[0]);
//   };

//   const videoHandler = async (event: any) => {
//     event.preventDefault();
//     const formData = new FormData();

//     setIsLoading(true);

//     // const videoName = videoFile?.name;
//     const response = await fetch(
//       "https://21ee-2409-4073-2eb0-5ccc-145c-43c8-a751-7de1.ngrok-free.app/api/chat/",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ usecase: "person_detect" }),
//       }
//     );
//     const respData = await response.json();
//     const idData = respData.data;
//     const id = idData.id;
//     console.log(id);

//     formData.append("file", videoFile!);
//     formData.append("chat_id", id);

//     const videoResponse = await fetch(
//       "https://21ee-2409-4073-2eb0-5ccc-145c-43c8-a751-7de1.ngrok-free.app/api/footage/upload",
//       {
//         method: "POST",
//         body: formData,
//       }
//     );
//     if (response.ok) {
//       console.log("its okk");
//     } else {
//       console.log("errorr");
//     }
//     const fvr = await videoResponse.json();
//     console.log(fvr);

//     setIsLoading(false);

//     // router.push("/");
//   };
//   const selectionSeter =(key:string)=>{
//     setUseCaseSelection(key);
//   }
//   const { getRootProps, getInputProps } = useDropzone({ onDrop });

//   return (
//     <>
//       <div>
//         <div
//           {...getRootProps()}
//           style={{
//             border: "1px dashed rgb(216, 219, 219);",
//             padding: "20px",
//             textAlign: "center",
//           }}
//         >
//           <input {...getInputProps()} />
//           {videoFile !== null && (
//             <p>Drag & drop some files here, or click to select files</p>
//           )}
//           {videoFile !== null ? <p>{videoFile?.name}</p> : ""}
//         </div>
//         <div>
//           <Dropdown className="">
//             <DropdownTrigger>
//               <Button variant="bordered">Open Menu</Button>
//             </DropdownTrigger>
//             <DropdownMenu
//               aria-label="Dynamic Actions"
//               onAction={selectionSeter }
//             >
//               <DropdownItem className="text-white" key="license_plate">
//                 Vehicle Detection
//               </DropdownItem>
//               <DropdownItem key="person_detect">
//                 Person Identification
//               </DropdownItem>
//             </DropdownMenu>
//           </Dropdown>
//         </div>
//         <div className="mt-10 flex justify-center">
//           <button
//             type="button"
//             className="flex items-center rounded-lg  bg-slate-600  backdrop-filter backdrop-blur-lg bg-opacity-30 px-4 py-2 text-white"
//             onClick={videoHandler}
//           >
//             {isLoading ? (
//               <>
//                 <svg
//                   className="mr-3 h-5 w-5 animate-spin text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     stroke-width="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//                 <span className="font-medium"> Processing... </span>
//               </>
//             ) : (
//               <p>Upload</p>
//             )}
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }
"use client";
import React, { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

import { useDropzone } from "react-dropzone";

export default function DragAndDrop() {
  const [videoFile, setVideoFile] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);
  const [useCaseSelection, setUseCaseSelection] = useState<any>("");
  const router = useRouter();
  const onDrop = (files: any) => {
    setVideoFile(files[0]);
  };

  const videoHandler = async (event: any) => {
    event.preventDefault();
    const formData = new FormData();

    setIsLoading(true);

    // const videoName = videoFile?.name;
    const response = await fetch(
      `https://ebeb-2409-4073-2eb0-5ccc-145c-43c8-a751-7de1.ngrok-free.app/api/chat/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usecase: useCaseSelection }),
      }
    );
    const respData = await response.json();
    const idData = respData.data;
    const id = idData.id;
    console.log(id);

    formData.append("file", videoFile!);
    formData.append("chat_id", id);

    const videoResponse = await fetch(
      `https://ebeb-2409-4073-2eb0-5ccc-145c-43c8-a751-7de1.ngrok-free.app/api/footage/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (response.ok) {
      console.log("its okk");
    } else {
      console.log("errorr");
    }
    const fvr = await videoResponse.json();
    console.log(fvr);

    setIsLoading(false);

    router.push(`/${fvr.data}`);
  };
  const selectionSeter = (key: React.Key) => {
    setUseCaseSelection(key);
  };
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <>
      <div>
        <div
          {...getRootProps()}
          style={{
            border: "1px dashed rgb(216, 219, 219);",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <input {...getInputProps()} />
          {videoFile !== null && (
            <p>Drag & drop some files here, or click to select files</p>
          )}
          {videoFile !== null ? <p>{videoFile?.name}</p> : ""}
        </div>
        <div>
          <Dropdown className="">
            <DropdownTrigger>
              <Button variant="bordered">Open Menu</Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Dynamic Actions"
              onAction={selectionSeter}
            >
              <DropdownItem className="text-white" key="licence_plate">
                Vehicle Detection
              </DropdownItem>
              <DropdownItem key="person_detect">
                Person Identification
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            className="flex items-center rounded-lg  bg-slate-600  backdrop-filter backdrop-blur-lg bg-opacity-30 px-4 py-2 text-white"
            onClick={videoHandler}
          >
            {isLoading ? (
              <>
                <svg
                  className="mr-3 h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="font-medium"> Processing... </span>
              </>
            ) : (
              <p>Upload</p>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
