import jwt from 'jsonwebtoken';

export const generateToken = (userId, email) => {
  const token = jwt.sign({ userId, email }, process.env.BACKEND_P_KEY, {
    expiresIn: '1h',
  });

  const expiryTimestamp = new Date().getTime() + 60 * 60 * 1000;

  return { token, expiryTimestamp };
};
