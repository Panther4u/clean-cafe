"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const menusType = [
  { label: "☕ Tea", value: 1 },
  { label: "🥤 Coffee", value: 2 },
  { label: "🥛 Dairy Products", value: 3 },
  { label: "🍪 Snacks", value: 4 },
  { label: "🫗 Fresh Juice", value: 5 },
  { label: "🧃 Juice", value: 6 },
  { label: "🍨 Ice Cream", value: 7 },
  { label: "🍨 Karupatti Ice Cream", value: 8 },
  { label: "🍽️ Karupatti Snacks", value: 9 },
  { label: "🛒 Others", value: 10 },
  { label: "🍪 Biscuits & Cakes", value: 11 },
  { label: "📦 Parcel", value: 12 } // new entry
];


export default function AddProductForm({ onProductAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    mrp: "",
    purchaseRate: "",
    type: "",
    description: "",
    imageUrl: "",
  });

  const [addedItems, setAddedItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch("/items.json");
      const jsonData = await res.json();
      
      // Convert the data object into an array of items
      const items = Object.values(jsonData.data || {});
      setAddedItems(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("❌ Failed to fetch items:", err);
      setAddedItems([]);
    }
  };

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

    try {
      // Prepare the product data
      const product = {
        ...formData,
        amount: 0,
        favorite: false,
        notes: "",
      };

      if (editItem) {
        product.id = editItem.id;
      }

      // Send to API to handle saving to items.json
      const response = await fetch('/api/products', {
        method: editItem ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage(editItem ? "✅ Product updated!" : "✅ Product added!");
        fetchMenu();
        if (onProductAdded) onProductAdded(data.item);
        resetForm();
      } else {
        setMessage("❌ Failed: " + (data?.error || "Unknown error"));
      }
    } catch (err) {
      console.error("❌ Submit error:", err);
      setMessage("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      mrp: "",
      purchaseRate: "",
      type: "",
      description: "",
      imageUrl: "",
    });
    setEditItem(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setAddedItems((prev) => prev.filter((item) => item.id !== id));
        setMessage("🗑️ Product deleted.");
      } else {
        const data = await response.json();
        setMessage("❌ Failed: " + (data?.error || "Unknown error"));
      }
    } catch (err) {
      console.error("❌ Delete error:", err);
      setMessage("❌ Failed to delete product.");
    }
  };

  const groupedByCategory = () => {
    const groups = {};
    for (const item of addedItems) {
      const label = menusType.find((m) => m.value === item.type)?.label || "Other";
      if (!groups[label]) groups[label] = [];
      groups[label].push(item);
    }
    return groups;
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded mt-6 font-sans">
      <h2 className="text-xl font-semibold mb-4 text-center text-black">
        {editItem ? "✏️ Edit Product" : "➕ Add New Product"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 ">
        <input name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        <input name="price" type="number" placeholder="Selling Price" value={formData.price} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        <input name="mrp" type="number" placeholder="MRP" value={formData.mrp} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <input name="purchaseRate" type="number" placeholder="Purchase Rate" value={formData.purchaseRate} onChange={handleChange} className="w-full border px-3 py-2 rounded" />

        <select name="type" value={formData.type} onChange={handleChange} required className="w-full border px-3 py-2 rounded text-black">
          <option value="">Select Category</option>
          {menusType.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>

        <input
          type="text"
          name="imageUrl"
          placeholder="Enter Image URL"
          value={formData.imageUrl}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        {formData.imageUrl && (
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
            <Image
              src={formData.imageUrl}
              width={120}
              height={120}
              alt="Preview"
              className="rounded object-contain border inline-block"
            />
          </div>
        )}

        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full border px-3 py-2 rounded" />

        <button type="submit" disabled={loading} className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
          {loading ? (editItem ? "Updating..." : "Adding...") : editItem ? "Update Product" : "Add Product"}
        </button>

        {editItem && (
          <button type="button" onClick={resetForm} className="w-full text-red-500 py-2 rounded hover:underline">Cancel Edit</button>
        )}

        {message && <p className="text-center text-sm mt-2">{message}</p>}
      </form>

      <hr className="my-6" />
      {Object.entries(groupedByCategory()).map(([category, items]) => (
        <div key={category} className="mb-6">
          <h3 className="text-lg font-semibold text-black mb-2">{category} ({items.length})</h3>


<div className="grid grid-cols-3 gap-1">
  {items.map((item) => (
    <div key={item.id} className="border p-1 rounded text-center shadow">
      <div className="w-[80px] h-[80px] mx-auto mb-2 relative overflow-hidden rounded">
        <Image
          src={item.imageUrl || "/placeholder.jpg"}
          alt={item.name}
          fill
          className="object-cover rounded"
        />
      </div>
      <p className="font-medium text-black text-xs">{item.name}</p>
      <p className="text-sm text-gray-500 text-sm">₹{item.price}</p>
      <div className="flex justify-center gap-3 mt-2 text-sm">
        <button
          onClick={() => {
            setEditItem(item);
            setFormData({ ...item });
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="text-blue-600 underline"
        >
          ✏️
        </button>
        <button
          onClick={() => handleDelete(item.id)}
          className="text-red-600 underline"
        >
          🗑️
        </button>
      </div>
    </div>
  ))}
</div>
        </div>
      ))}
    </div>
  );
}