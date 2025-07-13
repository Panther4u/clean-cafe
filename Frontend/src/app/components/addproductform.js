"use client";

import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function AddProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",           // Selling Price
    mrp: "",
    purchaseRate: "",
    type: "",
    pic: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["price", "mrp", "purchaseRate", "type"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const product = {
      ...formData,
      amount: 0,
      favorite: false,
      notes: "",
    };

    try {
      const res = await fetch(`${API_BASE}/menu/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Product added successfully!");
        setFormData({
          name: "",
          price: "",
          mrp: "",
          purchaseRate: "",
          type: "",
          pic: "",
          description: "",
        });
      } else {
        setMessage("❌ Failed: " + (data?.error || "Something went wrong"));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Network error.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded mt-6 font-sans">
      <h2 className="text-xl font-semibold mb-4 text-center">➕ Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Selling Price"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          name="mrp"
          placeholder="MRP"
          value={formData.mrp}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          name="purchaseRate"
          placeholder="Purchase Rate"
          value={formData.purchaseRate}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          name="type"
          placeholder="Type (e.g., 1 = Coffee, 2 = Snacks)"
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="pic"
          placeholder="Image Path (e.g., /product/ChocolateIceScoop.png)"
          value={formData.pic}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description (optional)"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>

        {message && <p className="text-sm mt-2 text-center">{message}</p>}
      </form>
    </div>
  );
}
