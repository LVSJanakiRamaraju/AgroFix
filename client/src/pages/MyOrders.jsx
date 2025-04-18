import { useState } from "react";
import axios from "axios";

function MyOrders() {
  const [identifier, setIdentifier] = useState(""); // contact or email
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/orders/buyer`, {
        params: { identifier }
      });

      let filtered = res.data;

      if (statusFilter) {
        filtered = filtered.filter(order => order.status === statusFilter);
      }

      if (dateFilter) {
        filtered = filtered.filter(order =>
          new Date(order.created_at).toISOString().split("T")[0] === dateFilter
        );
      }

      setOrders(filtered);
    } catch (err) {
      console.error("Error fetching orders:", err);
      alert("Error fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">My Orders</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Enter contact or email"
          className="border p-2 rounded w-full"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Delivered">Delivered</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={fetchOrders}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Track Orders
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 shadow-md bg-white"
            >
              <p><strong>Name:</strong> {order.name}</p>
              <p><strong>Email:</strong> {order.email}</p>
              <p><strong>Contact:</strong> {order.contact}</p>
              <p><strong>Products:</strong> {order.products}</p>
              <p><strong>Status:</strong> <span className="font-semibold">{order.status}</span></p>
              <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}

export default MyOrders;
