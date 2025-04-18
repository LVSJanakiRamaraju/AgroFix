// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if the user is not authenticated or not an admin
    if (!user || !user.isAdmin) {
      navigate('/'); // redirect to home if not admin
    } else {
      // Fetch products only if the user is admin
      axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          setProducts(response.data);
        })
        .catch((error) => {
          console.error('Error fetching products:', error);
        });
    }
  }, [user, token, navigate]);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <h2>Product List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity Available</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.quantity_available}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
