const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');

  // check if not token
  if (!token) {
    return res.status(401).json({ success: false });
  }

  try {
    const decoded = jwt.verify(token, porcess.env.JWT_SECRET);

    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false });
  }
};
