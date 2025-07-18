// "use client";
// import { HeartIcon } from "@heroicons/react/24/solid";
// import Image from "next/image";
// import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi";
// import { FaEye } from "react-icons/fa6";
// import { IoHeartCircleSharp } from "react-icons/io5";

// export const MenuCards = ({
//   onClickModal,
//   onClickMinus,
//   onClickPlus,
//   data,
//   props,
// }) => {
//   return (
//     <div {...props} className="flex flex-col bg-[#FFFFFF] rounded-xl shadow-lg">
//       <div className="flex flex-col group">
//         {data?.favorite && (
//           <div className="relative -mb-10 self-end w-fit z-10 p-1">
//             <IoHeartCircleSharp className="float-right w-8 h-8 fill-red-600" />
//           </div>
//         )}
//         <Image
//           id={data?.id}
//           onClick={onClickModal}
//           className="rounded-xl lg:rounded-b-none transition-all"
//           src={data?.pic}
//           width={200}
//           height={200}
//           alt="product image"
//           quality={100}
//           unoptimized
//         />
//         <div onClick={onClickModal} className="hidden lg:flex opacity-0 group-hover:opacity-100 -mt-6 h-6 justify-center items-center text-white bg-black bg-opacity-60 rounded-t-xl transition-all duration-300">
//           <FaEye />
//         </div>
//       </div>
//       <div className="p-4 font-semibold overflow-hidden">
//         <h1 className="text-[#333736] text-nowrap truncate">{data?.name}</h1>
//         <div className="flex flex-row flex-wrap mt-2 justify-between items-center">
//           <h1 className="flex text-base items-center font-bold text-green-600">
//             {data?.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
//           </h1>
//           <div className={`w-[76px] flex flex-row transition-all`}>
//             {data.amount === 0 ? (
//               <button
//                 id={data?.id}
//                 onClick={(e) => onClickPlus(e, data?.id)}
//                 className="flex w-full h-[32.6px] text-white border bg-green-600 hover:bg-green-500 active:bg-green-500 justify-center items-center rounded-full transition-all"
//               >
//                 Order
//               </button>
//             ) : (
//               <div className="flex w-full p-[3px] border justify-between rounded-full transition-all">
//                 <button
//                   id={data?.id}
//                   onClick={(e) => onClickMinus(e, data?.id)}
//                   className="flex w-[25px] h-[25px] bg-green-600 hover:bg-green-500 active:bg-green-500 justify-center items-center rounded-full transition-all"
//                 >
//                   <HiOutlineMinus className="text-white fill-white" />
//                 </button>
//                 <p className="flex text-sm text-black justify-center items-center">
//                   {data?.amount}
//                 </p>
//                 <button
//                   id={data?.id}
//                   onClick={(e) => onClickPlus(e, data?.id)}
//                   className="flex w-[25px] h-[25px] bg-green-600 hover:bg-green-500 active:bg-green-500 justify-center items-center rounded-full transition-all"
//                 >
//                   <HiOutlinePlus className="text-white fill-white" />
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };




// "use client";
// import { HeartIcon } from "@heroicons/react/24/solid";
// import Image from "next/image";
// import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi";
// import { FaEye } from "react-icons/fa6";
// import { IoHeartCircleSharp } from "react-icons/io5";

// export const MenuCards = ({
//   onClickModal,
//   onClickMinus,
//   onClickPlus,
//   data,
//   searchText = "",
//   ...props
// }) => {
//   const highlightSearch = (text, query) => {
//     if (!query) return text;
//     const index = text.toLowerCase().indexOf(query.toLowerCase());
//     if (index === -1) return text;

//     return (
//       <>
//         {text.slice(0, index)}
//         <span className="bg-yellow-200 font-bold">
//           {text.slice(index, index + query.length)}
//         </span>
//         {text.slice(index + query.length)}
//       </>
//     );
//   };

