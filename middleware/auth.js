const jwt = require('jsonwebtoken');

function authUser(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token || token == null)
      return res.status(401).send({ message: "User not logged in" });
  
    jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, user) => {
      if (err) res.status(403).send({ message: err.message });
      req.user = user;
      next();
    });
};

function authRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      res.status(401)
      return res.send('You are not that guy pal')
    }
    next()
  }
}

module.exports = { authUser, authRole  };