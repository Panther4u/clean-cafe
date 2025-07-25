// "use client";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { AiOutlineFileDone } from "react-icons/ai";
// import { TbPlayerTrackNextFilled } from "react-icons/tb";
// import { FaRegSmileBeam } from "react-icons/fa";
// import { motion as m } from "framer-motion";
// import { HiPrinter } from "react-icons/hi";
// import { useRouter } from "next/navigation"; 
// import Image from "next/image";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

// export const Done = ({ checkout, discountAmount, totalPrice }) => {
//   const router = useRouter();
//   const [dateOrder, setDateOrder] = useState(null);
//   const [numbers, setNumbers] = useState({ table: [], order: [] });

//   useEffect(() => {
//     const generateRandomNumbersOrder = (x) => {
//       return Array.from({ length: x }, () => Math.floor(Math.random() * 10));
//     };

//     setDateOrder(new Date());
//     setNumbers({
//       table: generateRandomNumbersOrder(2),
//       order: generateRandomNumbersOrder(6),
//     });
//   }, []);

//   useEffect(() => {
//     if (numbers.order.length > 0 && numbers.table.length > 0 && dateOrder) {
//       const payload = {
//         order: checkout.order,
//         total: totalPrice.amount,
//         discount: (discountAmount / 100) * totalPrice.amount,
//         paymentMethod: checkout.payment,
//         billNo: `#001${numbers.order.join("")}`,
//         tableNo: `#0${numbers.table.join("")}`,
//         date: dateOrder.toLocaleString("en-IN"),
//         grandTotal: totalPrice.discounted,
//         createdAt: new Date().toISOString(),
//       };

//       fetch(`${API_BASE}/print`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       })
//         .then((res) => res.json())
//         .then((data) => console.log("Receipt sent to printer:", data))
//         .catch((err) => console.error("Error saving/printing receipt:", err));
//     }
//   }, [numbers, dateOrder]);

//   if (!dateOrder) {
//     return <div className="text-center py-10">⏳ Preparing receipt...</div>;
//   }

//   const formattedDate = dateOrder.toLocaleDateString();
//   const formattedTime = dateOrder.toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });

//   return (
//     <>
//       <title>Coffee Ordering Mobile Web by Kavi</title>
//       <div className="w-full flex justify-center font-mono">
//         <div className="flex flex-col justify-center itemsb min-h-screen w-[414px] bg-green-500 content-center overflow-hidden">
//           <div className=" flex flex-col py-8 justify-center items-center mb-9">
//             <div className="z-10 flex p-4 justify-center rounded-full bg-white hover:scale-110 active:scale-110 transition-all ">
//               <span className="absolute mt-2.5 -mr-[24px] w-3 h-3 rounded-full bg-green-400 animate-ping"></span>
//               <span className="absolute mt-3 -mr-6 w-2 h-2 rounded-full bg-green-400 "></span>
//               <AiOutlineFileDone className="flex w-16 h-16 p-3 text-white rounded-full bg-black shadow-lg" />
//             </div>
//             <div className="flex w-full justify-between bg-white h-[3px] -mt-[48px]">
//               <div className="w-2.5 h-5 rounded-r-full -mt-[9px] bg-white"></div>
//               <div className="w-2.5 h-5 rounded-l-full -mt-[9px] bg-white"></div>
//             </div>
//           </div>
//           <div className="hidden px-4 text-center justify-center items-center text-white space-x-2">
//             <span>Your order has been confirmed!</span>
//             <span><FaRegSmileBeam /></span>
//           </div>

//           <div className="flex mx-4 h-6 bg-black -mb-4 rounded-full"></div>

//           <div className="flex flex-col px-6 overflow-hidden">
//             <m.div initial={{ y: "-100%" }} animate={{ y: "0%" }} transition={{ duration: 0.3, ease: "easeOut" }}>
//               <div className="flex flex-col items-center justify-center p-2 text-black bg-white border">
//                 <div className="flex justify-center items-center py-4 transition-all">
//                   <div className="w-1/2 aspect-square rounded-full overflow-hidden flex justify-center items-center" style={{ backgroundColor: "rgba(44, 0, 0, 1)" }}>
//                     <Image
//                       src="/Logo.png"
//                       width={200}
//                       height={200}
//                       alt="coffee company logo"
//                       quality={100}
//                       unoptimized
//                       priority
//                     />
//                   </div>
//                 </div>

//                 <div className="w-full space-y-2">
//                   <div className="flex flex-col px-2 py-2 border-b border-slate-500">
//                     <div className="flex"><span className=" w-1/4">Bill No</span><p className=" w-3/4">: #001{numbers?.order.map((number, idx) => <span key={idx}>{number}</span>)}</p></div>
//                     <div className="flex"><span className=" w-1/4">Table</span><p className="w-3/4">: #0{numbers?.table.map((number, idx) => <span key={idx}>{number}</span>)}</p></div>
//                     <div className="flex"><span className=" w-1/4">Payment</span><p className="w-3/4 capitalize">: {checkout.payment}</p></div>
//                     <div className="flex"><span className=" w-1/4">Date</span><p className=" w-3/4">: {formattedDate} | {formattedTime}</p></div>
//                     <div className="flex"><span className=" w-1/4">On Shift</span><p className=" w-3/4">: Sri Kandhan Cafe Team</p></div>
//                   </div>

//                   <div className="flex flex-col px-2 w-full">
//                     <h1 className=" pb-1 text-center">Order Items:</h1>
//                     <table className="border-spacing-3 table-fixed">
//                       <tbody>
//                         {checkout?.order.map((data, idx) => (
//                           <tr key={idx}>
//                             <td className="pr-1 py-0">
//                               <p className="py-0">{data.name}</p>
//                               {data.notes !== "" && <p className="text-xs py-0">Notes: {data.notes}</p>}
//                             </td>
//                             <td className="pr-1 py-0 align-top">{data.amount}Qty</td>
//                             <td className="align-top text-right py-0">₹{(data.price * data.amount).toFixed(2)}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>

//                   <div className="border-b border-slate-500 my-2"></div>

//                   <div className="flex flex-col px-2 w-full">
//                     <table className="w-full">
//                       <tbody className="font-bold text-base">
//                         <tr><td className="text-left">{checkout?.order.length} item(s)</td><td className="text-right"></td></tr>
//                         {discountAmount !== 0 && (
//                           <>
//                             <tr><td>Total</td><td className="text-right">₹{totalPrice.amount.toFixed(2)}</td></tr>
//                             <tr className="text-green-600"><td>Discount</td><td className="text-right">- ₹{((discountAmount / 100) * totalPrice.amount).toFixed(2)}</td></tr>
//                           </>
//                         )}
//                         <tr className="text-lg border-t border-slate-300 pt-2"><td>Grand Total</td><td className="text-right">₹{totalPrice.discounted.toFixed(2)}</td></tr>
//                       </tbody>
//                     </table>
//                   </div>

//                   <div className="flex w-full justify-center">{"==== THANK YOU ==== "}</div>
//                 </div>
//               </div>

