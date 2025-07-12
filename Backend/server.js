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

app.use(cors());
app.use(bodyParser.json());

// ✅ Save Receipt with auto-incremented bill number starting at #01
app.post("/print", async (req, res) => {
  try {
    const data = req.body;
    const now = new Date();

    // 🔁 Firestore Counter Logic
    const counterRef = db.collection("meta").doc("counter");

    const newBillNo = await db.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      let current = 1; // start from 1 (not 01)
      if (counterDoc.exists) {
        current = counterDoc.data().billNumber || current;
      }
      const next = current + 1;
      transaction.set(counterRef, { billNumber: next });
      return next;
    });

    const formattedBillNo = `#${String(newBillNo).padStart(2, "0")}`; // ➜ "#01", "#02", etc.

    const receipt = {
      ...data,
      billNo: formattedBillNo,
      createdAt: now.toISOString(),
    };

    const savedDoc = await db.collection("receipts").add(receipt);

    console.log("✅ Receipt saved with ID:", savedDoc.id);
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


// ✅ Get All Receipts
app.get("/receipts", async (req, res) => {
  try {
    const snapshot = await db.collection("receipts").orderBy("createdAt", "desc").get();
    const receipts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(receipts);
  } catch (err) {
    console.error("❌ Failed to fetch receipts:", err);
    res.status(500).json({ error: "Failed to fetch receipts" });
  }
});

// ✅ Delete Receipt
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

// ✅ Update Receipt
app.put("/receipts/update/:id", async (req, res) => {
  try {
    await db.collection("receipts").doc(req.params.id).update(req.body);
    res.json({ updated: true });
  } catch (err) {
    console.error("❌ Error updating receipt:", err);
    res.status(500).json({ error: "Failed to update receipt" });
  }
});

// ✅ Serve Menu JSON
const menuData = require("./menu.json"); // your static menu file
app.get("/menu", (req, res) => {
  res.json(menuData.menu || []);
});

// ✅ Admin Login
app.post("/admin/login", (req, res) => {
  const { id, password } = req.body;
  const ADMIN_ID = process.env.ADMIN_ID || "admin";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "123456";

  if (id === ADMIN_ID && password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
