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

export const addGame = async (req, res) => {
  const { name, genre, price, person_id } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO games(name, genre, price, person_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, genre, price, person_id ?? null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database query failed' });
  }
};