//   {/* ========= WAVE SVG ======== */}
              // <div className="text-black -mt-[14px]">
              //   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              //     <path
              //       fill="white"
              //       fillOpacity="1"
              //       d="M0,288L6.2,245.3C12.3,203,25,117,37,101.3C49.2,85,62,139,74,144C86.2,149,98,107,111,96C123.1,85,135,107,148,138.7C160,171,172,213,185,229.3C196.9,245,209,235,222,202.7C233.8,171,246,117,258,106.7C270.8,96,283,128,295,154.7C307.7,181,320,203,332,218.7C344.6,235,357,245,369,218.7C381.5,192,394,128,406,117.3C418.5,107,431,149,443,144C455.4,139,468,85,480,96C492.3,107,505,181,517,208C529.2,235,542,213,554,197.3C566.2,181,578,171,591,144C603.1,117,615,75,628,80C640,85,652,139,665,181.3C676.9,224,689,256,702,229.3C713.8,203,726,117,738,122.7C750.8,128,763,224,775,250.7C787.7,277,800,235,812,192C824.6,149,837,107,849,106.7C861.5,107,874,149,886,160C898.5,171,911,149,923,149.3C935.4,149,948,171,960,181.3C972.3,192,985,192,997,208C1009.2,224,1022,256,1034,234.7C1046.2,213,1058,139,1071,144C1083.1,149,1095,235,1108,256C1120,277,1132,235,1145,202.7C1156.9,171,1169,149,1182,138.7C1193.8,128,1206,128,1218,160C1230.8,192,1243,256,1255,256C1267.7,256,1280,192,1292,149.3C1304.6,107,1317,85,1329,112C1341.5,139,1354,213,1366,213.3C1378.5,213,1391,139,1403,133.3C1415.4,128,1428,192,1434,224L1440,256L1440,0L1433.8,0C1427.7,0,1415,0,1403,0C1390.8,0,1378,0,1366,0C1353.8,0,1342,0,1329,0C1316.9,0,1305,0,1292,0C1280,0,1268,0,1255,0C1243.1,0,1231,0,1218,0C1206.2,0,1194,0,1182,0C1169.2,0,1157,0,1145,0C1132.3,0,1120,0,1108,0C1095.4,0,1083,0,1071,0C1058.5,0,1046,0,1034,0C1021.5,0,1009,0,997,0C984.6,0,972,0,960,0C947.7,0,935,0,923,0C910.8,0,898,0,886,0C873.8,0,862,0,849,0C836.9,0,825,0,812,0C800,0,788,0,775,0C763.1,0,751,0,738,0C726.2,0,714,0,702,0C689.2,0,677,0,665,0C652.3,0,640,0,628,0C615.4,0,603,0,591,0C578.5,0,566,0,554,0C541.5,0,529,0,517,0C504.6,0,492,0,480,0C467.7,0,455,0,443,0C430.8,0,418,0,406,0C393.8,0,382,0,369,0C356.9,0,345,0,332,0C320,0,308,0,295,0C283.1,0,271,0,258,0C246.2,0,234,0,222,0C209.2,0,197,0,185,0C172.3,0,160,0,148,0C135.4,0,123,0,111,0C98.5,0,86,0,74,0C61.5,0,49,0,37,0C24.6,0,12,0,6,0L0,0Z"
              //     ></path>
              //   </svg>
              // </div>
//             </m.div>
//           </div>
          

//           <div className="flex justify-center py-8 -mt-7">
//             <button onClick={() => window.print()} className="bg-black text-white py-2 px-4 rounded flex items-center gap-2">
//               <HiPrinter className="w-5 h-5" />
//               Print
//             </button>
//           </div>

//           <m.div initial={{ y: "100%" }} animate={{ y: "0%" }} transition={{ duration: 0.3, ease: "easeOut" }} className="flex justify-center py-8 -mt-7">
//             <button onClick={() => router.push("/")} className="flex p-4 justify-center text-center font-bold font-mono text-2xl bg-black text-white active:text-gray-300 active:bg-gray-800 hover:scale-110 active:scale-110 rounded-full transition-all focus:outline-none">
//               <span className="bg-white rounded-full p-2 transition-all">
//                 <TbPlayerTrackNextFilled className="h-7 w-7 text-black transition-all" />
//               </span>
//             </button>
//           </m.div>

//         </div>
//       </div>
//     </>
//   );
// };

// // "use client";
// import { useEffect, useState } from "react";
// import { AiOutlineFileDone } from "react-icons/ai";
// import { TbPlayerTrackNextFilled } from "react-icons/tb";
// import { FaRegSmileBeam } from "react-icons/fa";
// import { motion as m } from "framer-motion";
// import { HiPrinter } from "react-icons/hi";
// import { useRouter } from "next/navigation";
// import Image from "next/image";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

// export const Done = ({ checkout, discountAmount, totalPrice }) => {
//   const router = useRouter();
//   const [dateOrder, setDateOrder] = useState(null);
//   const [numbers, setNumbers] = useState({ table: [], order: [] });

//   useEffect(() => {
//     const generateRandomNumbersOrder = (x) =>
//       Array.from({ length: x }, () => Math.floor(Math.random() * 10));

//     setDateOrder(new Date());
//     setNumbers({
//       table: generateRandomNumbersOrder(2),
//       order: generateRandomNumbersOrder(6),
//     });
//   }, []);

//   useEffect(() => {
//     if (numbers.order.length > 0 && numbers.table.length > 0 && dateOrder) {
//       const payload = {
//         order: checkout.order,
//         total: totalPrice.amount,
//         discount: (discountAmount / 100) * totalPrice.amount,
//         paymentMethod: checkout.payment,
//         billNo: `#001${numbers.order.join("")}`,
//         tableNo: `#0${numbers.table.join("")}`,
//         date: dateOrder.toLocaleString("en-IN"),
//         grandTotal: totalPrice.discounted,
//         createdAt: new Date().toISOString(),
//       };

//       fetch(`${API_BASE}/print`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       })
//         .then((res) => res.json())
//         .then((data) => console.log("Receipt sent to printer:", data))
//         .catch((err) => console.error("Error saving/printing receipt:", err));
//     }
//   }, [numbers, dateOrder]);

//   if (!dateOrder) {
//     return <div className="text-center py-10">⏳ Preparing receipt...</div>;
//   }

//   const formattedDate = dateOrder.toLocaleDateString("en-IN");
//   const formattedTime = dateOrder.toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });

//   return (
//     <>
//       <title>Coffee Ordering Mobile Web by Kavi</title>
//       <div className="w-full flex justify-center font-mono">
//         <div className="flex flex-col justify-center min-h-screen w-[414px] bg-green-500 content-center overflow-hidden">
//           <div className="flex flex-col py-8 justify-center items-center mb-9">
//             <div className="z-10 flex p-4 justify-center rounded-full bg-white hover:scale-110 active:scale-110 transition-all">
//               <span className="absolute mt-2.5 -mr-[24px] w-3 h-3 rounded-full bg-green-400 animate-ping"></span>
//               <span className="absolute mt-3 -mr-6 w-2 h-2 rounded-full bg-green-400"></span>
//               <AiOutlineFileDone className="flex w-16 h-16 p-3 text-white rounded-full bg-black shadow-lg" />
//             </div>
//             <div className="flex w-full justify-between bg-white h-[3px] -mt-[48px]">
//               <div className="w-2.5 h-5 rounded-r-full -mt-[9px] bg-white"></div>
//               <div className="w-2.5 h-5 rounded-l-full -mt-[9px] bg-white"></div>
//             </div>
//           </div>

//           <div className="flex mx-4 h-6 bg-black -mb-4 rounded-full"></div>

//           <div className="flex flex-col px-6 overflow-hidden">
//             <m.div
//               initial={{ y: "-100%" }}
//               animate={{ y: "0%" }}
//               transition={{ duration: 0.3, ease: "easeOut" }}
//             >
//               <div className="flex flex-col items-center justify-center p-2 text-black bg-white border">

//                 {/* Logo */}
//                 <div className="flex justify-center items-center py-4">
//                   <div
//                     className="w-1/2 aspect-square rounded-full overflow-hidden flex justify-center items-center"
//                     style={{ backgroundColor: "rgba(44, 0, 0, 1)" }}
//                   >
//                     <Image
//                       src="/Logo.png"
//                       width={200}
//                       height={200}
//                       alt="coffee company logo"
//                       quality={100}
//                       unoptimized
//                       priority
//                     />
//                   </div>
//                 </div>

//                 {/* ✅ Business Info Block */}
//             <div className="text-center leading-tight mb-4">
//               <p className="text-base font-bold">NELLAI KARUPATTI COFFEE</p>
//               <p className="text-sm text-gray-700">North Pradakshanam Road,</p>
//               <p className="text-sm text-gray-700">Karur, TAMIL NADU</p>
//               <p className="text-sm text-gray-700">PHONE : 7010452495</p>
//               <p className="text-sm text-gray-700">GSTIN : 33GGTPS6619J1ZJ</p>
//             </div>


