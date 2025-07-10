"use client";
import { useEffect, useState } from "react";
import { HiReceiptRefund, HiPencil, HiTrash, HiPrinter } from "react-icons/hi";
import { motion as m } from "framer-motion";

export default function ViewReceipts() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/receipts")
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Fetched receipts:", data);
        setReceipts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to load receipts:", err);
        setLoading(false);
      });
  }, []);

  const deleteReceipt = async (billNo) => {
    if (!confirm(`Delete receipt ${billNo}?`)) return;
    try {
      const res = await fetch(`http://localhost:4000/receipts/${billNo}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (res.ok) {
        alert("Deleted successfully!");
        setReceipts((prev) => prev.filter((r) => r.billNo !== billNo));
      } else {
        alert("Delete failed: " + result.error);
      }
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

  const printReceipt = (receipt) => {
    const printable = window.open("", "", "width=400,height=600");
    printable.document.write(`
      <html>
        <head><title>Receipt ${receipt.billNo}</title></head>
        <body style="font-family: monospace;">
          <h2>Receipt ${receipt.billNo}</h2>
          <p>Date: ${receipt.date}</p>
          <p>Payment: ${receipt.paymentMethod}</p>
          <p>Table: ${receipt.tableNo}</p>
          <p>Total: Rp ${receipt.grandTotal.toLocaleString("id-ID")}</p>
          <hr />
          <ul>
            ${receipt.order
              .map(
                (item) =>
                  `<li>${item.name} × ${item.amount} — Rp ${(
                    item.price * item.amount
                  ).toLocaleString("id-ID")}</li>`
              )
              .join("")}
          </ul>
          <hr />
          <p style="text-align:center;">Printed from POS System</p>
        </body>
      </html>
    `);
    printable.document.close();
    printable.print();
  };

  const editReceipt = (billNo) => {
    alert(`📝 Edit function triggered for Bill No: ${billNo}`);
    // TODO: Navigate to /edit/[billNo] page or open modal
  };

  return (
    <div className="w-full flex justify-center font-mono bg-gray-100 min-h-screen p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <HiReceiptRefund className="text-green-600 w-6 h-6" />
          All Receipts
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading receipts...</p>
        ) : receipts.length === 0 ? (
          <p className="text-center text-gray-500">No receipts found.</p>
        ) : (
          receipts.map((receipt, idx) => (
            <m.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="bg-white p-4 rounded-lg shadow-md mb-4"
            >
              <div className="bg-green-600 text-white font-bold text-center rounded px-2 py-1 mb-3">
                Receipt #{receipt.billNo}
              </div>

              <div className="text-sm text-gray-800 space-y-1">
                <p><strong>📅 Date:</strong> {receipt.date}</p>
                <p><strong>💳 Payment:</strong> {receipt.paymentMethod}</p>
                <p><strong>🍽️ Table:</strong> {receipt.tableNo}</p>
                <p><strong>💰 Total:</strong> Rp {receipt.grandTotal.toLocaleString("id-ID")}</p>
              </div>

              <div className="mt-3">
                <p className="font-semibold">🧃 Items:</p>
                <ul className="text-sm text-gray-700 list-disc list-inside">
                  {receipt.order?.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      {item.name} × {item.amount} — Rp {(item.price * item.amount).toLocaleString("id-ID")}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => editReceipt(receipt.billNo)}
                  className="flex items-center px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                >
                  <HiPencil className="mr-1" /> Edit
                </button>
                <button
                  onClick={() => deleteReceipt(receipt.billNo)}
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
            </m.div>
          ))
        )}
      </div>
    </div>
  );
}
