
import pool from "../db.js";

export const newLead = async (req, res) => {
    const { first_name, last_name, email, phone } = req.body;

    if(!first_name){
        return res.status(400).json({error: 'First Name Is Missing'});
    }
    if(!last_name){
        return res.status(400).json({error: 'Last Name Is Missing'});
    }
    if(!email){
        return res.status(400).json({error: 'Email Is Missing'});
    }
    if(!phone){
        return res.status(400).json({error: 'Phone Is Missing'});
    }


    try{
        const result = await pool.query('INSERT INTO leads(first_name, last_name, email, phone) VALUES ($1, $2, $3, $4) RETURNING *',[first_name, last_name, email, phone])
        return res.status(201).json(result.rows[0]);


    }
    
    catch(error){
        console.log(error);
        res.status(500).json({error: 'Data Query Failed'});
    }
}

export const getLeads = async (req, res) => {

    try{
        const result = await pool.query('SELECT * FROM leads')
        return res.status(200).json(result.rows);

    }
    catch(error){
        return res.status(500).json({error: 'Data Query Failed'});
    }

}

export const getOneLead = async (req, res) => {
    const { id } = req.params;

    if(!id){
      return res.status(400).json({error: 'ID is Missing'});
    }
    try{
    const result = await pool.query('SELECT * FROM leads WHERE id = $1', [id]);
     if(result.rows.length === 0){
        return res.status(404).json({error: 'Lead Not Found'});
    }
    return res.status(200).json(result.rows[0]);

    }

   
    catch(error){
        return res.status(500).json({error: 'Data Query Failed'});

    }
}


export const updateLead = async (req, res) => {

    const { first_name, last_name, email, phone, user_id } = req.body;
    const { id } = req.params;

    if(!first_name){
        return res.status(400).json({error: 'First name is Missing'});
    }
    if(!last_name){
        return res.status(400).json({error: 'Last name is Missing'});
    }
    if(!email){
        return res.status(400).json({error: 'Email is Missing'});
    }
    if(!phone){
        return res.status(400).json({error: 'Phone is Missing'});
    }
    if(!id){
        return res.status(400).json({error: 'ID is Missing'});
    }

    const values = [];
    const fields = [];
    let paramIndex = 1;

    if(first_name !== undefined){
        fields.push(`first_name = $${paramIndex}`);
        values.push(first_name)
        paramIndex ++;
    }

    if(last_name !== undefined){
        fields.push(`last_name = $${paramIndex}`);
        values.push(last_name);
        paramIndex ++;

    }

    if(email !== undefined){

        fields.push(`email = $${paramIndex}`);
        values.push(email);
        paramIndex ++;
    }
    if(phone !== undefined){

        fields.push(`phone = $${paramIndex}`);
        values.push(phone);
        paramIndex ++;
    }
    if(user_id !== undefined){
        fields.push(`user_id = $${paramIndex}`);
        values.push(user_id);
        paramIndex ++;
}

    const idParamIndex = paramIndex;
    values.push(id);

   const query = `UPDATE leads SET ${fields.join(', ')} WHERE id = $${idParamIndex} RETURNING *`;


try{
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Lead Not Found' });
        }
        return res.status(200).json(result.rows[0]);

}
catch(error){
    return res.status(500).json({error: 'Data Query Failed'})
}


} 

export const deleteLead = async (req, res) => {

    const { id } = req.params;

    if(!id){
        return res.status(400).json({error: 'ID is Missing'})
    }

    try{
        const result = await pool.query('DELETE FROM leads WHERE id = $1 RETURNING id', [id]);
        if(result.rows.length === 0){
    return res.status(404).json({error: 'Lead Not Found'});
  }
  return res.status(204).send();

    }
    catch(error){

        console.log(error);
        res.status(500).json({error: 'Data Query Failed'})
    }
}