const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config(); // Load .env

// Firebase Admin
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Load service account from .env
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

app.use(cors());
app.use(bodyParser.json());

// =============================
// ✅ Save receipt to Firestore
// =============================
app.post("/print", async (req, res) => {
  try {
    const data = req.body;
    const createdAt = new Date().toISOString();

    const result = await db.collection("receipts").add({
      ...data,
      createdAt,
    });

    console.log("✅ Receipt saved with ID:", result.id);
    res.json({ status: "success", saved: true, id: result.id });
  } catch (err) {
    console.error("❌ Error saving receipt:", err);
    res.status(500).json({ error: "Failed to save receipt" });
  }
});

// =============================
// ✅ Get all receipts
// =============================
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

// =============================
// ✅ Delete a receipt by Firestore ID
// =============================
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

// =============================
// ✅ Update a receipt by ID
// =============================
app.put("/receipts/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    await db.collection("receipts").doc(id).update(updateData);

    res.json({ updated: true });
  } catch (err) {
    console.error("❌ Error updating receipt:", err);
    res.status(500).json({ error: "Failed to update receipt" });
  }
});

// =============================
// ✅ Serve menu from static file
// =============================
const menuData = require("./menu.json");
app.get("/menu", (req, res) => {
  res.json(menuData.menu || []);
});

// =============================
// ✅ Start server
// =============================
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


// // server.js
// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// require("dotenv").config();

// const { initializeApp, cert } = require("firebase-admin/app");
// const { getFirestore } = require("firebase-admin/firestore");

// let serviceAccount;
// try {
//   serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
// } catch (error) {
//   console.error("❌ GOOGLE_SERVICE_ACCOUNT_JSON error");
//   process.exit(1);
// }

// initializeApp({ credential: cert(serviceAccount) });
// const db = getFirestore();
// const app = express();
// const PORT = process.env.PORT || 4000;

// app.use(cors());
// app.use(bodyParser.json());

// // ✅ Save Receipt
// app.post("/print", async (req, res) => {
//   try {
//     const data = req.body;
//     const result = await db.collection("receipts").add({
//       ...data,
//       createdAt: new Date().toISOString(),
//     });
//     res.json({ status: "success", id: result.id });
//   } catch (err) {
//     res.status(500).json({ error: "Save failed" });
//   }
// });

// // ✅ Get All Receipts
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
//   } catch {
//     res.status(500).json({ error: "Fetch failed" });
//   }
// });

// // ✅ Delete Receipt
// app.delete("/receipts/delete/:id", async (req, res) => {
//   try {
//     await db.collection("receipts").doc(req.params.id).delete();
//     res.json({ deleted: true });
//   } catch {
//     res.status(500).json({ error: "Delete failed" });
//   }
// });

// // ✅ Update Receipt
// app.put("/receipts/update/:id", async (req, res) => {
//   try {
//     await db.collection("receipts").doc(req.params.id).update(req.body);
//     res.json({ updated: true });
//   } catch {
//     res.status(500).json({ error: "Update failed" });
//   }
// });

// // ✅ Menu
// const menuData = require("./menu.json");
// app.get("/menu", (_, res) => {
//   res.json(menuData.menu || []);
// });

// // ✅ Business Info
// app.get("/business-info", async (_, res) => {
//   try {
//     const doc = await db.collection("settings").doc("businessInfo").get();
//     if (!doc.exists) return res.status(404).json({ error: "Not found" });
//     res.json(doc.data());
//   } catch {
//     res.status(500).json({ error: "Fetch failed" });
//   }
// });

// // ✅ Init Business Info (run once)
// app.post("/init-business-info", async (_, res) => {
//   try {
//     await db.collection("settings").doc("businessInfo").set({
//       name: "NELLAI KARUPATTI COFFEE",
//       addressLine1: "North Pradakshanam Road",
//       addressLine2: "Karur, TAMIL NADU",
//       phone: "7010452495",
//       gst: "33GGTPS6619J1ZJ",
//       logoUrl: "clean-cafe-6v7m0rdh5-kavis-projects-c1608ac3.vercel.app/Logo.png",
//     });
//     res.json({ success: true });
//   } catch {
//     res.status(500).json({ error: "Init failed" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });
