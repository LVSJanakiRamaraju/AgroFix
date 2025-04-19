import { useState, useEffect } from "react";
import { useAuth } from '../context/authContext.jsx';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function AdminInventory() {
  const { user, token } = useAuth();
  const [products, setProducts] = useState([]);
  
  const [editId, setEditId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  });
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);

    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
    } else {
      fetchProducts();
    }
  }, [user, token, navigate]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/products', newProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewProduct({ name: '', description: '', price: '', stock: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleUpdate = async () => {
    console.log("Updating product with ID:", editId); // Debugging line
    console.log("New product data:", newProduct); // Debugging line
    try {
      await axios.put(`http://localhost:5000/api/products/${editId}`, newProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditId(null);
      setNewProduct({ name: '', description: '', price: '', stock: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this product?")) {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Inventory Management</h1>

      <div className="bg-white p-6 rounded shadow mb-8">
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
          {editId ? (
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 col-span-full md:w-1/2 md:ml-auto"
          >
            Save Changes
          </button>
        ) : (
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 col-span-full md:w-1/2 md:ml-auto"
          >
            Add Product
          </button>
        )}
        </form>
      </div>

      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Qty</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod.id} className="border-b">
              <td className="p-2 border">{prod.name}</td>
              <td className="p-2 border">₹{prod.price}</td>
              <td className="p-2 border">{prod.stock}</td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => setEditId(prod.id)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(prod.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminInventory;
