import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

import User from '../models/user.js';
import HttpError from '../models/http-error.js';

export const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (error) {
    const err = new HttpError(
      'Error encountered during retrieving of users',
      500
    );
    return next(err);
  }

  res.json({ users: users.map((u) => u.toObject({ getters: true })) });
};

export const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input(s) detected', 422));
  }

  const { name, email, password } = req.body;

  if (false) {
    const error = new HttpError(
      'Sign-up failed, there is existing user profile with same email.',
      422
    );
    return next(error);
  } else {
    console.log('Email verification is good!');
  }

  let hashPwd;
  try {
    hashPwd = await bcrypt.hash(password, 12);
  } catch (error) {
    const err = new HttpError(
      'Error encountered when creating user, please try again',
      500
    );
    return next(err);
  }

  const newUser = new User({
    name,
    email,
    password: hashPwd,
    imageUrl: `${req.file.path}`,
    places: [],
  });

  try {
    const result = await newUser.save();
    console.log(result);
  } catch (error) {
    let message;
    if (error.errors && Object.keys(error.errors).length > 0) {
      message = error.errors[Object.keys(error.errors)[0]].message;
    } else {
      message = 'Error encountered during sign up.';
    }
    console.log(message);
    const err = new HttpError(message, 422);
    return next(err);
  }

  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  let targetUser;
  try {
    targetUser = await User.findOne({ email });
  } catch (error) {
    const err = new HttpError('Error encountered during login.', 500);
    return next(err);
  }

  if (!targetUser) {
    return next(new HttpError('Invalid email or password.', 401));
  }

  let isValidPwd = false;
  try {
    isValidPwd = await bcrypt.compare(password, targetUser.password);
  } catch (error) {
    const err = new HttpError('Error encountered during login.', 500);
    return next(err);
  }

  if (!isValidPwd) {
    return next(
      new HttpError('Invalid credentials, could not log you in.', 401)
    );
  }

  const profile = { ...targetUser.toObject({ getters: true }) };
  delete profile.password;

  res.json({ message: 'Logged in!', user: profile });
};
