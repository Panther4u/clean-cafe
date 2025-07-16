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

  useEffect(() => {
    fetch(`${API_BASE}/sales-summary`)
      .then((res) => res.json())
      .then((data) => {
        setSummary(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch sales summary:", err);
        setLoading(false);
      });
  }, []);

  const totalSales = summary.reduce((sum, item) => sum + item.totalSales, 0);
  const totalCost = summary.reduce((sum, item) => sum + item.totalCost, 0);
  const totalProfit = summary.reduce((sum, item) => sum + item.profit, 0);

  if (loading) return <div className="p-4 text-center">Loading summary...</div>;

  const topItems = [...summary]
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 10);

  return (
    <div className="p-0 max-w-7xl mx-auto">
      <h1 className="text-1xl font-bold text-center mb-6">📊 Sales Summary</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-10">
        <div className="bg-green-100 border border-green-300 rounded-lg p-1 text-center shadow-sm">
          <h2 className="text-sm font-medium text-green-800">Total Sales</h2>
          <p className="text-lg font-bold text-green-900 mt-1">₹{totalSales.toFixed(2)}</p>
        </div>
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-1 text-center shadow-sm">
          <h2 className="text-sm font-medium text-yellow-800">Total Cost</h2>
          <p className="text-lg font-bold text-yellow-900 mt-1">₹{totalCost.toFixed(2)}</p>
        </div>
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-1 text-center shadow-sm">
          <h2 className="text-sm font-medium text-blue-800">Total Profit</h2>
          <p
            className={`text-lg font-bold ${
              totalProfit >= 0 ? "text-blue-900" : "text-red-600"
            } mt-1`}
          >
            ₹{totalProfit.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="w-full h-[300px] sm:h-[400px] mb-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topItems} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={100} />
            <Tooltip />
            <Bar dataKey="profit" fill="#3B82F6" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {summary.length === 0 ? (
        <div className="text-center text-gray-500">No sales data found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {summary.map((item, idx) => {
            const profitPerItem = item.soldQty > 0
              ? (item.profit / item.soldQty)
              : 0;
            const purchaseRate = item.soldQty > 0
              ? item.totalCost / item.soldQty
              : 0;

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

                {item.profit >= 0 ? (
                  <div className="text-sm font-semibold text-green-600">
                    ✅ Total Profit: ₹{item.profit.toFixed(2)}
                  </div>
                ) : (
                  <div className="text-sm font-semibold text-red-600">
                    ❌ Total Loss: ₹{Math.abs(item.profit).toFixed(2)}
                  </div>
                )}

                <div className="text-xs text-gray-500 mt-1">
                  Last Sold: {new Date(item.lastSold).toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}