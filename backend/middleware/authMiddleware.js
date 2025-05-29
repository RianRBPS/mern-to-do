const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401) // unauthorized

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        console.log(err)

        if (err) {
            
            console.error('JWT verification failed:', err)
            return res.sendStatus(403) // forbidden
        }

        req.user = user; // attach decoded token payload to request
        next(); // proceed to the next middleware or route
    })
}

module.exports = authenticateToken;