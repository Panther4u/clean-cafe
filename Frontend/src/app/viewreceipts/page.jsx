// "use client";
// import { useEffect, useState } from "react";
// import {
//   HiReceiptRefund,
//   HiPencil,
//   HiTrash,
//   HiPrinter,
//   HiPlus,
// } from "react-icons/hi";
// import { motion as m } from "framer-motion";
// import { ArrowLeftIcon } from "@heroicons/react/24/solid";
// import { useRouter } from "next/navigation";
// import Image from "next/image";

// // ✅ Fallback if env isn't available in development
// const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

// export default function ViewReceipts() {
//   const router = useRouter();
//   const [receipts, setReceipts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingId, setEditingId] = useState(null);
//   const [editOrder, setEditOrder] = useState([]);
//   const [menu, setMenu] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     fetch(`https://sri-kandhan-cafe.onrender.com/receipts`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (Array.isArray(data)) setReceipts(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("❌ Failed to load receipts:", err);
//         setLoading(false);
//       });

//     fetch(`${API_BASE}/menu`)
//       .then((res) => res.json())
//       .then(setMenu)
//       .catch((err) => console.error("❌ Menu fetch failed:", err));
//   }, []);

//   const deleteReceipt = async (id, billNo) => {
//     if (!confirm(`Delete receipt ${billNo}?`)) return;
//     try {
//       const res = await fetch(`https://sri-kandhan-cafe.onrender.com/receipts/delete/${id}`, {
//         method: "DELETE",
//       });
//       const result = await res.json();
//       if (res.ok) {
//         setReceipts((prev) => prev.filter((r) => r.id !== id));
//         alert("✅ Deleted successfully!");
//       } else {
//         alert("❌ Delete failed: " + result.error);
//       }
//     } catch (err) {
//       alert("❌ Error deleting receipt.");
//     }
//   };

//   const calculateTotal = (order) => {
//     return order.reduce((sum, item) => sum + item.price * item.amount, 0);
//   };

//   const editReceipt = (receipt) => {
//     setEditingId(receipt.id);
//     setEditOrder([...receipt.order]);
//   };

//   const saveEditedReceipt = async (receiptId) => {
//     const updatedTotal = calculateTotal(editOrder);
//     try {
//       const res = await fetch(`https://sri-kandhan-cafe.onrender.com/receipts/update/${receiptId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ order: editOrder, grandTotal: updatedTotal }),
//       });
//       if (!res.ok) throw new Error("Update failed");
//       alert("✅ Receipt updated!");
//       setReceipts((prev) =>
//         prev.map((r) =>
//           r.id === receiptId
//             ? { ...r, order: editOrder, grandTotal: updatedTotal }
//             : r
//         )
//       );
//       setEditingId(null);
//     } catch (err) {
//       alert("❌ Failed to save changes.");
//     }
//   };

//   const printReceipt = (receipt) => {
//     const printable = window.open("", "", "width=400,height=600");
//     printable.document.write(`
//       <html><head><title>Receipt ${receipt.billNo}</title></head>
//       <body style="font-family: monospace;">
//       <h2>Receipt ${receipt.billNo}</h2>
//       <p>Date: ${receipt.date}</p>
//       <p>Payment: ${receipt.paymentMethod}</p>
//       <p>Table: ${receipt.tableNo}</p>
//       <p>Total: ₹ ${receipt.grandTotal.toLocaleString("id-ID")}</p>
//       <hr /><ul>
//       ${receipt.order
//         .map(
//           (item) =>
//             `<li>${item.name} × ${item.amount} — ₹${(
//               item.price * item.amount
//             ).toLocaleString("id-ID")}</li>`
//         )
//         .join("")}
//       </ul><hr /><p style="text-align:center;">Printed from POS System</p>
//       </body></html>`);
//     printable.document.close();
//     printable.print();
//   };

//   const addItemToEditOrder = (item) => {
//     const existing = editOrder.find((i) => i.name === item.name);
//     if (existing) {
//       setEditOrder((prev) =>
//         prev.map((i) =>
//           i.name === item.name ? { ...i, amount: i.amount + 1 } : i
//         )
//       );
//     } else {
//       setEditOrder((prev) => [...prev, { ...item, amount: 1 }]);
//     }
//   };

