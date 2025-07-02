const jwt = require('jsonwebtoken');

const verify = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {return res.status(401).json({ error: "Please authenticate using valid token" });}

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Please authenticate using valid token" });
  }
};

module.exports = verify;