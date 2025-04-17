import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  buyer_name: { type: String, required: true },
  buyer_contact: { type: String, required: true },
  delivery_address: { type: String, required: true },
  items: { type: Array, required: true }, // An array of product IDs and quantities
  status: { type: String, default: "Pending" }, // e.g., Pending, In Progress, Delivered
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
