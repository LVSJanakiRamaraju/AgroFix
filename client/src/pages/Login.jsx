// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  // Modify the login function to store the role in localStorage
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        const { token, isAdmin } = response.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('Admin', response.data.isAdmin);  // Store user role
        localStorage.setItem('user', JSON.stringify({ email, isAdmin }));
        await login(email, password);
        console.log(response.data);
        if (response.data.isAdmin) {
        navigate('/admin-dashboard');
      } else {
        navigate('/');
      }
        } catch (err) {
            console.error(err);
        setError('Invalid email or password');
        }
    };
    

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block">Email</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full px-4 py-2 border border-gray-300 rounded" 
            required 
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block">Password</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full px-4 py-2 border border-gray-300 rounded" 
            required 
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default Login;
