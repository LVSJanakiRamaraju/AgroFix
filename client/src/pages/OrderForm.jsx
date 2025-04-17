// src/pages/OrderForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderForm = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [buyerName, setBuyerName] = useState('');
  const [buyerContact, setBuyerContact] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        buyer_name: buyerName,
        buyer_contact: buyerContact,
        delivery_address: deliveryAddress,
        items: [
          {
            product_id: selectedProduct,
            quantity: quantity,
          },
        ],
      };
      await axios.post('http://localhost:5000/api/orders', orderData);
      alert('Order placed successfully!');
    } catch (err) {
      console.error('Error placing order:', err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Place Order</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="product" className="block text-sm font-semibold">Select Product</label>
          <select
            id="product"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">--Choose Product--</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - ${product.price}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="quantity" className="block text-sm font-semibold">Quantity</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="buyerName" className="block text-sm font-semibold">Your Name</label>
          <input
            type="text"
            id="buyerName"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="buyerContact" className="block text-sm font-semibold">Contact Information</label>
          <input
            type="text"
            id="buyerContact"
            value={buyerContact}
            onChange={(e) => setBuyerContact(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="deliveryAddress" className="block text-sm font-semibold">Delivery Address</label>
          <textarea
            id="deliveryAddress"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="3"
          ></textarea>
        </div>

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">Place Order</button>
      </form>
    </div>
  );
};

export default OrderForm;
