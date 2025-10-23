import { Request, Response } from 'express';
const User = require('../models/usermodel');

export const me = async (req: Request, res: Response) => {
  try {
    
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (err: any) {
    console.error('Get Me error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
