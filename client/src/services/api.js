import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Update if using a different port or domain
});

export const getProducts = () => API.get("/products");
export const placeOrder = (orderData) => API.post("/orders", orderData);
