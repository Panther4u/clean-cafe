// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// require("dotenv").config(); // Load .env

// // Firebase Admin
// const { initializeApp, cert } = require("firebase-admin/app");
// const { getFirestore } = require("firebase-admin/firestore");

// // Load service account from .env
// let serviceAccount;
// try {
//   serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
// } catch (error) {
//   console.error("❌ Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON from .env");
//   process.exit(1);
// }

// initializeApp({
//   credential: cert(serviceAccount),
// });

// const db = getFirestore();
// const app = express();
// const PORT = process.env.PORT || 4000;

// app.use(cors());
// app.use(bodyParser.json());

// // =============================
// // ✅ Save receipt to Firestore
// // =============================
// app.post("/print", async (req, res) => {
//   try {
//     const data = req.body;
//     const createdAt = new Date().toISOString();

//     const result = await db.collection("receipts").add({
//       ...data,
//       createdAt,
//     });

//     console.log("✅ Receipt saved with ID:", result.id);
//     res.json({ status: "success", saved: true, id: result.id });
//   } catch (err) {
//     console.error("❌ Error saving receipt:", err);
//     res.status(500).json({ error: "Failed to save receipt" });
//   }
// });

// // =============================
// // ✅ Get all receipts
// // =============================
// app.get("/receipts", async (req, res) => {
//   try {
//     const snapshot = await db
//       .collection("receipts")
//       .orderBy("createdAt", "desc")
//       .get();

//     const receipts = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     res.json(receipts);
//   } catch (err) {
//     console.error("❌ Failed to fetch receipts:", err);
//     res.status(500).json({ error: "Failed to fetch receipts" });
//   }
// });

// // =============================
// // ✅ Delete a receipt by Firestore ID
// // =============================
// app.delete("/receipts/delete/:id", async (req, res) => {
//   try {
//     await db.collection("receipts").doc(req.params.id).delete();
//     console.log("🗑️ Deleted receipt ID:", req.params.id);
//     res.json({ deleted: true });
//   } catch (err) {
//     console.error("❌ Failed to delete receipt:", err);
//     res.status(500).json({ error: "Failed to delete receipt" });
//   }
// });

// // =============================
// // ✅ Update a receipt by ID
// // =============================
// app.put("/receipts/update/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     await db.collection("receipts").doc(id).update(updateData);

//     res.json({ updated: true });
//   } catch (err) {
//     console.error("❌ Error updating receipt:", err);
//     res.status(500).json({ error: "Failed to update receipt" });
//   }
// });

// // =============================
// // ✅ Serve menu from static file
// // =============================
// const menuData = require("./menu.json");
// app.get("/menu", (req, res) => {
//   res.json(menuData.menu || []);
// });

// // =============================
// // ✅ Start server
// // =============================
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });

// ✅ server.js with ImageKit integration




const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
} catch (error) {
  console.error("❌ Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON from .env");
  process.exit(1);
}
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  "https://clean-cafe.vercel.app",
  "http://localhost:3000",
];

