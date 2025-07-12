"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  HiReceiptRefund,
  HiTrash,
  HiPrinter,
} from "react-icons/hi";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export default function ViewReceipts() {
  const router = useRouter();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

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
        alert("❌ Delete failed.");
      }
    } catch {
      alert("❌ Error deleting receipt.");
    }
  };

  const printReceipt = (receipt) => {
    const win = window.open("", "", "width=400,height=600");
    win.document.write(`
      <html>
      <head>
        <title>Receipt ${receipt.billNo}</title>
        <style>
          @media print {
            @page { size: 80mm auto; margin: 0; }
            body { margin: 0; font-family: monospace; }
            .receipt { width: 72mm; margin: auto; padding: 10px; }
            table { width: 100%; border-collapse: collapse; }
            td, th { font-size: 12px; padding: 2px 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div style="text-align:center;">
            <img src="/Logo.png" width="80" height="80" style="border-radius:50%;" alt="Logo" />
            <h3 style="margin: 5px 0;">NELLAI KARUPATTI COFFEE</h3>
            <p>North Pradakshanam Road,<br />Karur, TAMIL NADU<br />PHONE : 7010452495<br />GSTIN : 33GGTPS6619J1ZJ</p>
          </div>

          <div style="margin-top:10px; font-size: 12px;">
            <div style="display:flex; justify-content:space-between;"><span>Bill No:</span><span>${receipt.billNo}</span></div>
            <div style="display:flex; justify-content:space-between;"><span>Payment:</span><span>${receipt.paymentMethod}</span></div>
            <div style="display:flex; justify-content:space-between;"><span>Date:</span><span>${receipt.date}</span></div>
            <div style="display:flex; justify-content:space-between;"><span>Counter:</span><span>01</span></div>
          </div>

          <hr />
          <p style="text-align:center; font-weight:bold;">Order Items</p>
          <table>
            <tbody>
              ${receipt.order
                .map(
                  (item) => `
                  <tr>
                    <td>${item.name}</td>
                    <td style="text-align:right;">${item.amount}x</td>
                    <td style="text-align:right;">₹${(item.price * item.amount).toFixed(2)}</td>
                  </tr>
                  ${item.notes ? `<tr><td colspan="3">Note: ${item.notes}</td></tr>` : ""}`
                )
                .join("")}
            </tbody>
          </table>
          <hr />
          <table>
            <tbody>
              <tr><td>Total</td><td style="text-align:right;" colspan="2">₹${receipt.total.toFixed(2)}</td></tr>
              <tr><td>Discount</td><td style="text-align:right;" colspan="2">- ₹${receipt.discount.toFixed(2)}</td></tr>
              <tr style="border-top:1px solid #000;"><td>Grand Total</td><td style="text-align:right;" colspan="2">₹${receipt.grandTotal.toFixed(2)}</td></tr>
            </tbody>
          </table>

          <p style="text-align:center; font-weight:bold; margin-top:10px;">==== THANK YOU ====</p>
        </div>
      </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="w-full flex justify-center font-mono bg-white min-h-screen p-4">
      <div className="w-full max-w-md">
        <div className="mb-4 flex items-center gap-2">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-black transition"
          >
            <ArrowLeftIcon className="h-5 w-5" /> Back to Order
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <HiReceiptRefund className="text-green-600 w-6 h-6" /> All Receipts
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading receipts...</p>
        ) : receipts.length === 0 ? (
          <p className="text-center text-gray-500">No receipts found.</p>
        ) : (
          receipts.map((receipt, idx) => (
            <div key={idx} className="bg-white p-4 rounded-lg shadow-md mb-4 border">
              <div className="bg-green-600 text-white font-bold text-center rounded px-2 py-1 mb-3">
                Receipt #{receipt.billNo}
              </div>
              <div className="text-sm text-gray-800 space-y-1">
                <p><strong>📅 Date:</strong> {receipt.date}</p>
                <p><strong>💳 Payment:</strong> {receipt.paymentMethod}</p>
                <p><strong>💰 Total:</strong> ₹{receipt.grandTotal.toFixed(2)}</p>
              </div>
              <div className="mt-3">
                <p className="font-semibold">🧃 Items:</p>
                <ul className="text-sm text-gray-700 list-disc list-inside">
                  {receipt.order?.map((item, i) => (
                    <li key={i}>{item.name} × {item.amount} — ₹{(item.price * item.amount).toFixed(2)}</li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => deleteReceipt(receipt.id, receipt.billNo)}
                  className="flex items-center px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <HiTrash className="mr-1" /> Delete
                </button>
                <button
                  onClick={() => printReceipt(receipt)}
                  className="flex items-center px-3 py-1 bg-black text-white rounded hover:bg-gray-800"
                >
                  <HiPrinter className="mr-1" /> Print
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}



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

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

// export default function ViewReceipts() {
//   const router = useRouter();
//   const [receipts, setReceipts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [business, setBusiness] = useState(null);

//   useEffect(() => {
//     fetch(`${API_BASE}/receipts`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (Array.isArray(data)) setReceipts(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("❌ Failed to load receipts:", err);
//         setLoading(false);
//       });

//     fetch(`${API_BASE}/business-info`)
//       .then((res) => res.json())
//       .then(setBusiness)
//       .catch((err) => console.error("❌ Failed to fetch business info:", err));
//   }, []);

//   const deleteReceipt = async (id, billNo) => {
//     if (!confirm(`Delete receipt ${billNo}?`)) return;
//     try {
//       const res = await fetch(`${API_BASE}/receipts/delete/${id}`, {
//         method: "DELETE",
//       });
//       if (res.ok) {
//         setReceipts((prev) => prev.filter((r) => r.id !== id));
//         alert("✅ Deleted successfully!");
//       } else {
//         alert("❌ Delete failed.");
//       }
//     } catch {
//       alert("❌ Error deleting receipt.");
//     }
//   };

//   const printReceipt = (receipt) => {
//     const win = window.open("", "", "width=400,height=600");
//     win.document.write(`
//       <html><head><title>Receipt ${receipt.billNo}</title></head>
//       <body style="font-family: monospace; text-align: center;">
//         <img src="${business?.logoUrl}" alt="logo" style="width:100px;height:100px;border-radius:50%;" />
//         <h2>${business?.name}</h2>
//         <p>${business?.addressLine1}</p>
//         <p>${business?.addressLine2}</p>
//         <p>Phone: ${business?.phone}</p>
//         <p>GST: ${business?.gst}</p>
//         <hr/>
//         <p><strong>Bill No:</strong> ${receipt.billNo}</p>
//         <p><strong>Date:</strong> ${receipt.date}</p>
//         <p><strong>Payment:</strong> ${receipt.paymentMethod}</p>
//         <p><strong>Table:</strong> ${receipt.tableNo}</p>
//         <hr/>
//         <ul style="list-style:none;padding:0;">
//         ${receipt.order
//           .map(
//             (item) =>
//               `<li>${item.name} × ${item.amount} — ₹${(
//                 item.price * item.amount
//               ).toFixed(2)}</li>`
//           )
//           .join("")}
//         </ul>
//         <hr/>
//         <p><strong>Total:</strong> ₹${receipt.grandTotal.toFixed(2)}</p>
//         <p>==== THANK YOU ====</p>
//       </body></html>
//     `);
//     win.document.close();
//     win.print();
//   };

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

//         {loading ? (
//           <p className="text-center text-gray-500">Loading receipts...</p>
//         ) : receipts.length === 0 ? (
//           <p className="text-center text-gray-500">No receipts found.</p>
//         ) : (
//           receipts.map((receipt) => (
//             <m.div
//               key={receipt.id}
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//               className="bg-white p-4 rounded-lg shadow-md mb-4 border"
//             >
//               <div className="bg-green-600 text-white font-bold text-center rounded px-2 py-1 mb-3">
//                 Receipt #{receipt.billNo}
//               </div>

//               <div className="text-sm text-gray-800 space-y-1">
//                 <p>
//                   <strong>Date:</strong> {receipt.date}
//                 </p>
//                 <p>
//                   <strong>Payment:</strong> {receipt.paymentMethod}
//                 </p>
//                 <p>
//                   <strong>Table:</strong> {receipt.tableNo}
//                 </p>
//                 <p>
//                   <strong>Total:</strong> ₹{receipt.grandTotal.toFixed(2)}
//                 </p>
//               </div>

//               <div className="mt-3">
//                 <p className="font-semibold">Items:</p>
//                 <ul className="text-sm text-gray-700 list-disc list-inside">
//                   {receipt.order.map((item, i) => (
//                     <li key={i}>
//                       {item.name} × {item.amount} — ₹{(
//                         item.price * item.amount
//                       ).toFixed(2)}
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <div className="flex justify-end gap-2 mt-4">
//                 <button
//                   onClick={() => deleteReceipt(receipt.id, receipt.billNo)}
//                   className="flex items-center px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//                 >
//                   <HiTrash className="mr-1" /> Delete
//                 </button>
//                 <button
//                   onClick={() => printReceipt(receipt)}
//                   className="flex items-center px-3 py-1 bg-black text-white rounded hover:bg-gray-800"
//                 >
//                   <HiPrinter className="mr-1" /> Print
//                 </button>
//               </div>
//             </m.div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }
