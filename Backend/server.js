const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Firebase Admin
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const app = express();
const PORT = 4000;

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
    const snapshot = await db.collection("receipts").orderBy("createdAt", "desc").get();
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


// Update a receipt by ID
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
const menuData = require("./menu.json"); // Must exist!
app.get("/menu", (req, res) => {
  res.json(menuData.menu || []);
});

// =============================
// ✅ Start server
// =============================
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
