import express from 'express';
import { default as placesRouter } from './routes/places-routes.js';

const app = express();

app.use('/api/places', placesRouter);

app.listen(3000);
