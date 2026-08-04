import pool from "../db.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const addUser = async (req, res) => {

    const  { username, email, password } = req.body;

    if(!username){
        return res.status(400).json({error: 'Username is missing'});
    }
    if(!email){
        return res.status(400).json({error: 'Email is missing'});
    }
    if(!password){
        return res.status(400).json({error: 'Password is missing'});
    }


    const hashedPassword = await bcrypt.hash(password, 10);
  

    try{

        const result = await pool.query('INSERT INTO users(user_name, email, password_hash) VALUES ($1, $2, $3) RETURNING *', [username, email, hashedPassword]);
        res.status(200).json({message: 'User Added Successfully'});
    }

    catch(error){
        console.log(error);
        res.status(500).json({error: 'Data Query Failed'});
    }
    
}

export const getUsers = async (req, res) => {

    try{
    const result = await pool.query('SELECT * FROM users')
    res.status(200).json(result.rows);
}
catch(error){
    console.log(error);
    res.status(500).json({error: 'Data Query Failed'});
}
}



export const login = async (req, res) => {

    const { email, password } = req.body;
   

    if(!email){
       return res.status(400).json({error: 'Email is Missing'});
        
    }
    if(!password){

       return res.status(400).json({error: 'Password is Missing'});
    }

    try{
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if(result.rows.length === 0){
          return res.status(400).json({error: 'Email not found'});
        }

        const user = result.rows[0];

        const matchPassword = await bcrypt.compare(password, user.password_hash);

        if(!matchPassword){
          return  res.status(400).json({error: 'Password didnt match'});
        }

        const token = jwt.sign(
            {id: user.id }, process.env.SECRET_KEY, {expiresIn: '1h'}
        );

       res.status(200).json({ token });



    }
catch(error){
    console.log(error);
    return res.status(500).json({error: 'Data Query Failed'});

}


}