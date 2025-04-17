import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// Place an order
router.post("/", async (req, res) => {
  const { buyer_name, buyer_contact, delivery_address, items } = req.body;
  const newOrder = new Order({ buyer_name, buyer_contact, delivery_address, items });

  try {
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all orders (Admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID (Buyer)
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
