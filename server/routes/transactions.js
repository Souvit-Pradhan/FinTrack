import express from "express";
import Transaction from "../models/Transaction.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.get("/", async (req, res) => {
  const transactions = await Transaction.find({ user: req.userId }).sort({ date: -1 });
  res.json(transactions);
});

router.post("/", async (req, res) => {
  try {
    const { title, amount, type, category, date } = req.body;

    if (!title || !amount || !type || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = await Transaction.create({
      user: req.userId, title, amount, type, category, date
    });

    res.status(201).json(transaction);
  } catch {
    res.status(500).json({ message: "Could not create transaction" });
  }
});

router.delete("/:id", async (req, res) => {
  const deleted = await Transaction.findOneAndDelete({
    _id: req.params.id,
    user: req.userId
  });

  if (!deleted) return res.status(404).json({ message: "Transaction not found" });
  res.json({ message: "Transaction deleted" });
});

export default router;
