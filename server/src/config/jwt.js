import jwt from 'jsonwebtoken';


const generateToken = (userId) => {
  return jwt.sign({ userId },  process.env.JWT_SECRET || 'secret', { expiresIn: '30m' });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'secret');
};

export { generateToken, verifyToken };