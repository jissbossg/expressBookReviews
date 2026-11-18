const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  const authHeader = req.session.authorization;

  if (!authHeader) {
    return res.status(403).json({
      message: 'User not authenticated'
    });
  }

  const { accessToken, username } = authHeader;

  jwt.verify(accessToken, 'access', (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: 'Invalid or expired token'
      });
    }

    req.user = { username: decoded.username || username };
    next();
  });
};