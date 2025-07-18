"use client";

import { useEffect, useState } from "react";
import Header from "./header";
import DailyExpenseTracker from "./DailyExpenseTracker"; // ✅ Import expense tracker

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export default function DailyReport({ onBack = () => {}, allMenuItems = [], setCurrentPage }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [salesData, setSalesData] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState({});
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchReport = async () => {
    if (!selectedDate) return;

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

  useEffect(() => {
    if (selectedDate) {
      fetchReport();
    }
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

      <div className="p-4 mt-16">
        {/* ==== Date Picker ==== */}
        <div className="text-center mb-6">
          <label className="mr-2 font-semibold">🗓️ Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border px-3 py-1 rounded-md border-gray-300 shadow-sm"
          />
        </div>

        {loading && (
          <div className="text-center text-gray-500 mb-4">⏳ Loading daily report...</div>
        )}

        {!loading && notFound && (
          <div className="text-center text-red-500 font-medium">
            📭 No sales or expense data found for {selectedDate}.
          </div>
        )}

        {/* ==== Summary Cards ==== */}
        {!loading && selectedDate && !notFound && (
          <>
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

            {/* ==== Payments In ==== */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-2">💳 Payments Received</h3>
              {Object.keys(payments || {}).length === 0 ? (
                <p className="text-sm text-gray-400">No payment methods found.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(payments).map(([method, amount], idx) => (
                    <div key={idx} className="border p-3 rounded bg-blue-50 text-sm shadow-sm">
                      <div className="font-medium">{method}</div>
                      <div>₹{amount.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ==== Daily Expense Tracker ==== */}
            <DailyExpenseTracker selectedDate={selectedDate} />

            {/* ==== Product Sales Summary ==== */}
            <div className="mt-10">
              <h3 className="text-lg font-bold text-gray-800 mb-3">📦 Product Sales</h3>
              {salesData.length === 0 ? (
                <p className="text-sm text-gray-400">No products sold on this day.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {salesData.map((item, idx) => (
                    <div key={idx} className="border rounded p-4 bg-white shadow-sm text-sm">
                      <h4 className="font-bold">{item.name}</h4>
                      <p>Sold: {item.soldQty}</p>
                      <p>Sales: ₹{item.totalSales.toFixed(2)}</p>
                      <p>Cost: ₹{item.totalCost.toFixed(2)}</p>
                      <p className={item.profit >= 0 ? "text-green-600" : "text-red-500"}>
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

// ==== Summary Box UI ====
function SummaryCard({ title, value, color = "gray" }) {
  const colors = {
    green: "bg-green-100 text-green-800 border-green-200",
    red: "bg-red-100 text-red-800 border-red-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    gray: "bg-gray-100 text-gray-800 border-gray-300",
  };

  return (
    <div className={`p-4 rounded-lg shadow-sm border text-center ${colors[color]}`}>
      <h4 className="text-sm font-medium">{title}</h4>
      <p className="text-lg font-bold mt-1">₹{value.toFixed(2)}</p>
    </div>
  );
}