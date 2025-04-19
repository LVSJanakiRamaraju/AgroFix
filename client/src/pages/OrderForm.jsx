// src/pages/OrderForm.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OrderForm = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [buyerName, setBuyerName] = useState('');
  const [buyerContact, setBuyerContact] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const URL = import.meta.env.VITE_API_URL;

  const { token } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${URL}/api/products`);
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert('You must be logged in to place an order.');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        `${URL}/api/orders`,
        {
          buyer_name: buyerName,
          buyer_contact: buyerContact,
          delivery_address: deliveryAddress,
          product_id: selectedProduct,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      alert('Order placed successfully!');
    } catch (err) {
      console.error('Error placing order:', err?.response?.data || err.message);
      alert('Error placing order: ' + (err?.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Place Order</h1>
      <form onSubmit={handleSubmit}>
        {/* Product Select */}
        <div className="mb-4">
          <label htmlFor="product" className="block text-sm font-semibold">Select Product</label>
          <select
            id="product"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">--Choose Product--</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - ${product.price}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div className="mb-4">
          <label htmlFor="quantity" className="block text-sm font-semibold">Quantity</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Buyer Name */}
        <div className="mb-4">
          <label htmlFor="buyerName" className="block text-sm font-semibold">Your Name</label>
          <input
            type="text"
            id="buyerName"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Buyer Contact */}
        <div className="mb-4">
          <label htmlFor="buyerContact" className="block text-sm font-semibold">Contact Information</label>
          <input
            type="text"
            id="buyerContact"
            value={buyerContact}
            onChange={(e) => setBuyerContact(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Delivery Address */}
        <div className="mb-4">
          <label htmlFor="deliveryAddress" className="block text-sm font-semibold">Delivery Address</label>
          <textarea
            id="deliveryAddress"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="3"
            required
          ></textarea>
        </div>

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">Place Order</button>
      </form>
    </div>
  );
};

export default OrderForm;
