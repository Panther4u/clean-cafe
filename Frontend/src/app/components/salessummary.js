"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://clean-cafe.onrender.com";

export default function SalesSummary() {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState("");
  const [dailySummary, setDailySummary] = useState([]);
  const [dailyLoading, setDailyLoading] = useState(false);
  const [dailyError, setDailyError] = useState("");

  // Fetch all-time summary initially
  useEffect(() => {
    fetch(`${API_BASE}/sales-summary`)
      .then(res => res.json())
      .then(data => {
        setSummary(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ Failed to fetch sales summary:", err);
        setLoading(false);
      });
  }, []);

  // Fetch daily summary when date changes
  const fetchDailySummary = async (date) => {
    if (!date) return;
    setDailySummary([]);
    setDailyError("");
    setDailyLoading(true);

    try {
      const res = await fetch(`${API_BASE}/sales-summary-by-date?date=${date}`);
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setDailySummary(data);
      } else {
        setDailySummary([]);
        setDailyError(`😔 No sales data found for ${date}.`);
      }
    } catch (error) {
      console.error("❌ Failed to fetch daily summary:", error);
      setDailyError("Something went wrong. Please try again.");
    } finally {
      setDailyLoading(false);
    }
  };

  const totalSales = summary.reduce((sum, item) => sum + item.totalSales, 0);
  const totalCost = summary.reduce((sum, item) => sum + item.totalCost, 0);
  const totalProfit = summary.reduce((sum, item) => sum + item.profit, 0);

  const topItems = [...summary]
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 10);

  // -----------------------
  // Component Return
  // -----------------------

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">📊 Sales Summary</h1>

      {/* Date picker */}
      <div className="text-center mb-6">
        <label className="mr-2 font-medium">Select a Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            fetchDailySummary(e.target.value);
          }}
          className="border border-gray-300 rounded px-3 py-1 shadow-sm"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-green-100 border border-green-300 rounded-lg p-2 text-center shadow">
          <h2 className="text-sm font-medium text-green-800">Total Sales</h2>
          <p className="text-lg font-bold text-green-900 mt-1">₹{totalSales.toFixed(2)}</p>
        </div>
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-2 text-center shadow">
          <h2 className="text-sm font-medium text-yellow-800">Total Cost</h2>
          <p className="text-lg font-bold text-yellow-900 mt-1">₹{totalCost.toFixed(2)}</p>
        </div>
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-2 text-center shadow">
          <h2 className="text-sm font-medium text-blue-800">Total Profit</h2>
          <p className={`text-lg font-bold mt-1 ${totalProfit >= 0 ? "text-blue-900" : "text-red-600"}`}>
            ₹{totalProfit.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Profit Bar Chart */}
      <div className="w-full h-[300px] sm:h-[400px] mb-12">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topItems}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={100} />
            <Tooltip />
            <Bar dataKey="profit" fill="#3B82F6" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Section Title */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        🧾 All-Time Product Summary
      </h2>

      {/* All-time Summary */}
      {summary.length === 0 ? (
        <div className="text-center text-gray-500">No sales data found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {summary.map((item, idx) => {
            const profitPerItem = item.soldQty ? item.profit / item.soldQty : 0;
            const purchaseRate = item.soldQty ? item.totalCost / item.soldQty : 0;
            return (
              <div
                key={idx}
                className={`transition-transform duration-200 hover:scale-[1.01] shadow-md border rounded-lg p-4 ${
                  item.profit >= 0 ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"
                }`}
              >
                <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                <div className="text-sm text-gray-700">Sold: {item.soldQty} pcs</div>
                <div className="text-sm">Purchase Price: ₹{purchaseRate.toFixed(2)}</div>
                <div className="text-sm">Profit / item: ₹{profitPerItem.toFixed(2)}</div>
                <div className="text-sm">Total Sales: ₹{item.totalSales.toFixed(2)}</div>
                <div className="text-sm">Total Cost: ₹{item.totalCost.toFixed(2)}</div>
                <div
                  className={`text-sm font-semibold ${
                    item.profit >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {item.profit >= 0
                    ? `✅ Total Profit: ₹${item.profit.toFixed(2)}`
                    : `❌ Total Loss: ₹${Math.abs(item.profit).toFixed(2)}`}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Last Sold: {new Date(item.lastSold).toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Daily Summary Section */}
{selectedDate && (
  <div className="mt-12">
    <h2 className="text-xl font-semibold text-center mb-4">
      📅 Daily Sales Summary for {selectedDate}
    </h2>

    {dailyLoading ? (
      <div className="text-center text-gray-500">⏳ Loading daily summary...</div>
    ) : dailyError ? (
      <div className="text-center text-red-500 font-medium">{dailyError}</div>
    ) : dailySummary.length === 0 ? (
      <div className="text-center text-gray-400">No sales data recorded on this day.</div>
    ) : (
      <>
        {/* Daily Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-100 border border-green-300 rounded-lg p-2 text-center shadow">
            <h2 className="text-sm font-medium text-green-800">Sales</h2>
            <p className="text-lg font-bold text-green-900 mt-1">
              ₹{dailySummary.reduce((sum, i) => sum + i.totalSales, 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-2 text-center shadow">
            <h2 className="text-sm font-medium text-yellow-800">Cost</h2>
            <p className="text-lg font-bold text-yellow-900 mt-1">
              ₹{dailySummary.reduce((sum, i) => sum + i.totalCost, 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-2 text-center shadow">
            <h2 className="text-sm font-medium text-blue-800">Profit</h2>
            <p className="text-lg font-bold mt-1 text-blue-900">
              ₹{dailySummary.reduce((sum, i) => sum + i.profit, 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Breakdown by Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dailySummary.map((item, idx) => {
            const perItemProfit = item.soldQty ? item.profit / item.soldQty : 0;
            const purchaseRate = item.soldQty ? item.totalCost / item.soldQty : 0;

            return (
              <div
                key={idx}
                className={`p-4 rounded border shadow-sm transition-transform hover:scale-[1.01] ${
                  item.profit >= 0 ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"
                }`}
              >
                <h3 className="font-bold text-lg">{item.name}</h3>
                <div className="text-sm">Sold: {item.soldQty} pcs</div>
                <div className="text-sm">Purchase Rate: ₹{purchaseRate.toFixed(2)}</div>
                <div className="text-sm">Profit / Item: ₹{perItemProfit.toFixed(2)}</div>
                <div className="text-sm">Sales: ₹{item.totalSales.toFixed(2)}</div>
                <div className="text-sm">Cost: ₹{item.totalCost.toFixed(2)}</div>
                <div
                  className={`text-sm font-semibold mt-1 ${
                    item.profit >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {item.profit >= 0
                    ? `✅ Total Profit: ₹${item.profit.toFixed(2)}`
                    : `❌ Total Loss: ₹${Math.abs(item.profit).toFixed(2)}`}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Last Sold: {new Date(item.lastSold).toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </>
    )}
  </div>
)}
    </div>
  );
}