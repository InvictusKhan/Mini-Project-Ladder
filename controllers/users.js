import pool from "../db.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from "crypto";
import { error } from "console";
const PORT = process.env.PORT;



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
    const email_token = crypto.randomBytes(32).toString("hex");
  

    try{

        const result = await pool.query('INSERT INTO users(user_name, email, password_hash, verify_token) VALUES ($1, $2, $3, $4) RETURNING id, user_name, email', [username, email, hashedPassword, email_token]);
        console.log(`http://localhost:${process.env.PORT}/api/verify-email?token=${email_token}`);
        res.status(201).json(result.rows[0]);
        
    }

    catch(error){
        console.log(error);
        res.status(500).json({error: 'Data Query Failed'});
    }
    
}

export const getUsers = async (req, res) => {

    try{
    
    const result = await pool.query('SELECT id, user_name, email FROM users')
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
          if(!user.is_verified){
            return res.status(403).json({error: 'Please Verify Email'});
        }

        const token = jwt.sign(
            {id: user.id }, 
            process.env.SECRET_KEY, 
            {expiresIn: '1h'}
        );

       

       const refreshToken = jwt.sign(
        {id: user.id},
        process.env.REFRESH_SECRET,
        {expiresIn: '7d'}
       )

       await pool.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, user.id]);

       res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 *1000,
       });
      res.status(200).json({ token });



    }
catch(error){
    console.log(error);
    return res.status(500).json({error: 'Data Query Failed'});

}


}


export const verifyRefreshToken = async (req, res) => {

    
    const token = req.cookies.refreshToken;

    if(!token){
        return res.status(401).json({error: 'Token Doesnt Exist'});
    }

    try{

        const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

        const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);

        const user = result.rows[0];

        if(!user || user.refresh_token !== token){
            return res.status(401).json({error: 'Expired or Invalid Refresh token'});
        }
        const newAccessToken = jwt.sign(
            {id: user.id},
            process.env.SECRET_KEY,
            {expiresIn: '1h'}
        )

    
        return res.status(200).json({token: newAccessToken});



  }
  catch(error){
    console.log(error);
    res.status(401).json({error: 'Expired or Invalid Refresh Token'});
  }

}

export const logOut = async (req, res) => {

    const token = req.cookies.refreshToken;

    if(!token){
        return res.status(200).json({error: 'Already Logged Out'});
    }


    try{
    await pool.query('UPDATE users SET refresh_token = NULL WHERE refresh_token = $1', [token]);
    res.clearCookie("refreshToken");

   return res.status(200).json({message: 'Log out successful'});

}
catch(error){
    console.log(error);
    return res.status(500).json({error: 'Log out failed'})
}

}

export const verify_token_click = async (req, res) => {

    const { token } = req.query

    if(!token){
        return res.status(400).json({message: 'Token not found'});
    }

    try{

        const result = await pool.query('SELECT * FROM users WHERE verify_token = $1', [token]);
        
        if(result.rows.length === 0){
            return res.status(401).json({error: 'Invalid Token'})
        }
        const user = result.rows[0];

        await pool.query('UPDATE users SET verify_token = $1, is_verified = $2 WHERE id = $3', [null, true, user.id]);
        return res.status(200).json({message: 'Email Verified'});


    }
    catch(error){
        console.log(error)
        return res.status(500).json({error: 'Data Query Failed'});
    }
}