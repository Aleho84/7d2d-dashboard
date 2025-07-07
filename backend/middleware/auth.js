const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = function (req, res, next) {
  // Obtiene token del header
  const token = req.header('x-auth-token');

  // Verifica si no hay token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verifica el token
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
