"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
const TARGET_SIZE = 2767;

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
  { label: "🛒 Others", value: 10 }, // ✅ Final fallback category
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
  const [editItem, setEditItem] = useState(null);

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


  const handleDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this item?")) return;

  try {
    const res = await fetch(`${API_BASE}/menu/delete/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setAddedItems((prev) => prev.filter((item) => item.id !== id));
      setMessage("🗑️ Product deleted");
    } else {
      const data = await res.json();
      setMessage("❌ Failed to delete: " + (data?.error || "Unknown error"));
    }
  } catch (err) {
    console.error("❌ Error deleting product:", err);
    setMessage("❌ Network error while deleting.");
  }
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
      let res, data;

      if (editItem) {
        res = await fetch(`${API_BASE}/menu/update/${editItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        });
      } else {
        res = await fetch(`${API_BASE}/menu/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        });
      }

      data = await res.json();

      if (res.ok) {
        setMessage(editItem ? "✅ Product updated!" : "✅ Product added!");

        setAddedItems((prev) =>
          editItem
            ? prev.map((item) =>
                item.id === editItem.id ? { ...item, ...product } : item
              )
            : [...prev, data.item]
        );

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
        setEditItem(null);
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
      const category =
        menusType.find((m) => m.value === item.type)?.label || "Other";
      if (!groups[category]) groups[category] = [];
      groups[category].push(item);
    }
    return groups;
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded mt-6 font-sans">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {editItem ? "✏️ Edit Product" : "➕ Add New Product"}
      </h2>

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
            <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
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
          {loading
            ? editItem
              ? "Updating..."
              : "Adding..."
            : editItem
            ? "Update Product"
            : "Add Product"}
        </button>

        {editItem && (
          <button
            type="button"
            onClick={() => {
              setEditItem(null);
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
            }}
            className="w-full text-red-500 py-2 rounded hover:underline"
          >
            Cancel Edit
          </button>
        )}

        {message && <p className="text-sm mt-2 text-center">{message}</p>}
      </form>

      {addedItems.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-1 text-center">
            🧾 Recently Added Products
          </h3>
          <p className="text-sm text-center text-gray-600 mb-2">
            Total: {addedItems.length} item
            {addedItems.length !== 1 ? "s" : ""}
          </p>

          {Object.entries(groupedByCategory()).map(([category, items]) => (
            <div key={category} className="mb-4">
              <h4 className="font-bold text-gray-700 mb-2">
                {category} ({items.length})
              </h4>
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
<div className="font-medium text-black">{item.name}</div>
<div className="text-sm text-gray-500">₹{item.price}</div>
<div className="flex gap-2 mt-2">
  <button
    onClick={() => {
      setFormData({
        name: item.name,
        price: item.price,
        mrp: item.mrp || "",
        purchaseRate: item.purchaseRate || "",
        type: item.type || "",
        pic: item.pic || "",
        description: item.description || "",
      });
      setImagePreview(item.pic || null);
      setEditItem(item);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }}
    className="text-blue-600 text-sm underline"
  >
    ✏️ Edit
  </button>

  <button
    onClick={() => handleDelete(item.id)}
    className="text-red-600 text-sm underline"
  >
    🗑️ Delete
  </button>
</div>
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
