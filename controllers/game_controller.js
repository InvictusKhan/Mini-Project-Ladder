import pool from '../db.js';

export const getAllGames = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM games');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database query failed' });
  }
};