//   const filteredMenu = menu.filter((item) =>
//     item.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="w-full flex justify-center font-mono bg-white min-h-screen p-4">
//       <div className="w-full max-w-md">
//         <div className="mb-4 flex items-center gap-2">
//           <button
//             onClick={() => router.push("/")}
//             className="flex items-center gap-1 text-sm text-gray-600 hover:text-black transition"
//           >
//             <ArrowLeftIcon className="h-5 w-5" /> Back to Order
//           </button>
//         </div>

//         <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
//           <HiReceiptRefund className="text-green-600 w-6 h-6" /> All Receipts
//         </h1>

//         {editingId && (
//           <div className="mb-4 p-3 border rounded bg-gray-50 shadow-sm">
//             <h2 className="text-lg font-semibold mb-2">Add Item</h2>
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search menu..."
//               className="w-full p-2 border rounded mb-2"
//             />
//             <ul className="max-h-40 overflow-y-auto bg-white text-black rounded-md border">
//               {filteredMenu.map((item, i) => (
//                 <li
//                   key={i}
//                   onClick={() => addItemToEditOrder(item)}
//                   className="cursor-pointer px-2 py-1 hover:bg-gray-200 flex items-center gap-2"
//                 >
//                   <div className="w-8 h-8 relative rounded-full overflow-hidden">
//                     <Image
//                       src={item.image || "/placeholder.png"}
//                       alt={item.name}
//                       fill
//                       className="object-cover"
//                     />
//                   </div>
//                   <span className="text-sm font-medium">{item.name}</span>
//                   <span className="ml-auto text-sm text-gray-600">
//                     ₹{item.price}
//                   </span>
//                   <HiPlus className="text-gray-700" />
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {loading ? (
//           <p className="text-center text-gray-500">Loading receipts...</p>
//         ) : receipts.length === 0 ? (
//           <p className="text-center text-gray-500">No receipts found.</p>
//         ) : (
//           receipts.map((receipt, idx) => (
//             <m.div
//               key={idx}
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3, delay: idx * 0.1 }}
//               className="bg-white p-4 rounded-lg shadow-md mb-4 border"
//             >
//               <div className="bg-green-600 text-white font-bold text-center rounded px-2 py-1 mb-3">
//                 Receipt #{receipt.billNo}
//               </div>

//               <div className="text-sm text-gray-800 space-y-1">
//                 <p>
//                   <strong>📅 Date:</strong> {receipt.date}
//                 </p>
//                 <p>
//                   <strong>💳 Payment:</strong> {receipt.paymentMethod}
//                 </p>
//                 <p>
//                   <strong>🍽️ Table:</strong> {receipt.tableNo}
//                 </p>
//                 <p>
//                   <strong>💰 Total:</strong> ₹{" "}
//                   {receipt.grandTotal.toLocaleString("id-ID")}
//                 </p>
//               </div>

//               <div className="mt-3">
//                 <p className="font-semibold">🧃 Items:</p>
//                 <ul className="text-sm text-gray-700 list-disc list-inside">
//                   {(editingId === receipt.id ? editOrder : receipt.order)?.map(
//                     (item, itemIdx) => (
//                       <li
//                         key={itemIdx}
//                         className="flex justify-between items-center"
//                       >
//                         <span>
//                           {item.name} × {item.amount}
//                         </span>
//                         <span className="text-gray-500 text-xs">
//                           ₹{(item.price * item.amount).toFixed(2)}
//                         </span>
//                       </li>
//                     )
//                   )}
//                 </ul>
//               </div>

//               <div className="flex justify-end gap-2 mt-4">
//                 {editingId === receipt.id ? (
//                   <>
//                     <button
//                       onClick={() => saveEditedReceipt(receipt.id)}
//                       className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
//                     >
//                       Save
//                     </button>
//                     <button
//                       onClick={() => setEditingId(null)}
//                       className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
//                     >
//                       Cancel
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <button
//                       onClick={() => editReceipt(receipt)}
//                       className="flex items-center px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
//                     >
//                       <HiPencil className="mr-1" /> Edit
//                     </button>
//                     <button
//                       onClick={() => deleteReceipt(receipt.id, receipt.billNo)}
//                       className="flex items-center px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//                     >
//                       <HiTrash className="mr-1" /> Delete
//                     </button>
//                     <button
//                       onClick={() => printReceipt(receipt)}
//                       className="flex items-center px-3 py-1 bg-black text-white rounded hover:bg-gray-800"
//                     >
//                       <HiPrinter className="mr-1" /> Print
//                     </button>
//                   </>
//                 )}
//               </div>
//             </m.div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }




// ✅ Full working code for ViewReceipts with working item search and in-place edit scroll

"use client";

import { useEffect, useState, useRef } from "react";
import {
  HiReceiptRefund,
  HiPencil,
  HiTrash,
  HiPrinter,
  HiPlus,
} from "react-icons/hi";
import { motion as m } from "framer-motion";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://clean-cafe.onrender.com";

export default function ViewReceipts() {
  const router = useRouter();
  const editRef = useRef(null);

  const [authChecked, setAuthChecked] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editOrder, setEditOrder] = useState([]);
  const [menu, setMenu] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      router.replace("/admin-login");
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;

    fetch(`${API_BASE}/receipts`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setReceipts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to load receipts:", err);
        setLoading(false);
      });

    fetch("/items.json")
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data)
          ? data
          : typeof data === "object"
          ? Object.values(data.data || data)
          : [];
        setMenu(items);
      })
      .catch((err) => console.error("❌ Menu fetch failed:", err));
  }, [authChecked]);

  useEffect(() => {
    if (editingId && editRef.current) {
      setTimeout(() => {
        editRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [editingId]);

  const deleteReceipt = async (id, billNo) => {
    if (!confirm(`Delete receipt ${billNo}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/receipts/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setReceipts((prev) => prev.filter((r) => r.id !== id));
        alert("✅ Deleted successfully!");
      } else {
        const result = await res.json();
        alert("❌ Delete failed: " + result.error);
      }
    } catch (err) {
      alert("❌ Error deleting receipt.");
    }
  };

  const calculateTotal = (order) =>
    order.reduce((sum, item) => sum + item.price * item.amount, 0);

  const editReceipt = (receipt) => {
    setEditingId(receipt.id);
    setEditOrder([...receipt.order]);
  };

  const saveEditedReceipt = async (receiptId) => {
    const updatedTotal = calculateTotal(editOrder);
    try {
      const res = await fetch(`${API_BASE}/receipts/update/${receiptId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: editOrder, grandTotal: updatedTotal }),
      });
      if (!res.ok) throw new Error("Update failed");
      alert("✅ Receipt updated!");
      setReceipts((prev) =>
        prev.map((r) =>
          r.id === receiptId ? { ...r, order: editOrder, grandTotal: updatedTotal } : r
        )
      );
      setEditingId(null);
    } catch (err) {
      alert("❌ Failed to save changes.");
    }
  };

  const printReceipt = (receipt) => {
    const printable = window.open("", "", "width=400,height=600");
    printable.document.write(`
      <html><head><title>Receipt ${receipt.billNo}</title></head>
      <body style="font-family: monospace;">
      <h2>Receipt ${receipt.billNo}</h2>
      <p>Date: ${receipt.date}</p>
      <p>Payment: ${receipt.paymentMethod}</p>
      <p>Table: ${receipt.tableNo || "01"}</p>
      <p>Total: ₹ ${receipt.grandTotal.toLocaleString("id-ID")}</p>
      <hr /><ul>
      ${receipt.order
        .map(
          (item) =>
            `<li>${item.name} × ${item.amount} — ₹${(
              item.price * item.amount
            ).toLocaleString("id-ID")}</li>`
        )
        .join("")}
      </ul><hr /><p style="text-align:center;">Printed from POS System</p>
      </body></html>`);
    printable.document.close();
    printable.print();
  };

  const addItemToEditOrder = (item) => {
    const exists = editOrder.find((i) => i.name === item.name);
    if (exists) {
      setEditOrder((prev) =>
        prev.map((i) =>
          i.name === item.name ? { ...i, amount: i.amount + 1 } : i
        )
      );
    } else {
      setEditOrder((prev) => [...prev, { ...item, amount: 1 }]);
    }
  };

  const filteredMenu = menu.filter(
    (item) =>
      typeof item.name === "string" &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!authChecked) return <p className="p-4 text-center">Checking access...</p>;
  if (loading) return <p className="p-4 text-center">Loading receipts...</p>;

  return (
    <div className="w-full flex justify-center font-mono bg-white min-h-screen p-4">
      <div className="w-full max-w-md">
        <div className="mb-4 flex items-center gap-2">
          <button
            onClick={() => router.push("/pages/order")}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-black transition"
          >
            <ArrowLeftIcon className="h-5 w-5" /> Back to Order
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <HiReceiptRefund className="text-green-600 w-6 h-6" /> All Receipts
        </h1>

        {editingId && (
          <div
            ref={editRef}
            className="mb-4 border rounded bg-gray-50 shadow-sm p-3 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <h2 className="text-lg font-semibold mb-2">🧾 Receipt Items</h2>
              <ul className="space-y-2">
                {editOrder.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-white border rounded p-2"
                  >
                    <div>
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-gray-600">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setEditOrder((prev) =>
                            prev.map((i, idx) =>
                              idx === index && i.amount > 1 ? { ...i, amount: i.amount - 1 } : i
                            )
                          )
                        }
                        className="px-2 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                      >
                        -
                      </button>
                      <span className="text-sm">{item.amount}</span>
                      <button
                        onClick={() =>
                          setEditOrder((prev) =>
                            prev.map((i, idx) =>
                              idx === index ? { ...i, amount: i.amount + 1 } : i
                            )
                          )
                        }
                        className="px-2 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                      >
                        +
                      </button>
                      <button
                        onClick={() =>
                          setEditOrder((prev) =>
                            prev.filter((_, idx) => idx !== index)
                          )
                        }
                        className="text-red-500 hover:underline text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">🔍 Search Menu</h2>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search item by name..."
                className="w-full p-2 border rounded mb-2"
              />
              <ul className="max-h-80 overflow-y-auto bg-white text-black rounded-md border">
                {filteredMenu.map((item, i) => (
                  <li
                    key={i}
                    onClick={() => addItemToEditOrder(item)}
                    className="cursor-pointer px-2 py-2 hover:bg-gray-100 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 relative rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={item.imageUrl ? `${item.imageUrl}?tr=w-80,h-80,c-at_max` : "/placeholder.png"}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">₹{item.price}</p>
                    </div>
                    <HiPlus className="text-gray-700" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {receipts.map((receipt, idx) => (
          <m.div
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="bg-white p-4 rounded-lg shadow-md mb-4 border"
          >
            <div className="bg-green-600 text-white font-bold text-center rounded px-2 py-1 mb-3">
              Receipt #{receipt.billNo}
            </div>
            <div className="text-sm text-gray-800 space-y-1">
              <p><strong>📅 Date:</strong> {receipt.date}</p>
              <p><strong>⏰ Time:</strong> {receipt.time || "N/A"}</p>
              <p><strong>💳 Payment:</strong> {receipt.paymentMethod}</p>
              <p><strong>🍽️ Table:</strong> {receipt.tableNo || "01"}</p>
              <p><strong>💰 Total:</strong> ₹{receipt.grandTotal.toLocaleString("id-ID")}</p>
            </div>
            <div className="mt-3">
              <p className="font-semibold">🧳 Items:</p>
              <ul className="text-sm text-gray-700 list-disc list-inside">
                {(editingId === receipt.id ? editOrder : receipt.order)?.map(
                  (item, itemIdx) => (
                    <li key={itemIdx} className="flex justify-between items-center">
                      <span>{item.name} × {item.amount}</span>
                      <span className="text-gray-500 text-xs">
                        ₹{(item.price * item.amount).toFixed(2)}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              {editingId === receipt.id ? (
                <>
                  <button
                    onClick={() => saveEditedReceipt(receipt.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >Save</button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                  >Cancel</button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => editReceipt(receipt)}
                    className="flex items-center px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  ><HiPencil className="mr-1" /> Edit</button>
                  <button
                    onClick={() => deleteReceipt(receipt.id, receipt.billNo)}
                    className="flex items-center px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  ><HiTrash className="mr-1" /> Delete</button>
                  <button
                    onClick={() => printReceipt(receipt)}
                    className="flex items-center px-3 py-1 bg-black text-white rounded hover:bg-gray-800"
                  ><HiPrinter className="mr-1" /> Print</button>
                </>
              )}
            </div>
          </m.div>
        ))}
      </div>
    </div>
  );
}