app.use((req, res, next) => {
  console.log("🌐 Request from origin:", req.headers.origin);
  next();
});

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("❌ Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
const fs = require("fs");
const path = require("path");

// 🔽 Export menu collection as JSON
app.get("/menu/export", async (req, res) => {
  try {
    const snapshot = await db.collection("menu").get();
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const json = JSON.stringify(items, null, 2);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=menu-export.json");
    res.send(json);
  } catch (err) {
    console.error("❌ Failed to export menu:", err);
    res.status(500).json({ error: "Failed to export menu" });
  }
});

app.post("/print", async (req, res) => {
  try {
    const data = req.body;
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const time = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

    const snapshot = await db
      .collection("receipts")
      .where("total", "==", data.total)
      .where("grandTotal", "==", data.grandTotal)
      .where("paymentMethod", "==", data.paymentMethod)
      .get();

    const isDuplicate = snapshot.docs.find((doc) => {
      const docData = doc.data();
      return (
        JSON.stringify(docData.order) === JSON.stringify(data.order) &&
        docData.date?.startsWith(today)
      );
    });

    if (isDuplicate) {
      console.log("⚠️ Duplicate receipt detected. Skipping save.");
      return res.json({
        status: "duplicate",
        saved: false,
        id: isDuplicate.id,
        billNo: isDuplicate.data().billNo,
      });
    }

    const counterRef = db.collection("meta").doc("counter");
    const newBillNo = await db.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      let current = 1;
      if (counterDoc.exists) {
        current = counterDoc.data().billNumber || current;
      }
      const next = current + 1;
      transaction.set(counterRef, { billNumber: next });
      return next;
    });

    const formattedBillNo = `#${String(newBillNo).padStart(2, "0")}`;

    const sanitizedOrder = data.order.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      amount: item.amount,
      type: item.type || null,
    }));

    const receipt = {
      order: sanitizedOrder,
      total: data.total,
      grandTotal: data.grandTotal,
      paymentMethod: data.paymentMethod,
      billNo: formattedBillNo,
      createdAt: now.toISOString(),
      date: today,
      time: time
    };

    const savedDoc = await db.collection("receipts").add(receipt);
    console.log("✅ Receipt saved with ID:", savedDoc.id);

    const salesRef = db.collection("sales_summary");

    for (const item of sanitizedOrder) {
      const itemRef = salesRef.doc(String(item.id));
      const snapshot = await itemRef.get();

      const soldQty = item.amount;
      const totalSales = soldQty * item.price;
      const totalCost = soldQty * (item.purchaseRate || 0);
      const profit = totalSales - totalCost;

      if (snapshot.exists) {
        const prev = snapshot.data();
        await itemRef.update({
          soldQty: prev.soldQty + soldQty,
          totalSales: prev.totalSales + totalSales,
          totalCost: prev.totalCost + totalCost,
          profit: prev.profit + profit,
          lastSold: now.toISOString(),
        });
      } else {
        await itemRef.set({
          id: item.id,
          name: item.name,
          soldQty,
          totalSales,
          totalCost,
          profit,
          lastSold: now.toISOString(),
        });
      }
    }

    res.json({
      status: "success",
      saved: true,
      id: savedDoc.id,
      billNo: formattedBillNo,
    });
  } catch (err) {
    console.error("❌ Error saving receipt:", err);
    res.status(500).json({ error: "Failed to save receipt" });
  }
});

// ✅ Sales Summary with purchase price and MRP per item
app.get("/sales-summary", async (req, res) => {
  try {
    // Get all receipts
    const receiptsSnapshot = await db.collection("receipts").get();
    const receipts = receiptsSnapshot.docs.map((doc) => doc.data());

    // Get product master data (MRP, purchaseRate)
    const menuSnapshot = await db.collection("menu").get();
    const menuMap = {};
    menuSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      menuMap[String(data.id)] = {
        name: data.name,
        price: data.price,
        purchaseRate: data.purchaseRate || 0,
      };
    });

    const summaryMap = {};

    // Loop through receipts
    for (const receipt of receipts) {
      for (const item of receipt.order || []) {
        const key = item.id || item.name;
        const menuItem = menuMap[String(item.id)] || {};

        const price = menuItem.price || item.price || 0;
        const purchaseRate = menuItem.purchaseRate || 0;
        const qty = item.amount || 0;

        const totalSales = price * qty;
        const totalCost = purchaseRate * qty;
        const profit = totalSales - totalCost;

        if (!summaryMap[key]) {
          summaryMap[key] = {
            id: item.id,
            name: item.name,
            soldQty: 0,
            price: price,
            purchaseRate: purchaseRate,
            totalSales: 0,
            totalCost: 0,
            profit: 0,
            lastSold: receipt.createdAt,
          };
        }

        summaryMap[key].soldQty += qty;
        summaryMap[key].totalSales += totalSales;
        summaryMap[key].totalCost += totalCost;
        summaryMap[key].profit += profit;
        summaryMap[key].lastSold = receipt.createdAt;
      }
    }

    const summaryList = Object.values(summaryMap).sort((a, b) => b.soldQty - a.soldQty);
    res.json(summaryList);
  } catch (err) {
    console.error("❌ Failed to fetch sales summary:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Sales Summary by specific date
app.get("/sales-summary-by-date", async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Missing date parameter" });
    }

    const receiptsSnapshot = await db
      .collection("receipts")
      .where("date", "==", date)
      .get();

    const receipts = receiptsSnapshot.docs.map((doc) => doc.data());

    const menuSnapshot = await db.collection("menu").get();
    const menuMap = {};
    menuSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      menuMap[String(data.id)] = {
        name: data.name,
        price: data.price,
        purchaseRate: data.purchaseRate || 0,
      };
    });

    const summaryMap = {};

    for (const receipt of receipts) {
      for (const item of receipt.order || []) {
        const key = item.id;
        const menuItem = menuMap[key] || {};

        const price = menuItem.price || item.price || 0;
        const purchaseRate = menuItem.purchaseRate || 0;
        const qty = item.amount || 0;

        const totalSales = price * qty;
        const totalCost = purchaseRate * qty;
        const profit = totalSales - totalCost;

        if (!summaryMap[key]) {
          summaryMap[key] = {
            id: key,
            name: item.name,
            soldQty: 0,
            price,
            purchaseRate,
            totalSales: 0,
            totalCost: 0,
            profit: 0,
            lastSold: receipt.createdAt,
          };
        }

        summaryMap[key].soldQty += qty;
        summaryMap[key].totalSales += totalSales;
        summaryMap[key].totalCost += totalCost;
        summaryMap[key].profit += profit;
        summaryMap[key].lastSold = receipt.createdAt;
      }
    }

    const summaryList = Object.values(summaryMap);
    res.json(summaryList);
  } catch (err) {
    console.error("❌ Failed to fetch sales summary by date:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/expenses-by-date", async (req, res) => {
  const { date } = req.query;
  try {
    const snapshot = await db
      .collection("expenses")
      .where("date", "==", date)
      .get();

    const data = snapshot.docs.map(doc => ({
      id: doc.id,            // ✅ add document ID here!
      ...doc.data()
    }));

    res.json(data);
  } catch (error) {
    console.error("Error getting expenses:", error);
    res.status(500).json({ error: "Failed to get expenses" });
  }
});

// ✅ Add New Expense
app.post("/expenses/add", async (req, res) => {
  try {
    const { category, amount, notes, date, type = "out", method = "Cash" } = req.body;

    if (!category || !amount || !date) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    await db.collection("expenses").add({
      category,
      amount: parseFloat(amount),
      notes: notes || "",
      type: type.toLowerCase(),     // ✅ Ensure it's lowercase
      method,
      date,
      createdAt: new Date().toISOString(),
    });

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Failed to save expense:", err);
    res.status(500).json({ success: false });
  }
});

app.put("/expenses/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { type, ...otherData } = req.body;

    await db.collection("expenses").doc(id).update({
      ...otherData,
      type: type.toLowerCase(),   // ✅ force lowercase
    });
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Update failed:", err);
    res.status(500).json({ success: false });
  }
});