//                 {/* Receipt Details */}
//                 <div className="w-full space-y-2">
//                   <div className="flex flex-col px-2 py-2 border-b border-slate-500">
//                     <div className="flex">
//                       <span className="w-1/4">Bill No</span>
//                       <p className="w-3/4">
//                         : #001
//                         {numbers?.order.map((number, idx) => (
//                           <span key={idx}>{number}</span>
//                         ))}
//                       </p>
//                     </div>
//                     <div className="flex">
//                       <span className="w-1/4">Table</span>
//                       <p className="w-3/4">
//                         : #0
//                         {numbers?.table.map((number, idx) => (
//                           <span key={idx}>{number}</span>
//                         ))}
//                       </p>
//                     </div>
//                     <div className="flex">
//                       <span className="w-1/4">Payment</span>
//                       <p className="w-3/4 capitalize">: {checkout.payment}</p>
//                     </div>
//                     <div className="flex">
//                       <span className="w-1/4">Date</span>
//                       <p className="w-3/4">
//                         : {formattedDate} | {formattedTime}
//                       </p>
//                     </div>
//                     <div className="flex">
//                       <span className="w-1/4">On Shift</span>
//                       <p className="w-3/4">: Sri Kandhan Cafe Team</p>
//                     </div>
//                   </div>

//                   {/* Items */}
//                   <div className="flex flex-col px-2 w-full">
//                     <h1 className="pb-1 text-center">Order Items:</h1>
//                     <table className="table-fixed border-spacing-3">
//                       <tbody>
//                         {checkout?.order.map((item, idx) => (
//                           <tr key={idx}>
//                             <td className="pr-1 py-0">
//                               <p className="py-0">{item.name}</p>
//                               {item.notes && (
//                                 <p className="text-xs py-0">
//                                   Notes: {item.notes}
//                                 </p>
//                               )}
//                             </td>
//                             <td className="pr-1 py-0 align-top">
//                               {item.amount}Qty
//                             </td>
//                             <td className="align-top text-right py-0">
//                               ₹{(item.price * item.amount).toFixed(2)}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>

//                   <div className="border-b border-slate-500 my-2" />

//                   {/* Totals */}
//                   <div className="flex flex-col px-2 w-full">
//                     <table className="w-full">
//                       <tbody className="font-bold text-base">
//                         <tr>
//                           <td className="text-left">
//                             {checkout?.order.length} item(s)
//                           </td>
//                           <td className="text-right"></td>
//                         </tr>
//                         {discountAmount !== 0 && (
//                           <>
//                             <tr>
//                               <td>Total</td>
//                               <td className="text-right">
//                                 ₹{totalPrice.amount.toFixed(2)}
//                               </td>
//                             </tr>
//                             <tr className="text-green-600">
//                               <td>Discount</td>
//                               <td className="text-right">
//                                 - ₹
//                                 {((discountAmount / 100) *
//                                   totalPrice.amount
//                                 ).toFixed(2)}
//                               </td>
//                             </tr>
//                           </>
//                         )}
//                         <tr className="text-lg border-t border-slate-300 pt-2">
//                           <td>Grand Total</td>
//                           <td className="text-right">
//                             ₹{totalPrice.discounted.toFixed(2)}
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>

//                   <div className="flex w-full justify-center font-semibold pt-2">
//                     ==== THANK YOU ====
//                   </div>
//                 </div>
                
