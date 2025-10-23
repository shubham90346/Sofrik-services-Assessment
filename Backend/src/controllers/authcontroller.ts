import { Request, Response } from 'express';
const User = require( '../models/usermodel');
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, name });

    return res.status(201).json({ id: user._id, email: user.email });
  } catch (err: any) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { sub: user._id, email: user.email },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    return res.json({ access_token: token, message:"Login Successfully",   user: {
        id: user._id,     
        name: user.name,
        email: user.email,
      }, });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