app.post("/expenses/add-or-update", async (req, res) => {
  try {
    const { category, amount, notes, type, method, date, createdAt } = req.body;

    if (!category || !amount || !type || !method || !date) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const matchSnap = await db.collection("expenses")
      .where("category", "==", category)
      .where("type", "==", type)
      .where("date", "==", date)
      .limit(1)
      .get();

    const docData = {
      category,
      amount,
      notes: notes || "",
      type,
      method,
      date,
      createdAt: createdAt || new Date().toISOString(),
    };

    if (!matchSnap.empty) {
      // Update
      const docId = matchSnap.docs[0].id;
      await db.collection("expenses").doc(docId).update(docData);
    } else {
      // Add
      await db.collection("expenses").add(docData);
    }

    res.json({ success: true });
  } catch (err) {
    console.error("💥 Expense save error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
app.put("/expenses/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body;

    await db.collection("expenses").doc(id).update(newData);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Update failed:", err);
    res.status(500).json({ success: false });
  }
});
app.delete("/expenses/delete/:id", async (req, res) => {
  try {
    await db.collection("expenses").doc(req.params.id).delete();
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Delete failed:", err);
    res.status(500).json({ success: false });
  }
});

// ✅ Get all receipts
app.get("/receipts", async (req, res) => {
  try {
    const snapshot = await db
      .collection("receipts")
      .orderBy("createdAt", "desc")
      .get();
    const receipts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(receipts);
  } catch (err) {
    console.error("❌ Failed to fetch receipts:", err);
    res.status(500).json({ error: "Failed to fetch receipts" });
  }
});


// ✅ Delete receipt
app.delete("/receipts/delete/:id", async (req, res) => {
  try {
    await db.collection("receipts").doc(req.params.id).delete();
    console.log("🗑️ Deleted receipt ID:", req.params.id);
    res.json({ deleted: true });
  } catch (err) {
    console.error("❌ Failed to delete receipt:", err);
    res.status(500).json({ error: "Failed to delete receipt" });
  }
});

// ✅ Update receipt
app.put("/receipts/update/:id", async (req, res) => {
  try {
    await db.collection("receipts").doc(req.params.id).update(req.body);
    res.json({ updated: true });
  } catch (err) {
    console.error("❌ Error updating receipt:", err);
    res.status(500).json({ error: "Failed to update receipt" });
  }
});


// ✅ Admin password verification
app.post("/admin/verify-password", (req, res) => {
  const { password } = req.body;
  console.log("🔐 Received password:", password);
  console.log("🔐 Expected password:", process.env.ADMIN_PASSWORD);

  if (password === process.env.ADMIN_PASSWORD) {
    return res.json({ success: true });
  }
  res.status(401).json({ success: false });
});

// ✅ Add product to menu
app.post("/menu/add", async (req, res) => {
  try {
    const newItem = req.body;

    if (!newItem.name || typeof newItem.price !== "number") {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!newItem.id) {
      const snapshot = await db.collection("menu").orderBy("id", "desc").limit(1).get();
      const lastItem = snapshot.docs[0]?.data();
      newItem.id = lastItem ? lastItem.id + 1 : 1;
    }

    const product = {
      description: "",
      amount: 0,
      favorite: false,
      notes: "",
      ...newItem,
    };

    await db.collection("menu").doc(String(product.id)).set(product);
    console.log("✅ Product added:", product.name);
    res.json({ success: true, item: product });
  } catch (err) {
    console.error("❌ Failed to add menu item:", err);
    res.status(500).json({ error: "Failed to add menu item" });
  }
});

// app.get("/menu/all", async (req, res) => {
//   console.log("🔥 MENU FETCH INITIATED");
//   try {
//     const snapshot = await db.collection("menu").get();
//     const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     console.log("✅ MENU RETURNING:", items.length);
//     res.json(items);
//   } catch (err) {
//     console.error("❌ MENU FETCH FAILED:", err);
//     res.status(500).json({ error: "Failed to fetch menu items" });
//   }
// });


const localMenuPath = path.join(__dirname, "items.json");

app.get("/menu/all", (req, res) => {
  const file = fs.readFileSync(localMenuPath, "utf8");
  const items = JSON.parse(file);
  res.json(items);
});

// ✅ Update menu item
app.put("/menu/update/:id", async (req, res) => {
  try {
    const updateData = req.body;
    const itemId = req.params.id;

    if (!itemId || !updateData) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    await db.collection("menu").doc(itemId).update(updateData);
    console.log("✏️ Product updated:", itemId);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Failed to update menu item:", err);
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

// 👉 Combine image upload + update product in one go
app.put("/menu/update-with-image/:id", upload.single("image"), async (req, res) => {
  try {
    const itemId = req.params.id;
    const updateData = JSON.parse(req.body.data || "{}");

    if (!itemId || !updateData) {
      return res.status(400).json({ error: "Invalid request" });
    }

    // If an image file was uploaded, save and use its URL
    if (req.file) {
      const bucket = getStorage().bucket();
      const filename = `menu/${Date.now()}-${req.file.originalname}`;
      const file = bucket.file(filename);

      await file.save(req.file.buffer, {
        contentType: req.file.mimetype,
      });

      await file.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
      updateData.imageUrl = publicUrl;
      console.log(`📤 New image uploaded: ${publicUrl}`);
    }

    // Save updates to Firestore
    await db.collection("menu").doc(itemId).update(updateData);
    console.log(`✅ Product ${itemId} updated (with image if uploaded)`);

    return res.json({ success: true });
  } catch (err) {
    console.error("❌ Failed update-with-image:", err.message, err.stack);
    return res.status(500).json({ error: "Update failed", details: err.message });
  }
});


// ✅ Delete menu item
app.delete("/menu/delete/:id", async (req, res) => {
  try {
    await db.collection("menu").doc(req.params.id).delete();
    console.log("🗑️ Deleted product ID:", req.params.id);
    res.json({ deleted: true });
  } catch (err) {
    console.error("❌ Failed to delete menu item:", err);
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});


// 🔐 ImageKit Auth endpoint
app.get("/api/auth/imagekit", (req, res) => {
  const ImageKit = require("imagekit");

  const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });

  const result = imagekit.getAuthenticationParameters();
  res.json(result);
});

app.post("/menu/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: "No file uploaded" });

    const bucket = getStorage().bucket();
    const filename = `menu/${Date.now()}-${req.file.originalname}`;
    const file = bucket.file(filename);

    await file.save(req.file.buffer, {
      contentType: req.file.mimetype,
    });

    await file.makePublic(); // Use signed URL if you need security

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
    res.status(200).json({ success: true, imageUrl: publicUrl });
  } catch (err) {
    console.error("❌ Image upload error:", err);
    res.status(500).json({ success: false, error: "Upload failed" });
  }
});


// Before all routes
app.use((req, res, next) => {
  if (req.url.startsWith("/menu")) {
    console.log("🌐 Request from origin:", req.headers.origin);
  }
  next();
});
// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
