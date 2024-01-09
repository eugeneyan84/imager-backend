import express from 'express';
import { default as placesRouter } from './routes/places-routes.js';
import HttpError from './models/http-error.js';

const app = express();

app.use(express.json());

app.use('/api/places', placesRouter);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route', 404);
  throw error;
});

app.use((error, req, res, next) => {
  console.log(
    `Error-handling middlware start: ${error}, headersSent: ${res.headersSent}`
  );
  if (res.headersSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || 'An unknown error occurred.' });
}); // error-handling middleware function

app.listen(3000);
