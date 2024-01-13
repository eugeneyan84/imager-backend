import { v4 as uuidv4 } from 'uuid';
import { validationResult } from 'express-validator';

import User from '../models/user.js';
import HttpError from '../models/http-error.js';
import { TEST_USERS } from '../data/data.js';

export const getUsers = (req, res, next) => {
  res.json({ users: TEST_USERS });
};

export const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input(s) detected', 422));
  }

  const { name, email, password, imageUrl, places } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    const err = new HttpError(
      'Error encountered during user details verification',
      500
    );
    return next(err);
  }

  //const existingUser = TEST_USERS.find((u) => u.email === email);
  if (existingUser) {
    const error = new HttpError(
      'Sign-up failed, there is existing user profile with same email.',
      422
    );
    return next(error);
  } else {
    console.log('Email verification is good!');
  }

  const newUser = new User({
    name,
    email,
    password,
    imageUrl,
    places,
  });

  try {
    const result = await newUser.save();
    console.log(result);
  } catch (error) {
    console.error(error);
    const err = new HttpError('Error encountered during sign up.', 422);
    return next(err);
  }

  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

export const login = (req, res, next) => {
  const { email, password } = req.body;

  const targetUser = TEST_USERS.find((u) => u.email === email);
  if (!targetUser || targetUser.password !== password) {
    throw new HttpError('Could not identify user.', 401);
  }

  res.json({ message: 'Logged in!' });
};
