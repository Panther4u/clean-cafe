"use client";

import { useEffect, useState } from "react";
import Header from "./header";
import DailyExpenseTracker from "./DailyExpenseTracker";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export default function DailyReport({ onBack = () => {}, allMenuItems = [], setCurrentPage }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [salesData, setSalesData] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState({});
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (!selectedDate) return;

    const fetchReport = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        const [salesRes, expenseRes, receiptsRes] = await Promise.all([
          fetch(`${API_BASE}/sales-summary-by-date?date=${selectedDate}`),
          fetch(`${API_BASE}/expenses-by-date?date=${selectedDate}`),
          fetch(`${API_BASE}/receipts`),
        ]);

        const sales = await salesRes.json();
        const expenseList = await expenseRes.json();
        const receipts = (await receiptsRes.json()).filter((r) => r.date === selectedDate);

        const paymentTotals = receipts.reduce((acc, rec) => {
          const method = rec.paymentMethod || "Other";
          acc[method] = (acc[method] || 0) + (rec.grandTotal || 0);
          return acc;
        }, {});

        setSalesData(sales || []);
        setExpenses(expenseList || []);
        setPayments(paymentTotals || {});

        if ((!sales || sales.length === 0) && (!expenseList || expenseList.length === 0)) {
          setNotFound(true);
        }
      } catch (error) {
        console.error("❌ Failed to fetch report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [selectedDate]);

  // Totals
  const totalSales = salesData.reduce((sum, i) => sum + i.totalSales, 0);
  const totalCost = salesData.reduce((sum, i) => sum + i.totalCost, 0);
  const grossProfit = totalSales - totalCost;
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const netProfit = grossProfit - totalExpenses;

  return (
    <div className="max-w-5xl mx-auto w-full">
      {/* ==== Header ==== */}
      <Header
        page="Daily Report"
        onClickOrder={onBack}
        onClickFavorite={() => {}}
        onClickCart={() => {}}
        setCurrentPage={setCurrentPage}
        searchText={searchText}
        setSearchText={setSearchText}
        totalPrice={0}
        allMenuItems={allMenuItems}
      />

      <div className="p-4 pt-20">
        {/* ==== Date Picker ==== */}
        <div className="text-center mb-6">
          <label className="mr-2 font-semibold  text-black">🗓️ Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border px-3 py-1 rounded-md border-gray-300 shadow-sm  text-black"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center text-gray-500 mb-4">
            ⏳ Loading daily report...
          </div>
        )}

        {/* Not found */}
        {!loading && notFound && (
          <div className="text-center text-red-500 font-medium">
            📭 No sales or expense data found for {selectedDate}.
          </div>
        )}

        {/* ==== Report Summary ==== */}
        {!loading && selectedDate && !notFound && (
          <>
            {/* Totals */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <SummaryCard title="Total Sales" value={totalSales} color="green" />
              <SummaryCard title="Total Cost" value={totalCost} color="yellow" />
              <SummaryCard title="Expenses" value={totalExpenses} color="red" />
              <SummaryCard
                title="Net Profit"
                value={netProfit}
                color={netProfit >= 0 ? "green" : "red"}
              />
            </div>

            {/* Payments */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-2">💳 Payments Received</h3>
              {Object.keys(payments || {}).length === 0 ? (
                <p className="text-sm text-gray-400">No payment methods found.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(payments).map(([method, amount], idx) => (
                    <div
                      key={idx}
                      className="border p-3 rounded bg-blue-50 text-sm shadow-sm"
                    >
                      <div className="font-medium text-black">{method}</div>
                      <div className="text-black">₹{amount.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Sales Summary */}
            <div className="mt-10">
              <h3 className="text-lg font-bold text-gray-800 mb-3">📦 Product Sales</h3>
              {salesData.length === 0 ? (
                <p className="text-sm text-gray-400">No products sold on this day.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {salesData.map((item, idx) => (
                    <div
                      key={idx}
                      className="border rounded p-4 bg-white shadow-sm text-sm"
                    >
                      <h4 className="font-bold text-black">{item.name}</h4>
                      <p className="text-black">Sold: {item.soldQty}</p>
                      <p className="text-black">Sales: ₹{item.totalSales.toFixed(2)}</p>
                      <p className="text-black">Cost: ₹{item.totalCost.toFixed(2)}</p>
                      <p className="text-black">
                        Profit: ₹{item.profit.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ✅ Reusable Summary Card Component
function SummaryCard({ title, value, color = "gray" }) {
  const colors = {
    green: "bg-green-100 text-black border-green-200",
    red: "bg-red-100 text-black border-red-200",
    yellow: "bg-yellow-100 text-black border-yellow-200",
    gray: "bg-gray-100 text-black border-gray-300",
  };

  return (
    <div
      className={`p-4 rounded-lg shadow-sm border text-center ${colors[color]}`}
    >
      <h4 className="text-sm font-medium">{title}</h4>
      <p className="text-lg font-bold mt-1">₹{value.toFixed(2)}</p>
    </div>
  );
}
