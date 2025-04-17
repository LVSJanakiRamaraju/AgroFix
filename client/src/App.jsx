import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductCatalogue from './pages/ProductCatalogue';
import OrderForm from './pages/OrderForm';
import AdminOrders from './pages/AdminOrders';

function App() {
  return (
    <Router>
      <nav className="bg-green-700 text-white p-4 flex justify-around">
        <Link to="/">Catalogue</Link>
        <Link to="/order">Place Order</Link>
        <Link to="/admin">Admin Orders</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ProductCatalogue />} />
        <Route path="/order" element={<OrderForm />} />
        <Route path="/admin" element={<AdminOrders />} />
      </Routes>
    </Router>
  );
}

export default App;
