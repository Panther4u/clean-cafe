"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
const TARGET_SIZE = 2767;

const menusType = [
  { label: "☕ Coffee", value: 1 },
  { label: "🥤 Non Coffee", value: 2 },
  { label: "🍰 Dessert", value: 3 },
  { label: "🫖 Manual Brew", value: 4 },
  { label: "💧 Water", value: 5 },
  { label: "🍽️ Foods", value: 6 },
];

export default function AddProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    mrp: "",
    purchaseRate: "",
    type: "",
    pic: "",
    description: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [addedItems, setAddedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Fetch menu items on page load
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`${API_BASE}/menu/all`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setAddedItems(data);
        }
      } catch (err) {
        console.error("❌ Failed to fetch menu items", err);
      }
    };

    fetchMenu();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: ["price", "mrp", "purchaseRate", "type"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const base64 = await resizeImageToSquare(file, TARGET_SIZE);
    setImagePreview(base64);
    setFormData((prev) => ({ ...prev, pic: base64 }));
  };

  const resizeImageToSquare = (file, size) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;

          const ctx = canvas.getContext("2d");

          const scale = Math.max(size / img.width, size / img.height);
          const x = (size - img.width * scale) / 2;
          const y = (size - img.height * scale) / 2;

          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, size, size);

          ctx.drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
            x,
            y,
            img.width * scale,
            img.height * scale
          );

          resolve(canvas.toDataURL("image/jpeg", 0.9));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
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
        setAddedItems((prev) => [...prev, data.item]);

        setFormData({
          name: "",
          price: "",
          mrp: "",
          purchaseRate: "",
          type: "",
          pic: "",
          description: "",
        });
        setImagePreview(null);
      } else {
        setMessage("❌ Failed: " + (data?.error || "Something went wrong"));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Network error.");
    }

    setLoading(false);
  };

  const groupedByCategory = () => {
    const groups = {};
    for (const item of addedItems) {
      const category = menusType.find((m) => m.value === item.type)?.label || "Other";
      if (!groups[category]) groups[category] = [];
      groups[category].push(item);
    }
    return groups;
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded mt-6 font-sans">
      <h2 className="text-xl font-semibold mb-4 text-center">➕ Add New Product</h2>

      {/* Add Product Form */}
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

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Category</option>
          {menusType.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border px-3 py-2 rounded"
        />

        {imagePreview && (
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Image Preview (2767x2767):</p>
            <img
              src={imagePreview}
              alt="Preview"
              className="h-32 mx-auto rounded object-contain border"
            />
          </div>
        )}

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

      {/* Show Added Products Below */}
      {addedItems.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-1 text-center">🧾 Recently Added Products</h3>
          <p className="text-sm text-center text-gray-600 mb-2">
            Total: {addedItems.length} item{addedItems.length !== 1 ? "s" : ""}
          </p>

          {Object.entries(groupedByCategory()).map(([category, items]) => (
            <div key={category} className="mb-4">
              <h4 className="font-bold text-gray-700 mb-2">{category} ({items.length})</h4>
              <div className="grid grid-cols-3 gap-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="border p-3 rounded shadow-sm flex flex-col items-center text-center"
                  >
                    <img
                      src={item.pic}
                      alt={item.name}
                      className="h-20 w-20 object-cover rounded mb-2"
                    />
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">₹{item.price}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
