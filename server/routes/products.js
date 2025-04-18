import express from 'express';
import pool from '../db.js';  // PostgreSQL pool instance

const router = express.Router();

// ✅ GET all products
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Database error while fetching products' });
  }
});

// ✅ POST new product
router.post('/', async (req, res) => {
  const { name, description, price, quantity_available } = req.body;

  if (!name || price === undefined || quantity_available === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO products (name, description, price, quantity_available) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description || '', price, quantity_available]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// ✅ PUT update product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity_available } = req.body;

  try {
    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, quantity_available = $4 WHERE id = $5 RETURNING *',
      [name, description, price, quantity_available, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// ✅ DELETE product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
