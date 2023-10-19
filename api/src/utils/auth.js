const jsonwebtoken = require('jsonwebtoken');
const { config } = require('../config/config');

const generateAuthToken = async (user) => {
    const token = await jsonwebtoken.sign({ _id: user._id, role: user.role }, config.jwtSecret, { expiresIn: '1d' });
    return token;
}

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                status: false,
                message: 'Unauthorized access',
            });
        }
        const decoded = await jsonwebtoken.verify(token, config.jwtSecret);
        req.user = { _id: decoded._id, role: decoded.role };
        next();
    } catch (error) {
        return res.status(401).json({
            status: false,
            message: 'Unauthorized access',
            error: error.message
        });
    }
}

module.exports = {
    generateAuthToken,
    verifyToken
}