//               </div>
//                             <div className="text-black -mt-[14px]">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
//                   <path
//                     fill="white"
//                     fillOpacity="1"
//                     d="M0,288L6.2,245.3C12.3,203,25,117,37,101.3C49.2,85,62,139,74,144C86.2,149,98,107,111,96C123.1,85,135,107,148,138.7C160,171,172,213,185,229.3C196.9,245,209,235,222,202.7C233.8,171,246,117,258,106.7C270.8,96,283,128,295,154.7C307.7,181,320,203,332,218.7C344.6,235,357,245,369,218.7C381.5,192,394,128,406,117.3C418.5,107,431,149,443,144C455.4,139,468,85,480,96C492.3,107,505,181,517,208C529.2,235,542,213,554,197.3C566.2,181,578,171,591,144C603.1,117,615,75,628,80C640,85,652,139,665,181.3C676.9,224,689,256,702,229.3C713.8,203,726,117,738,122.7C750.8,128,763,224,775,250.7C787.7,277,800,235,812,192C824.6,149,837,107,849,106.7C861.5,107,874,149,886,160C898.5,171,911,149,923,149.3C935.4,149,948,171,960,181.3C972.3,192,985,192,997,208C1009.2,224,1022,256,1034,234.7C1046.2,213,1058,139,1071,144C1083.1,149,1095,235,1108,256C1120,277,1132,235,1145,202.7C1156.9,171,1169,149,1182,138.7C1193.8,128,1206,128,1218,160C1230.8,192,1243,256,1255,256C1267.7,256,1280,192,1292,149.3C1304.6,107,1317,85,1329,112C1341.5,139,1354,213,1366,213.3C1378.5,213,1391,139,1403,133.3C1415.4,128,1428,192,1434,224L1440,256L1440,0L1433.8,0C1427.7,0,1415,0,1403,0C1390.8,0,1378,0,1366,0C1353.8,0,1342,0,1329,0C1316.9,0,1305,0,1292,0C1280,0,1268,0,1255,0C1243.1,0,1231,0,1218,0C1206.2,0,1194,0,1182,0C1169.2,0,1157,0,1145,0C1132.3,0,1120,0,1108,0C1095.4,0,1083,0,1071,0C1058.5,0,1046,0,1034,0C1021.5,0,1009,0,997,0C984.6,0,972,0,960,0C947.7,0,935,0,923,0C910.8,0,898,0,886,0C873.8,0,862,0,849,0C836.9,0,825,0,812,0C800,0,788,0,775,0C763.1,0,751,0,738,0C726.2,0,714,0,702,0C689.2,0,677,0,665,0C652.3,0,640,0,628,0C615.4,0,603,0,591,0C578.5,0,566,0,554,0C541.5,0,529,0,517,0C504.6,0,492,0,480,0C467.7,0,455,0,443,0C430.8,0,418,0,406,0C393.8,0,382,0,369,0C356.9,0,345,0,332,0C320,0,308,0,295,0C283.1,0,271,0,258,0C246.2,0,234,0,222,0C209.2,0,197,0,185,0C172.3,0,160,0,148,0C135.4,0,123,0,111,0C98.5,0,86,0,74,0C61.5,0,49,0,37,0C24.6,0,12,0,6,0L0,0Z"
//                   ></path>
//                 </svg>
//               </div>
//             </m.div>
//           </div>

//           {/* Print Button */}
//           <div className="flex justify-center py-8 -mt-7">
//             <button
//               onClick={() => window.print()}
//               className="bg-black text-white py-2 px-4 rounded flex items-center gap-2"
//             >
//               <HiPrinter className="w-5 h-5" />
//               Print
//             </button>
//           </div>

//           {/* Next Order Button */}
//           <m.div
//             initial={{ y: "100%" }}
//             animate={{ y: "0%" }}
//             transition={{ duration: 0.3, ease: "easeOut" }}
//             className="flex justify-center py-8 -mt-7"
//           >
//             <button
//               onClick={() => router.push("/")}
//               className="flex p-4 justify-center text-center font-bold font-mono text-2xl bg-black text-white active:text-gray-300 active:bg-gray-800 hover:scale-110 active:scale-110 rounded-full transition-all focus:outline-none"
//             >
//               <span className="bg-white rounded-full p-2 transition-all">
//                 <TbPlayerTrackNextFilled className="h-7 w-7 text-black" />
//               </span>
//             </button>
//           </m.div>
//         </div>
//       </div>
//     </>
//   );
// };

"use client";

