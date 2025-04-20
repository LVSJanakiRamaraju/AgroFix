import express from 'express';
import pool from '../db.js';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Buyer: Place new order (authenticated users only)
router.post('/', verifyToken, async (req, res) => {
  const { buyer_name, buyer_contact, delivery_address, product_id, quantity } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const productRes = await client.query(
      'SELECT stock FROM products WHERE id = $1 FOR UPDATE',
      [product_id]
    );

    if (productRes.rows.length === 0) {
      throw new Error('Product not found');
    }

    const availableQty = productRes.rows[0].stock;

    if (quantity > availableQty) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Out of Stock' });
    }

    const orderResult = await client.query(
      `INSERT INTO orders (buyer_name, buyer_contact, delivery_address, product_id, quantity) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [buyer_name, buyer_contact, delivery_address, product_id, quantity]
    );


    await client.query(
      'UPDATE products SET stock = stock - $1 WHERE id = $2',
      [quantity, product_id]
    );

    await client.query('COMMIT');

    res.status(201).json(orderResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error placing order:', err.message);
    res.status(500).json({ error: 'Failed to place order' });
  } finally {
    client.release();
  }
});

// Admin: Get order by ID
router.get('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ error: 'Failed to get order' });
  }
});

// Admin: Get all orders
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY order_date DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Database error while fetching orders' });
  }
});

// Admin: Update order status
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  console.log('Updating order status:', { id, status });
  const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid order status' });
  }

  try {

    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );

    res.json({ message: 'Order status updated', order: result.rows[0] });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});


// Buyer: Get orders by identifier (contact or name)
router.get('/buyer', verifyToken, async (req, res) => {
  const { identifier } = req.query;
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE buyer_contact = $1 OR buyer_name = $1 ORDER BY order_date DESC',
      [identifier]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching buyer orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Buyer: Get orders by contact
router.get('/buyer/:contact', verifyToken, async (req, res) => {
  const { contact } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE buyer_name = $1 ORDER BY order_date DESC',
      [contact]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching buyer orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
