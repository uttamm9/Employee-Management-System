const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendError } = require('../utils/apiResponse');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return sendError(res, 401, 'User no longer exists or session is invalid');
      }

      if (user.status === 'inactive') {
        return sendError(res, 403, 'Account is inactive. Please contact the administrator.');
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return sendError(res, 401, 'Token has expired. Please log in again.');
      }
      return sendError(res, 401, 'Not authorized, invalid token');
    }
  } else {
    return sendError(res, 401, 'Not authorized, no token provided');
  }
};

module.exports = { protect };
