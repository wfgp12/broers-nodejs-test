const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    const token = req.header('x-token')

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No token provided'
        });
    }
    
    try {
        const {uid, name, email} = jwt.verify(token, process.env.SECRET_KEY);

        req.user = {uid, name, email};
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Invalid token'
        });
    }

    next();
}

module.exports = { validateToken };