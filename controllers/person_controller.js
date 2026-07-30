import pool from '../db.js';


export const getAllPersons = async (req, res) => {
    try{
    const result = await pool.query('SELECT * FROM person');
    res.status(200).json(result.rows);
}
catch(error){
    console.error(error);
    res.status(500).json({error: 'Database Query Failed'});
}
}


export const addPerson = async (req, res) => {
   const { Name, Phone, Email } = req.body;

    try{
        const result = await pool.query(
            'INSERT INTO person ("Name", "Phone", "Email") VALUES ($1, $2, $3) RETURNING *',
            [Name, Phone, Email]
        );
        res.status(201).json(result.rows[0]);

    }
   catch(error){
    if (error.code === '23505') {
        return res.status(409).json({ error: 'Phone or email already exists' });
    }
    console.error(error);
    res.status(500).json({ error: 'Database Query Failed' });
}
}
