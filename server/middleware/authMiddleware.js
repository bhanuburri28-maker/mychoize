const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization || req.cookies?.token;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  if (!token) {
    return res.status(401).json({ status: 'fail', message: 'You are not logged in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ status: 'fail', message: 'Invalid or expired token.' });
  }
};

const restrictTo = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ status: 'fail', message: 'You do not have permission to perform this action.' });
  }
  next();
};

module.exports = { protect, restrictTo };
