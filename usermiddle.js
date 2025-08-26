const jwt = require('jsonwebtoken');

function userMiddleware(req, res, next) {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
        req.userId = decoded.userId;
        next();
    }catch(err){
        return res.status(401).json({ error: 'Invalid token' });
    }
}

module.exports = {
    userMiddleware
};