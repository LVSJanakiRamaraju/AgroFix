import React, { useEffect, useState } from "react";
import { getProducts, placeOrder } from "../services/api";

const OrderForm = () => {
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [formData, setFormData] = useState({
    buyer_name: "",
    buyer_contact: "",
    delivery_address: "",
  });

  useEffect(() => {
    getProducts().then((res) => setProducts(res.data));
  }, []);

  const handleQuantityChange = (productId, quantity) => {
    setSelectedItems({ ...selectedItems, [productId]: Number(quantity) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const items = Object.entries(selectedItems).map(([id, quantity]) => ({
      productId: id,
      quantity,
    }));

    const orderData = { ...formData, items };

    try {
      await placeOrder(orderData);
      alert("Order placed successfully!");
      setFormData({ buyer_name: "", buyer_contact: "", delivery_address: "" });
      setSelectedItems({});
    } catch (error) {
      alert("Failed to place order.");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Place Bulk Order</h2>

      {["buyer_name", "buyer_contact", "delivery_address"].map((field) => (
        <input
          key={field}
          type="text"
          placeholder={field.replace("_", " ").toUpperCase()}
          className="block w-full mb-3 p-2 border rounded"
          value={formData[field]}
          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
          required
        />
      ))}

      <h3 className="font-medium mb-2">Select Products</h3>
      {products.map((product) => (
        <div key={product._id} className="mb-2">
          <label className="block font-medium">
            {product.name} (₹{product.price})
          </label>
          <input
            type="number"
            min="0"
            placeholder="Quantity"
            className="w-full p-2 border rounded"
            value={selectedItems[product._id] || ""}
            onChange={(e) => handleQuantityChange(product._id, e.target.value)}
          />
        </div>
      ))}

      <button
        type="submit"
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Submit Order
      </button>
    </form>
  );
};

export default OrderForm;
