import jwt from "jsonwebtoken";

 const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;


    if(!authHeader){
        return res.status(401).json({error: 'Token Not Found'})
    }

    const token = authHeader.split(' ')[1];

    if(!token){
       return res.status(401).json({error: 'Malformed Token'});
    }

    try{
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    req.user = decoded;
    next();
    }
    catch(error){
        console.log(error);
       return res.status(401).json({error: 'Invalid or Expired Token'})
    }
}

export default verifyToken;