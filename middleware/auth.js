const config = require('config');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.header('Authorisation');
    // Check Token
    if (!token) {
        return res.status(401).json({
            msg: "No Token Access Denied"
        })
    }

    try {
        // Verify Token
        const decoded = jwt.verify(token, config.get('secretOrKey'));
        req.user = decoded;
        next();
    }
    catch (e) {
        return res.status(400).json({
            msg: "Token is not valid"
        })
    }

}

module.exports = auth;
