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
  const { name, genre, price} = req.body;


  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
}
if (!genre) {
    return res.status(400).json({ error: 'Genre is required' });
}
if (!price) {
    return res.status(400).json({ error: 'Price is required' });
}

  try {
    const result = await pool.query(
      'INSERT INTO games(name, genre, price, person_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, genre, price, null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database query failed' });
  }
};


export const deleteGame = async (req, res) => {

const {id} = req.params;

try{
const result = await pool.query('DELETE FROM games WHERE id = $1 RETURNING id', [id]);

  if(result.rows.length === 0){
    return res.status(404).json({error: 'Game Not Found'});
  }
  return res.status(204).send();
}

catch(error){
  console.log(error);
  return res.status(500).json({error: 'Data Query Failed'});
}


}

export const updateGame = async (req, res) => {
const { id } = req.params;
const { name, genre, price, person_id } = req.body;

let values = [];
let fields = [];
let paramIndex = 1;

if (name !== undefined){
  fields.push(`name = $${paramIndex}`)
  values.push(name);
  paramIndex ++;
}

if (genre !== undefined){
  fields.push(`genre = $${paramIndex}`);
  values.push(genre);
  paramIndex ++;

}

if(price !== undefined){
  fields.push(`price = $${paramIndex}`);
  values.push(price);
  paramIndex ++;
}
if(person_id !== undefined){
  fields.push(`person_id = $${paramIndex}`);
  values.push(person_id);
  paramIndex ++;
}
if (values.length === 0) {
        return res.status(400).json({ error: 'No values were sent' });
    }

let idParamIndex = paramIndex;
values.push(id);
const query = (`UPDATE games SET ${fields.join(', ')} WHERE id = $${idParamIndex} RETURNING *`);
try{
  const result = await pool.query(query, values);
  if (result.rows.length === 0){
    return res.status(404).json({error: 'Game not found'});
  }
  res.status(200).json(result.rows[0]);
}
catch(error){
  console.log(error);
  res.status(500).json({error: 'Data Query Failed'});
}


}