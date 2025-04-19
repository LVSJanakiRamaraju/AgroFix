// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import { AuthProvider } from './context/authContext';
import ProductCatalogue from './pages/ProductCatalogue';

const App = () => {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Home />} />
        
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected route */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute element={<AdminDashboard />} />
          }
        />
        <Route path='/user-dashboard' element={<UserDashboard />} />
        <Route path='/product-catalogue' element={<ProductCatalogue />}/>
      </Routes>
    </Router>
    </AuthProvider>
  );
};

export default App;
