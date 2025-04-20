// src/pages/AdminDashboard.js
import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/authContext.jsx';
import { useNavigate } from 'react-router-dom';
import AdminInventory from './AdminInventory.jsx'; 
import axios from 'axios';

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  });
  const navigate = useNavigate();

  const validTransitions = {
    "Pending": ["In Progress"],
    "In Progress": ["Delivered"],
    "Delivered": []
  };

  const URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
    } else {
      fetchProducts();
    }
  }, [user, token, navigate]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);


      axios.get(`${URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          setOrders(response.data);
        })
        .catch((error) => {
          console.error('Error fetching orders:', error);
        });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    console.log("Updating order status:", orderId, newStatus); // Debugging line
    try {
      await axios.put(
        `${URL}/api/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}`,  'Content-Type': 'application/json' } }
      );
      fetchProducts();
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert("Failed to update order status.");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${URL}/api/products`, newProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewProduct({ name: '', description: '', price: '', stock: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

    const productMap = useMemo(() => {
      const map = {};
      products.forEach((p) => {
        map[p.id] = p.name;
      });
      return map;
    }, [products]);

  return (
    <div className="admin-dashboard p-6">
      <h1 className="text-3xl font-bold mb-4 text-center text-green-700">Admin Dashboard</h1>

      {/* Add Product Form */}
      {/* <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Product</h2>
        <form onSubmit={handleAddProduct} className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="border border-gray-300 px-4 py-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="border border-gray-300 px-4 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className="border border-gray-300 px-4 py-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newProduct.stock}
            onChange={(e) =>
              setNewProduct({ ...newProduct, stock: e.target.value })
            }
            className="border border-gray-300 px-4 py-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 col-span-full md:w-1/2 md:ml-auto"
          >
            Add Product
          </button>
        </form>
      </div> */}
      <AdminInventory/>

      <h2 className="text-xl font-semibold mt-8 mb-2 text-gray-800">Orders</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded shadow">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Buyer</th>
              <th className="py-3 px-4 text-left">Product</th>
              <th className="py-3 px-4 text-left">Quantity</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-gray-200 hover:bg-blue-50">
                <td className="py-2 px-4">{order.id}</td>
                <td className="py-2 px-4">{order.buyer_name || 'N/A'}</td>
                <td className="py-2 px-4">{productMap[order.product_id] || "Unknown Product"}</td>
                <td className="py-2 px-4">{order.quantity}</td>
                <td className="py-2 px-4">
                  <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{order.status}</span>
                      {validTransitions[order.status]?.length > 0 && (
                        <select
                          className="text-sm border px-2 py-1 rounded"
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          defaultValue=""
                        >
                          <option value="" disabled>Change</option>
                          {validTransitions[order.status].map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      )}
                    </div>
                </td>
                <td className="py-2 px-4">{new Date(order.updated_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AdminDashboard;
