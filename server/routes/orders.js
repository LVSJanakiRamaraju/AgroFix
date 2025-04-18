import express from 'express';
import pool from '../db.js';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';
const router = express.Router();

// Place new order
router.use(verifyToken);
router.use(verifyAdmin);

router.post('/', async (req, res) => {
  const { buyer_name, buyer_contact, delivery_address, items } = req.body;
  try {
    console.log('Received Order:', req.body);
    const result = await pool.query(
      `INSERT INTO orders (buyer_name, buyer_contact, delivery_address, items) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [buyer_name, buyer_contact, delivery_address, JSON.stringify(items)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get order' });
  }
});

// Admin: Get all orders
// GET all orders
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Database error while fetching orders' });
  }
});


// Admin: Update order status
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// GET /api/orders/buyer?identifier=value
router.get('/buyer', async (req, res) => {
  const { identifier } = req.query;

  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE contact = $1 OR email = $1 ORDER BY created_at DESC',
      [identifier]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching buyer orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/buyer/:contact', async (req, res) => {
  const { contact } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE contact = $1 ORDER BY created_at DESC',
      [contact]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching buyer orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
