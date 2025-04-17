import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, { status });
      fetchOrders();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">All Orders</h2>
      {orders.map((order) => (
        <div key={order.id} className="border p-4 rounded mb-4 bg-gray-50">
          <p><strong>Name:</strong> {order.buyer_name}</p>
          <p><strong>Contact:</strong> {order.buyer_contact}</p>
          <p><strong>Address:</strong> {order.delivery_address}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Items:</strong></p>
          <ul className="list-disc ml-5">
            {JSON.parse(order.items).map((item, i) => (
              <li key={i}>{item.name} x {item.quantity}</li>
            ))}
          </ul>
          <div className="mt-2 space-x-2">
            <button onClick={() => updateOrderStatus(order.id, 'Accepted')} className="bg-blue-500 text-white px-2 py-1 rounded">Accept</button>
            <button onClick={() => updateOrderStatus(order.id, 'Rejected')} className="bg-red-500 text-white px-2 py-1 rounded">Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
