import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserDashboard = () => {
  const { user, token } = useAuth(); // Get user data from context
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if the user is not authenticated
    if (!user) {
      navigate('/login'); // Redirect to login if not authenticated
    } else {
      // Fetch user orders (this can be adapted based on your database schema)
      axios.get('http://localhost:5000/api/orders', {
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
                <td className="py-2 px-4">{order.product_name}</td>
                <td className="py-2 px-4">{order.quantity}</td>
                <td className="py-2 px-4">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDashboard;
