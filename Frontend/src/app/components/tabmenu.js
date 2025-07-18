"use client";

export const TabMenu = ({ menusType, onClick, menuCards }) => {

  return (
    <div className="grid max-h-[36px] w-full mb-6">
      <div className="flex text-[#878988] text-sm font-medium max-h-[36px] space-x-3 overflow-scroll no-scrollbar">
        {menusType.map((data, idx) => {
          return (
            <button
              key={idx}
              id={idx}
              className={
                menuCards == idx
                  ? "px-[12px] h-8 max-h-[36px] whitespace-nowrap text-white bg-green-600 rounded-lg transition-all"
                  : "px-[12px] h-8 max-h-[36px] whitespace-nowrap hover:text-white hover:bg-green-600 active:bg-green-600 bg-[#F2F1F1] rounded-lg transition-all duration-[250ms]"
              }
              onClick={onClick}
            >
              {data}
            </button>
          );
        })}
      </div>
    </div>
  );
}



// "use client";

// export const TabMenu = ({ menusType, onClick, menuCards }) => {
//   return (
// <div className="w-full overflow-x-auto scrollbar-hide mb-6">
//   <div className="flex w-max px-4 py-2 space-x-2 text-sm sm:text-base md:text-base lg:text-lg">
//     {menusType.map((data, idx) => (
//       <button
//         key={idx}
//         id={idx}
//         onClick={onClick}
//         className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
//           menuCards == idx
//             ? "bg-green-600 text-white"
//             : "bg-[#F2F1F1] text-[#333] hover:bg-green-600 hover:text-white"
//         }`}
//       >
//         {data}
//       </button>
//     ))}
//   </div>
// </div>

//   );
// };
