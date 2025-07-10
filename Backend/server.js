const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./serviceAccountKey.json");

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// Save receipt
app.post("/print", async (req, res) => {
  try {
    const data = req.body;
    const createdAt = new Date().toISOString();
    await db.collection("receipts").add({ ...data, createdAt });
    res.json({ status: "success", saved: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save receipt" });
  }
});

// Get all receipts
app.get("/receipts", async (req, res) => {
  try {
    const snapshot = await db.collection("receipts").orderBy("createdAt", "desc").get();
    const receipts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(receipts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch receipts" });
  }
});

// Delete a receipt by Firestore document ID
app.delete("/receipts/delete/:id", async (req, res) => {
  try {
    await db.collection("receipts").doc(req.params.id).delete();
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete receipt" });
  }
});

// Serve static menu data
const menuData = require("./menu.json"); // Place menu array inside this file
app.get("/menu", (req, res) => {
  res.json(menuData.menu); // assuming menu.json exports { menu: [...] }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
