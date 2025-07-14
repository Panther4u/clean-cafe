// "use client";
// import {
//   ArrowLeftIcon,
//   Bars4Icon,
//   HeartIcon,
//   ShoppingCartIcon,
// } from "@heroicons/react/24/solid";
// import { useRouter } from "next/navigation";
// import { Dropdown } from "flowbite-react";
// import {
//   HiHeart,
//   HiLogout,
//   HiShoppingCart,
//   HiViewGrid,
//   HiReceiptRefund       // ✅ Also this if you're using it for View Reports
// } from "react-icons/hi";
// import { motion as m } from "framer-motion";

// export default function Header({
//   page,
//   onClickOrder,
//   onClickFavorite,
//   onClickCart,
//   totalPrice,
// }) {
//   const router = useRouter();

//   const buttonMenu = [
//     {
//       icon: <HeartIcon />,
//       function: onClickFavorite,
//     },
//     {
//       icon: (
//         <>
//           <ShoppingCartIcon />
//           {totalPrice !== 0 && (
//             <p className="absolute -mt-6 ml-5  w-2 h-2 border border-white bg-red-600 rounded-full"></p>
//           )}
//         </>
//       ),
//       function: onClickCart,
//     },
//   ];

// const buttonDropdown = [
//   { name: "Order", icon: HiViewGrid, function: onClickOrder },
//   { name: "Favorite", icon: HiHeart, function: onClickFavorite },
//   { name: "Cart", icon: HiShoppingCart, function: onClickCart },
//   { name: "View Receipts", icon: HiReceiptRefund, function: () => router.push("/viewreceipts") },
//   { name: "Divider", icon: "", function: "" },
//   { name: "Logout", icon: HiLogout, function: () => router.push("/") },
// ];

//   return (
//     <div className="z-50 top-0 fixed w-full max-w-[414px] h-[52px] grid grid-cols-3 px-3 py-3 justify-between text-[#333736] text-lg font-semibold bg-[#FFFFFF] shadow-sm">
//       <div className="flex items-center overflow-hidden">
//         {page == "Order" ? (
//           <Dropdown
//             placement="bottom"
//             renderTrigger={() => (
//               <m.span
//                 initial={{ y: "100%" }}
//                 animate={{ y: "0%" }}
//                 transition={{ duration: 0.3, ease: "easeIn" }}
//               >
//                 <Bars4Icon className="h-[26px] w-[26px] fill-[#333736] transition-all" />
//               </m.span>
//             )}
//           >
//             {buttonDropdown.map((data, idx) => {
//               if (data.name !== "Divider") {
//                 return (
//                   <Dropdown.Item
//                     key={idx}
//                     icon={data.icon}
//                     as="button"
//                     onClick={data.function}
//                   >
//                     {data.name}
//                   </Dropdown.Item>
//                 );
//               } else {
//                 return <Dropdown.Divider key={idx} />;
//               }
//             })}
//           </Dropdown>
//         ) : (
//           <m.button
//             initial={{ y: "100%" }}
//             animate={{ y: "0%" }}
//             transition={{ duration: 0.3, ease: "easeIn" }}
//             onClick={onClickOrder}
//             className="h-[26px] w-[26px] fill-[#333736]"
//           >
//             <ArrowLeftIcon className="fill-[#333736] transition-all" />
//           </m.button>
//         )}
//       </div>
//       <button
//         className="flex justify-center font-bold"
//         onClick={() => {
//           window.scrollTo({
//             top: 0,
//             behavior: "smooth",
//           });
//         }}
//       >
//         {page}
//       </button>
//       <div className="flex justify-end items-center space-x-5">
//         {buttonMenu.map((data, idx) => {
//           return (
//             <button
//               key={idx}
//               onClick={data.function}
//               className="h-[25px] w-[25px] "
//             >
//               {data.icon}
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }





"use client";
import {
  ArrowLeftIcon,
  Bars4Icon,
  HeartIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { Dropdown } from "flowbite-react";
import {
  HiHeart,
  HiLogout,
  HiShoppingCart,
  HiViewGrid,
  HiReceiptRefund,
  HiCurrencyRupee,
} from "react-icons/hi";
import { motion as m } from "framer-motion";
import { useState } from "react";


export default function Header({
  page,
  onClickOrder,
  onClickFavorite,
  onClickCart,
  totalPrice,
  allMenuItems = [],
  setCurrentPage,
  searchText,           // ✅ accept from parent
  setSearchText,        // ✅ set from parent
}) {
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);

  const buttonMenu = [
    {
      icon: <HeartIcon />,
      function: onClickFavorite,
    },
    {
      icon: (
        <>
          <ShoppingCartIcon />
          {totalPrice !== 0 && (
            <p className="absolute -mt-6 ml-5 w-2 h-2 border border-white bg-red-600 rounded-full"></p>
          )}
        </>
      ),
      function: onClickCart,
    },
    {
      icon: <MagnifyingGlassIcon />,
      function: () => setShowSearch((prev) => !prev),
    },
  ];

  const buttonDropdown = [
    { name: "Order", icon: HiViewGrid, function: onClickOrder },
    { name: "Favorite", icon: HiHeart, function: onClickFavorite },
    { name: "Cart", icon: HiShoppingCart, function: onClickCart },
    { name: "View Receipts", icon: HiReceiptRefund, function: () => router.push("/viewreceipts") },
    { name: "Add Product", icon: HiViewGrid, function: () => setCurrentPage(3) },
    { name: "Sales Summary", icon: HiCurrencyRupee, function: () => setCurrentPage(4) },
    { name: "Divider", icon: "", function: "" },
    {
      name: "Logout",
      icon: HiLogout,
      function: () => {
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("adminLoginTime");
        router.replace("/");
      },
    },
  ];

  return (
    <>
{showSearch && (
  <div className="fixed top-[52px] z-50 w-full max-w-[414px] bg-white shadow-md p-2">
    <input
      type="text"
      placeholder="Search items..."
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      className="w-full p-2 border rounded-md text-sm text-black"
    />
{searchText.length > 0 && allMenuItems.length > 0 && (
  <ul className="max-h-48 overflow-y-auto mt-2 bg-white z-50 relative shadow-md">
    {allMenuItems
      .filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      )
      .map((item) => (
        <li
          key={item.id}
          className="p-2 border-b cursor-pointer hover:bg-gray-100 text-sm text-black"
          onClick={() => {
            setSearchText(item.name);
            setShowSearch(false);
          }}
        >
          {item.name}
        </li>
      ))}
  </ul>
)}

  </div>
)}


      <div className="z-50 top-0 fixed w-full max-w-[414px] h-[52px] grid grid-cols-3 px-2 py-3 justify-between text-[#333736] text-lg font-semibold bg-[#FFFFFF] shadow-sm">
        <div className="flex items-center overflow-hidden">
          {page === "Order" ? (
            <Dropdown
              placement="bottom"
              renderTrigger={() => (
                <m.span
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.3, ease: "easeIn" }}
                >
                  <Bars4Icon className="h-[26px] w-[26px] fill-[#333736] transition-all" />
                </m.span>
              )}
            >
              {buttonDropdown.map((data, idx) => {
                if (data.name !== "Divider") {
                  return (
                    <Dropdown.Item
                      key={idx}
                      icon={data.icon}
                      as="button"
                      onClick={data.function}
                    >
                      {data.name}
                    </Dropdown.Item>
                  );
                } else {
                  return <Dropdown.Divider key={idx} />;
                }
              })}
            </Dropdown>
          ) : (
            <m.button
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.3, ease: "easeIn" }}
              onClick={onClickOrder}
              className="h-[26px] w-[26px] fill-[#333736]"
            >
              <ArrowLeftIcon className="fill-[#333736] transition-all" />
            </m.button>
          )}
        </div>
        <button
          className="flex justify-center font-bold"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          {page}
        </button>
        <div className="flex justify-end items-center space-x-5">
          {buttonMenu.map((data, idx) => (
            <button key={idx} onClick={data.function} className="h-[25px] w-[25px]">
              {data.icon}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
