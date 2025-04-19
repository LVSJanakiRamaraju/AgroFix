import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext.jsx';
import { useNavigate } from 'react-router-dom';
import ProductCatalogue from './ProductCatalogue.jsx';
import OrderForm from './OrderForm.jsx';
import axios from 'axios';

const UserDashboard = () => {
  const { user} = useAuth(); 
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); 

  const URL = import.meta.env.VITE_API_URL 

  useEffect(() => {

    if (!user) {
      navigate('/login'); 
    } else {
      
      axios.get(`${URL}/api/orders/buyer/${user.name}`, {

        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          setOrders(response.data);
        })
        .catch((error) => {
          console.error('Error fetching orders:', error);
        });
    }
  }, [user, token, navigate]);

  return (
    <div className="user-dashboard p-6">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-700">User Dashboard</h1>

      {/* Display user information */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Welcome, {user?.name}!</h2>
        <p className="text-gray-600">Email: {user?.email}</p>
      </div>

      <h2 className="text-xl font-semibold mb-2 text-gray-800">Your Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded shadow">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Product</th>
              <th className="py-3 px-4 text-left">Quantity</th>
              <th className="py-3 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-gray-200 hover:bg-blue-50">
                <td className="py-2 px-4">{order.id}</td>
                <td className="py-2 px-4">{order.product_id}</td>
                <td className="py-2 px-4">{order.quantity}</td>
                <td className="py-2 px-4">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={() => navigate('/product-catalogue')}>Browse Products</button>
        <OrderForm />
    </div>
  );
};

export default UserDashboard;
