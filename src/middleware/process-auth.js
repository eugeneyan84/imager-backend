import HttpError from '../models/http-error.js';
import jwt from 'jsonwebtoken';

const processAuth = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS call detected, letting it pass through.');
    return next();
  }
  let token;
  try {
    token = req.headers.authorization.split(' ')[1]; // 'Bearer <token>'
    if (!token) {
      throw new Error('Authentication failed.');
    }

    const decodedToken = jwt.verify(token, process.env.BACKEND_P_KEY);
    req.userData = { userId: decodedToken.userId, email: decodedToken.email };

    next();
  } catch (error) {
    const err = new HttpError('Authentication failed.', 401);
    return next(err);
  }
};

export default processAuth;
