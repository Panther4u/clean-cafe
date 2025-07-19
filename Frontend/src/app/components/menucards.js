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




"use client";
import { HeartIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi";
import { FaEye } from "react-icons/fa6";
import { IoHeartCircleSharp } from "react-icons/io5";

export const MenuCards = ({
  onClickModal,
  onClickMinus,
  onClickPlus,
  data,
  searchText = "",
  ...props
}) => {
  const highlightSearch = (text, query) => {
    if (!query) return text;
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;

    return (
      <>
        {text.slice(0, index)}
        <span className="bg-yellow-200 font-bold">
          {text.slice(index, index + query.length)}
        </span>
        {text.slice(index + query.length)}
      </>
    );
  };

  return (
    <div {...props} className="flex flex-col bg-white rounded-xl shadow-lg">
      <div className="flex flex-col group">
        {data?.favorite && (
          <div className="relative -mb-10 self-end w-fit z-10 p-1">
            <IoHeartCircleSharp className="float-right w-8 h-8 fill-red-600" />
          </div>
        )}
<Image
  id={data?.id}
  onClick={onClickModal}
  className="rounded-xl lg:rounded-b-none transition-all"
  src={data?.imageUrl || "/logo.png"}  // ✅ use correct field name
  width={200}
  height={200}
  alt={data?.name || "product image"}
  quality={100}
  unoptimized
/>

        <div
          onClick={onClickModal}
          className="hidden lg:flex opacity-0 group-hover:opacity-100 -mt-6 h-6 justify-center items-center text-white bg-black bg-opacity-60 rounded-t-xl transition-all duration-300"
        >
          <FaEye />
        </div>
      </div>

      <div className="p-4 font-semibold overflow-hidden">
        <h1 className="text-[#333736] text-nowrap truncate">
          {highlightSearch(data?.name, searchText)}
        </h1>

        <div className="flex flex-row flex-wrap mt-2 justify-between items-center">
          <h1 className="flex text-base items-center font-bold text-green-600">
            {data?.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
          </h1>
          <div className="w-[76px] flex flex-row transition-all">
            {data.amount === 0 ? (
              <button
                id={data?.id}
                onClick={(e) => onClickPlus(e, data?.id)}
                className="flex w-full h-[32.6px] text-white border bg-green-600 hover:bg-green-500 active:bg-green-500 justify-center items-center rounded-full transition-all"
              >
                Order
              </button>
            ) : (
              <div className="flex w-full p-[3px] border justify-between rounded-full transition-all">
                <button
                  id={data?.id}
                  onClick={(e) => onClickMinus(e, data?.id)}
                  className="flex w-[25px] h-[25px] bg-green-600 hover:bg-green-500 active:bg-green-500 justify-center items-center rounded-full transition-all"
                >
                  <HiOutlineMinus className="text-white fill-white" />
                </button>
                <p className="flex text-sm text-black justify-center items-center">
                  {data?.amount}
                </p>
                <button
                  id={data?.id}
                  onClick={(e) => onClickPlus(e, data?.id)}
                  className="flex w-[25px] h-[25px] bg-green-600 hover:bg-green-500 active:bg-green-500 justify-center items-center rounded-full transition-all"
                >
                  <HiOutlinePlus className="text-white fill-white" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};




// "use client";

// import Image from "next/image";
// import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi";
// import { FaRegEdit } from "react-icons/fa";

// export const MenuCards = ({
//   data,
//   onClickModal,
//   onClickPlus,
//   onClickMinus,
// }) => {
//   return (
//     <div className="bg-white shadow rounded-lg p-2 flex flex-col justify-between">
//       <div className="relative w-full h-28 rounded overflow-hidden border">
//         <Image
//           src={data.pic || "/placeholder.png"}
//           alt={data.name}
//           layout="fill"
//           objectFit="cover"
//           className="rounded"
//           unoptimized
//         />
//       </div>

//       <div className="mt-2">
//         <h3 className="font-semibold text-sm truncate text-black">
//           {data.name}
//         </h3>
//         <p className="text-green-700 font-semibold text-sm">
//           ₹{data.price}
//         </p>
//       </div>

//       <div className="flex justify-between items-center mt-2">
//         {data.amount > 0 ? (
//           <div className="flex items-center gap-2">
//             <button
//               onClick={(e) => onClickMinus(e, data.id)}
//               className="w-6 h-6 flex items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-500"
//             >
//               <HiOutlineMinus className="w-4 h-4" />
//             </button>
//             <span className="text-black font-medium text-sm">
//               {data.amount}
//             </span>
//             <button
//               onClick={(e) => onClickPlus(e, data.id)}
//               className="w-6 h-6 flex items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-500"
//             >
//               <HiOutlinePlus className="w-4 h-4" />
//             </button>
//           </div>
//         ) : (
//           <button
//             onClick={(e) => onClickPlus(e, data.id)}
//             className="w-full bg-green-600 text-white text-sm py-1 rounded hover:bg-green-700"
//           >
//             Add
//           </button>
//         )}

//         <button
//           onClick={(e) => onClickModal(e, data.id)}
//           className="text-green-600 text-sm hover:underline"
//         >
//           <FaRegEdit className="inline-block w-4 h-4 mr-1" /> Note
//         </button>
//       </div>
//     </div>
//   );
// };
