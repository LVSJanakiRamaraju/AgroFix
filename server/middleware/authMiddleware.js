import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Middleware to verify token and decode user info
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decoded); // Debugging line to check decoded token
    if (!decoded) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = decoded; // { email, isAdmin, ... }
    console.log('User from token:', req.user); // Debugging line to check user data
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Middleware to verify if user is admin
export const verifyAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }
  next();
};
