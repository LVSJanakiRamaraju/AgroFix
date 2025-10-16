
# 🥦 Agrofix - Fruit & Vegetable Ordering System

Agrofix is a full-stack web application designed for **ordering** of vegetables and fruits. It enables seamless communication and transactions between **buyers** and **admins**. Buyers can place orders and track them, while admins can manage inventory and update order statuses.

---

## 🚀 Features

### 👨‍🌾 Buyer Side:
- Browse available vegetables and fruits.
- Place orders with quantity, delivery address, and contact info.
- Track your orders by name or contact number.

### 👩‍💼 Admin Side:
- Admin login authentication with JWT.
- View all buyer orders.
- Update order statuses: `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`.
- Manage product stock and inventory.

---

## 🛠️ Tech Stack

- **Frontend:** React.js (Vite), Tailwind CSS, Axios  
- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL (via Neon.tech)  
- **Authentication:** JWT (JSON Web Tokens)  
- **Deployment:** Vercel (Frontend) & Render (Backend)

---

## 🖥️ Setup Instructions (Local)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/LVSJanakiRamaraju/AgroFix.git
cd AgroFix
```

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

#### ✏️ Create `.env` File

```env
PORT=5000
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/agrofix
JWT_SECRET=your_jwt_secret
```

#### ▶️ Start Backend

```bash
node index.js
```

---

### 3️⃣ Frontend Setup

```bash
cd ..
cd client
npm install
npm run dev
```

Make sure this is set in the frontend config/API file:

```js
const URL = "http://localhost:5000";
```

---

## 🗃️ PostgreSQL Database Setup

Run the following schema setup in your PostgreSQL client (like pgAdmin, psql, or Neon):

```sql
-- Products Table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  price DECIMAL(10,2),
  stock INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  buyer_name VARCHAR(255) NOT NULL,
  buyer_contact VARCHAR(15) NOT NULL,
  delivery_address TEXT NOT NULL,
  product_id INT REFERENCES products(id) ON DELETE SET NULL, 
  quantity INT NOT NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'Pending', 
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE
);
```


---

## 📦 API Endpoints

| Method | Endpoint                        | Description                           |
|--------|----------------------------------|---------------------------------------|
| POST   | `/api/orders`                   | Place a new order (Buyer)              |
| GET    | `/api/products`                 | Fetch the product catalogue.           |
| POST   | `/api/orders`                   | Place a new order.                     |
| GET    | `/api/orders/:id`               | View order details (for buyers).       |
| GET    | `/api/orders`                   | View all orders (for admins).          |
| PUT    | `/api/orders/:id`               | Update order status (for admins).      |
| POST   | `/api/products`                 | Add a new product (for admins).        |
| PUT    | `/api/products/:id`             | Edit an existing product (for admins). |
| DELETE | `/api/products/:id`             | Remove a product (for admins).         |

---

## 🔐 Authentication

- Admins login using email & password.
- Protected routes require a valid JWT token passed in the `Authorization` header.
- Example:  
  ```http
  Authorization: Bearer <your_token_here>
  ```

---

## 🔄 Order Status Update (Admin Frontend)

When an admin changes order status in the dropdown:


## 🔮 Future Improvements

- Send email to buyer after placing an order.
- Upload and display product images.
- Add search, filter & sort features.
- Add analytics dashboard for admin.

---

## 🤝 Contributing

1. Fork the repo  
2. Create a new branch: `git checkout -b my-feature`  
3. Make your changes  
4. Push and open a pull request  

---

## 📧 Contact

- **Email:** rajakanumuri2005@gmail.com 
- **Portfolio:** [My Profile](https://ramarajuportfolio.vercel.app/)

---

## 📝 License

This project is licensed under the **MIT License**.
