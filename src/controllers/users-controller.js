import { v4 as uuidv4 } from 'uuid';

import HttpError from '../models/http-error.js';
import { TEST_USERS } from '../data/data.js';

export const getUsers = (req, res, next) => {
  res.json({ users: TEST_USERS });
};

export const signup = (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = TEST_USERS.find((u) => u.email === email);
  if (existingUser) {
    throw new HttpError(
      'Sign-up failed, there is existing user profile with provided email.',
      422
    );
  }

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  TEST_USERS.push(newUser);

  res.status(201).json({ user: newUser });
};

export const login = (req, res, next) => {
  const { email, password } = req.body;

  const targetUser = TEST_USERS.find((u) => u.email === email);
  if (!targetUser || targetUser.password !== password) {
    throw new HttpError('Could not identify user.', 401);
  }

  res.json({ message: 'Logged in!' });
};
