const jwt = require('jsonwebtoken');
require('dotenv').config();

function authLogin(req,res,next) {
    console.log(req.headers);
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    const authToken = authHeader && authHeader.split(' ')[1];

    if(!authToken){
        return res.status(401).json({ error: 'Token not provided' });
    }

    jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if(err){
            return res.status(403).json({ error: 'forbidden' });
        }
        req.user= data.user
        next();
    });
}

module.exports={authLogin};