import { useEffect, useState } from "react";
import { HiPrinter } from "react-icons/hi";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export const Done = ({ checkout, discountAmount, totalPrice, onNewOrder }) => {
  const [dateOrder, setDateOrder] = useState(null);
  const [numbers, setNumbers] = useState({ table: [], order: [] });

  useEffect(() => {
    const generateRandomNumbersOrder = (x) =>
      Array.from({ length: x }, () => Math.floor(Math.random() * 10));

    setDateOrder(new Date());
    setNumbers({
      table: generateRandomNumbersOrder(2),
      order: generateRandomNumbersOrder(6),
    });
  }, []);

  useEffect(() => {
    if (numbers.order.length > 0 && numbers.table.length > 0 && dateOrder) {
      const billNo = `#001${numbers.order.join("")}`;
      const tableNo = `#0${numbers.table.join("")}`;

      const payload = {
        order: checkout.order,
        total: totalPrice.amount,
        discount: (discountAmount / 100) * totalPrice.amount,
        paymentMethod: checkout.payment,
        billNo,
        tableNo,
        date: dateOrder.toLocaleString("en-IN"),
        grandTotal: totalPrice.discounted,
        createdAt: new Date().toISOString(),
      };

      fetch(`${API_BASE}/print`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => console.log("✅ Receipt sent:", data))
        .catch((err) => console.error("❌ Print error:", err));
    }
  }, [
    numbers.order,
    numbers.table,
    dateOrder,
    checkout.order,
    checkout.payment,
    totalPrice.amount,
    totalPrice.discounted,
    discountAmount
  ]);

  if (!dateOrder || numbers.order.length === 0 || numbers.table.length === 0)
    return <div className="text-center py-10">⏳ Preparing receipt...</div>;

  const billNo = `#001${numbers.order.join("")}`;
  const tableNo = `#0${numbers.table.join("")}`;

  const formattedDate = dateOrder.toLocaleDateString("en-IN");
  const formattedTime = dateOrder.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <style>{`
        @media print {
          @page { size: 80mm auto; margin: 0; }
          html, body { margin: 0; padding: 0; background: white; }
          .receipt { width: 72mm; font-size: 12px; margin: 0 auto; }
          .receipt * { background: white !important; color: black !important; box-shadow: none !important; }
          .no-print { display: none !important; }
          table { width: 100%; border-collapse: collapse; }
          td, th { padding: 2px 0; font-size: 12px; line-height: 1.2; }
        }
      `}</style>

      <div className="flex justify-center font-mono">
        <div className="receipt bg-white text-black">
          <div className="flex justify-center py-2">
            <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center">
              <Image src="/nkc.png" width={80} height={80} alt="Logo" />
            </div>
          </div>

          <div className="text-center text-sm leading-tight">
            <p className="font-bold text-base">NELLAI KARUPATTI COFFEE</p>
            <p>North Pradakshanam Road,</p>
            <p>Karur, TAMIL NADU</p>
            <p>PHONE : 7010452495</p>
            <p>GSTIN : 33GGTPS6619J1ZJ</p>
          </div>

          <div className="px-2 mt-2 text-sm">
            <div className="flex justify-between">
              <span>Bill No:</span>
              <span>{billNo}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment:</span>
              <span className="capitalize">{checkout.payment}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>
                {formattedDate} | {formattedTime}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Counter:</span>
              <span>01</span>
            </div>
          </div>

          <div className="border-t border-black my-2" />

          <div className="px-2 text-sm">
            <p className="text-center font-semibold mb-1">Order Items</p>
            <table>
              <tbody>
                {checkout?.order.map((item, idx) => (
                  <tr key={idx}>
                    <td className="w-1/2 align-top">
                      {item.name}
                      {item.notes && (
                        <p className="text-xs">Note: {item.notes}</p>
                      )}
                    </td>
                    <td className="w-1/4 text-right align-top">{item.amount}x</td>
                    <td className="w-1/4 text-right align-top">
                      ₹{(item.price * item.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-black my-2" />

          <div className="px-2 text-sm">
            <table className="w-full font-semibold">
              <tbody>
                <tr>
                  <td>Total</td>
                  <td className="text-right">₹{totalPrice.amount.toFixed(2)}</td>
                </tr>
                {discountAmount > 0 && (
                  <tr className="text-green-700">
                    <td>Discount</td>
                    <td className="text-right">
                      - ₹{((discountAmount / 100) * totalPrice.amount).toFixed(2)}
                    </td>
                  </tr>
                )}
                <tr className="border-t border-black">
                  <td>Grand Total</td>
                  <td className="text-right">
                    ₹{totalPrice.discounted.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-center font-bold text-sm py-2">
            ==== THANK YOU ====
          </div>

          <div className="no-print flex justify-center gap-4 py-4">
            <button
              onClick={() => window.print()}
              className="bg-black text-white px-4 py-1 rounded flex items-center gap-1"
            >
              <HiPrinter className="h-5 w-5" /> Print
            </button>

            <button
              onClick={() => {
                if (typeof onNewOrder === "function") onNewOrder();
              }}
              className="bg-black text-white px-4 py-1 rounded flex items-center gap-1"
            >
              <TbPlayerTrackNextFilled className="h-5 w-5" /> New Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
};