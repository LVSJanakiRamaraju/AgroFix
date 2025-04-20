import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
dotenv.config(); // must be at top before using env vars

import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import authRoutes from './routes/auth.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.json());

// Database Connection
pool.connect((err) => {
  if (err) {
    console.error('❌ Database connection error:', err.stack);
  } else {
    console.log('✅ Connected to PostgreSQL database');
  }
});

const allowedOrigins = [
  'https://agro-fix-one.vercel.app',
  'http://localhost:5173',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
