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
   const { name, phone, email } = req.body;

    try{
        const result = await pool.query(
            'INSERT INTO person (name, phone, email) VALUES ($1, $2, $3) RETURNING *',
            [name, phone, email]
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


export const updateperson = async (req, res) => {
    const { id } = req.params;
    const { name, phone, email } = req.body;

    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (name !== undefined) {
        fields.push(`name = $${paramIndex}`);
        values.push(name);
        paramIndex++;
    }
    if (phone !== undefined) {
        fields.push(`phone = $${paramIndex}`);
        values.push(phone);
        paramIndex++;
    }
    if (email !== undefined) {
        fields.push(`email = $${paramIndex}`);
        values.push(email);
        paramIndex++;
    }

    if (values.length === 0) {
        return res.status(400).json({ error: 'No values were sent' });
    }

    // add id as last parameter
    values.push(id);
    const idParamIndex = paramIndex;

    const query = `UPDATE person SET ${fields.join(', ')} WHERE id = $${idParamIndex} RETURNING *`;

    try {
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Person Not Found' });
        }
        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Database Query Failed' });
    }
};


export const deletePerson = async (req, res) => {
    const {id} = req.params;
try{
    const result = await pool.query(
    'DELETE FROM person WHERE id = $1 RETURNING id',
    [id])

    if(result.rows.length === 0){
      return res.status(404).json({ error: 'Person Not Found' });
    }
    return res.status(204).send();
}
catch(error){
    console.log(error);
    res.status(500).json({error: 'Data Query Failed'});
}
    
;
}