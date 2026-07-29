import express from 'express';
import pool from '../db.js';
import logger from '../middleware/logger.js';
const router = express.Router();

router.get('/api', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

router.get('/api/posts', (req, res) => {
    res.send('Posts Page');
})


export default router;