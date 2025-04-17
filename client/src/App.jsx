import React from "react";
import ProductList from "./components/ProductList";
import OrderForm from "./components/OrderForm";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-6">
      <ProductList />
      <OrderForm />
    </div>
  );
}

export default App;
