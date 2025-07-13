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


const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// 🔐 Firebase Initialization
let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
} catch (error) {
  console.error("❌ Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON from .env");
  process.exit(1);
}
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ CORS Configuration
const allowedOrigins = [
  "https://clean-cafe.vercel.app",
  "http://localhost:3000",
];

app.use((req, res, next) => {
  console.log("🌐 Request from origin:", req.headers.origin);
  next();
});

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(bodyParser.json());

// ✅ Save Receipt with auto-increment and duplicate check
app.post("/print", async (req, res) => {
  try {
    const data = req.body;
    const now = new Date();
    const today = now.toISOString().split("T")[0];

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
    const receipt = {
      ...data,
      billNo: formattedBillNo,
      createdAt: now.toISOString(),
    };

    const savedDoc = await db.collection("receipts").add(receipt);
    console.log("✅ Receipt saved with ID:", savedDoc.id);

    const salesRef = db.collection("sales_summary");

    for (const item of data.order) {
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

// ✅ Sales Summary
app.get("/sales-summary", async (req, res) => {
  try {
    const receiptsSnapshot = await db.collection("receipts").get();
    const receipts = receiptsSnapshot.docs.map((doc) => doc.data());

    const summaryMap = {};

    for (const receipt of receipts) {
      for (const item of receipt.order || []) {
        const key = item.id || item.name;
        if (!summaryMap[key]) {
          summaryMap[key] = {
            id: item.id,
            name: item.name,
            soldQty: 0,
            totalSales: 0,
            totalCost: 0,
            profit: 0,
            lastSold: receipt.createdAt,
          };
        }

        const qty = item.amount;
        const sales = item.price * qty;
        const cost = item.purchaseRate ? item.purchaseRate * qty : 0;
        const profit = sales - cost;

        summaryMap[key].soldQty += qty;
        summaryMap[key].totalSales += sales;
        summaryMap[key].totalCost += cost;
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

// ✅ Serve static menu
const menuData = require("./menu.json");
app.get("/menu", (req, res) => {
  res.json(menuData.menu || []);
});

// ✅ Admin password verification
app.post("/admin/verify-password", (req, res) => {
  const { password } = req.body;
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

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
