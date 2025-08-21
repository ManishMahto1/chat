import User from '../models/User.js';
import { generateToken } from '../config/jwt.js';
import bcrypt from 'bcryptjs';

// REGISTER
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Generate token
    const token = generateToken(user._id.toString());

     // Send token and userId
    res.status(201).json({
      message: 'User registered successfully',
      token,
      userId: user._id.toString(),
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error(' Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// LOGIN// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id.toString());

    //Send both token and userId (and username if needed)
    res.status(201).json({
      token,
      userId: user._id.toString(), 
    });
  } catch (err) {
    console.error(' Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};
