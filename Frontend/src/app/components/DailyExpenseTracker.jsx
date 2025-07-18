"use client";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export default function DailyExpenseTracker({ selectedDate }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [type, setType] = useState("out");
  const [method, setMethod] = useState("Cash");

  const [editingId, setEditingId] = useState(null);
  const isEditing = Boolean(editingId);

  const fetchExpenses = async () => {
    if (!selectedDate) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/expenses-by-date?date=${selectedDate}`);
      const data = await res.json();
      setExpenses(data || []);
    } catch (err) {
      console.error("❌ Error fetching expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) fetchExpenses();
  }, [selectedDate]);

  const totalIn = expenses
    .filter((e) => (e.type || "").toLowerCase() === "in")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const totalOut = expenses
    .filter((e) => (e.type || "").toLowerCase() === "out")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const balance = totalIn - totalOut;

  const resetForm = () => {
    setCategory("");
    setAmount("");
    setNotes("");
    setType("out");
    setMethod("Cash");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category || !amount) {
      return alert("Please provide both Category and Amount.");
    }

    const payload = {
      category,
      amount: parseFloat(amount),
      notes,
      type: type.toLowerCase(),
      method,
      date: selectedDate || new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    };

    try {
      let res;
      if (isEditing) {
        res = await fetch(`${API_BASE}/expenses/update/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/expenses/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const result = await res.json();
      if (result.success) {
        resetForm();
        await fetchExpenses();
      } else {
        alert(result.message || "Error saving expense.");
      }
    } catch (err) {
      console.error("❌ Error saving:", err);
      alert("Unexpected error.");
    }
  };

  const handleEdit = (exp) => {
    setCategory(exp.category);
    setAmount(exp.amount);
    setNotes(exp.notes || "");
    setType(exp.type || "out");
    setMethod(exp.method || "Cash");
    setEditingId(exp.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      await fetch(`${API_BASE}/expenses/delete/${id}`, { method: "DELETE" });
      await fetchExpenses();
    } catch (err) {
      console.error("❌ Failed to delete:", err);
      alert("Delete failed.");
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 mt-6 shadow-sm max-w-4xl mx-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4">📘 Daily Expense Tracker</h2>

      {/* 🙋 Add/Edit Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-6 gap-3 mb-3">
        <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="col-span-2 w-full border px-3 py-2 rounded text-sm"
        required
        >
        <option value="" disabled>-- Select Category --</option>
        <optgroup label="👨‍🍳 Salary">
            <option value="Salary > Dhanush">Salary Dhanush</option>
            <option value="Salary > Manjula">Salary Manjula</option>
            <option value="Salary > Seenu">Salary Seenu</option>
            <option value="Salary > Vadaimaster">Salary Vadaimaster</option>
            <option value="Salary > Janaki">Salary Janaki</option>
        </optgroup>
        <optgroup label="🛒 Essentials">
            <option value="Milk">Milk</option>
            <option value="Grocery & Vegetables">Grocery & Vegetables</option>
        </optgroup>
        <optgroup label="🍴 Snacks">
            <option value="Samosa & Puffes">Samosa & Puffes</option>
            <option value="Sweet & Salt">Sweet & Salt</option>
        </optgroup>
        <optgroup label="❌ Waste & Misc">
            <option value="Wastage">Wastage</option>
            <option value="Other">Other</option>
        </optgroup>
        </select>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-3 py-2 rounded text-sm"
          required
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border px-3 py-2 rounded text-sm"
        >
          <option value="out">⬇ Out</option>
          <option value="in">⬆ In</option>
        </select>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="border px-3 py-2 rounded text-sm"
        >
          <option>Cash</option>
          <option>UPI</option>
          <option>Card</option>
          <option>Bank</option>
        </select>
        <input
          type="text"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border px-3 py-2 rounded text-sm"
        />
      </form>

      <div className="flex justify-center mb-5">
  <button
    type="submit"
    form="daily-expense-form"  // optional if form has id
    className={`${
      isEditing ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-600 hover:bg-blue-700"
    } text-white px-6 py-2 rounded text-sm`}
  >
    {isEditing ? "Update" : "Add"}
  </button>
</div>

      {/* 💰 In/Out Summary */}
      <div className="flex justify-between text-sm font-medium text-gray-700 mb-3">
        <div>In: <span className="text-green-600">₹{totalIn.toFixed(2)}</span></div>
        <div>Out: <span className="text-red-600">₹{totalOut.toFixed(2)}</span></div>
        <div>
          Balance:{" "}
          <span className={balance >= 0 ? "text-green-600" : "text-red-600"}>
            ₹{balance.toFixed(2)}
          </span>
        </div>
      </div>

      {/* 📋 Expenses List */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : expenses.length === 0 ? (
        <p className="text-sm text-gray-400">No expenses for {selectedDate}.</p>
      ) : (
        <ul className="space-y-3">
          {expenses.map((e) => (
            <li
              key={e.id}
              className={`p-3 rounded border shadow-sm text-sm flex justify-between items-start ${
                e.type === "in" ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <div>
                <div className="font-semibold">{e.category} ({e.method})</div>
                {e.notes && <div className="text-xs text-gray-600">{e.notes}</div>}
                <div className="text-xs text-gray-500">
                  {new Date(e.createdAt).toLocaleTimeString()}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-800">₹{Number(e.amount).toFixed(2)}</div>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => handleEdit(e)}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="text-red-600 hover:underline text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}