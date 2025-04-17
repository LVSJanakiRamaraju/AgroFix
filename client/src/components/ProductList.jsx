import React, { useEffect, useState } from "react";
import { getProducts } from "../services/api";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Available Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="border rounded-xl p-4 shadow-md">
            <h2 className="font-semibold text-lg">{product.name}</h2>
            <p>Price: ₹{product.price}</p>
            {product.description && <p className="text-gray-500">{product.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
