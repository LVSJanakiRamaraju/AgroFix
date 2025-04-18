import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 p-6">
      <h1 className="text-4xl font-bold text-green-800 mb-4">Welcome to Agro-Fix</h1>
      <p className="text-lg text-gray-700 text-center max-w-xl mb-8">
        Streamlining bulk fruit and vegetable orders for buyers and efficient inventory management for admins. Fast, reliable, and easy to use!
      </p>
      <div className="flex gap-4">
        <Link to="/login">
          <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">Login</button>
        </Link>
        <Link to="/register">
          <button className="bg-white text-green-700 border border-green-600 px-6 py-2 rounded hover:bg-green-50 transition">Register</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