//   return (
//     <div {...props} className="flex flex-col bg-white rounded-xl shadow-lg">
//       <div className="flex flex-col group">
//         {data?.favorite && (
//           <div className="relative -mb-10 self-end w-fit z-10 p-1">
//             <IoHeartCircleSharp className="float-right w-8 h-8 fill-red-600" />
//           </div>
//         )}
//         <Image
//           id={data?.id}
//           onClick={onClickModal}
//           className="rounded-xl lg:rounded-b-none transition-all"
//           src={data?.pic || "/logo.png"}  // ✅ prevent crash
//           width={200}
//           height={200}
//           alt={data?.name || "product image"}
//           quality={100}
//           unoptimized
//         />
//         <div
//           onClick={onClickModal}
//           className="hidden lg:flex opacity-0 group-hover:opacity-100 -mt-6 h-6 justify-center items-center text-white bg-black bg-opacity-60 rounded-t-xl transition-all duration-300"
//         >
//           <FaEye />
//         </div>
//       </div>

//       <div className="p-4 font-semibold overflow-hidden">
//         <h1 className="text-[#333736] text-nowrap truncate">
//           {highlightSearch(data?.name, searchText)}
//         </h1>

//         <div className="flex flex-row flex-wrap mt-2 justify-between items-center">
//           <h1 className="flex text-base items-center font-bold text-green-600">
//             {data?.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
//           </h1>
//           <div className="w-[76px] flex flex-row transition-all">
//             {data.amount === 0 ? (
//               <button
//                 id={data?.id}
//                 onClick={(e) => onClickPlus(e, data?.id)}
//                 className="flex w-full h-[32.6px] text-white border bg-green-600 hover:bg-green-500 active:bg-green-500 justify-center items-center rounded-full transition-all"
//               >
//                 Order
//               </button>
//             ) : (
//               <div className="flex w-full p-[3px] border justify-between rounded-full transition-all">
//                 <button
//                   id={data?.id}
//                   onClick={(e) => onClickMinus(e, data?.id)}
//                   className="flex w-[25px] h-[25px] bg-green-600 hover:bg-green-500 active:bg-green-500 justify-center items-center rounded-full transition-all"
//                 >
//                   <HiOutlineMinus className="text-white fill-white" />
//                 </button>
//                 <p className="flex text-sm text-black justify-center items-center">
//                   {data?.amount}
//                 </p>
//                 <button
//                   id={data?.id}
//                   onClick={(e) => onClickPlus(e, data?.id)}
//                   className="flex w-[25px] h-[25px] bg-green-600 hover:bg-green-500 active:bg-green-500 justify-center items-center rounded-full transition-all"
//                 >
//                   <HiOutlinePlus className="text-white fill-white" />
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };



"use client";
import React from "react";
import Image from "next/image";
import { HiOutlinePlus, HiOutlineMinus } from "react-icons/hi";
import { FaEye } from "react-icons/fa6";

export const MenuCards = React.memo(({ data, onClickPlus, onClickMinus, onClickModal }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-3 m-2 flex flex-col">
      <div className="relative">
        <Image
          src={data.pic || "/placeholder.png"}
          width={200}
          height={200}
          alt={data.name}
          className="rounded-xl"
          loading="lazy"
        />
        <button
          onClick={onClickModal}
          className="absolute top-0 right-0 bg-black bg-opacity-40 p-1 rounded-bl-lg"
        >
          <FaEye className="text-white" />
        </button>
      </div>
      <div className="mt-2 text-center">
        <p className="font-semibold truncate">{data.name}</p>
        <p className="text-green-600 font-bold">₹{data.price}</p>
      </div>
      <div className="flex justify-center mt-2">
        {data.amount === 0 ? (
          <button
            onClick={onClickPlus}
            className="bg-green-600 text-white px-4 py-1 rounded-full"
          >
            Order
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={onClickMinus}
              className="p-2 bg-red-600 text-white rounded-full"
            >
              <HiOutlineMinus size={16} />
            </button>
            <span>{data.amount}</span>
            <button
              onClick={onClickPlus}
              className="p-2 bg-green-600 text-white rounded-full"
            >
              <HiOutlinePlus size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
});