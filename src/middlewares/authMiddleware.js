import jwt from 'jsonwebtoken';
import { getUserById } from '../repositories/userRepository.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req?.headers?.authorization ?? '';
    if (!authHeader || (authHeader === '') | !authHeader.startsWith('Bearer')) {
      return res
        .status(401)
        .json({ message: 'not authorized to access this resource' });
    }
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
    const userId = decodedToken?.userId ?? '';
    if (!userId) {
      return res
        .status(401)
        .json({ message: 'not authorized to access this resource' });
    }
    const user = await getUserById(userId);
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'not authorized to access this resource' });
  }
};
