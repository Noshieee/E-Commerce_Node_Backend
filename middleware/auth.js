const jwt = require('jsonwebtoken');

function authUser(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token || token == null)
      return res.status(401).send({ message: "User not logged in" });
  
    jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, decoded) => {
      if (err) res.status(403).send({ message: err.message });
      req.decoded = decoded;
      next();
    });
}

module.exports = authUser;