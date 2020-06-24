import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@jpa-tickets/common';
import { createChargeRouter } from './routes/new';

const app = express();
// Allows express to trust proxies
app.set('trust proxy', true);
// Allows to parse the request body
app.use(json());
// Allows us to use handle cookies
app.use(
  cookieSession({
    signed: false, // don't encrypt the cookie
    // secure: process.env.NODE_ENV !== 'test' // jest set NODE_ENV to false to pass test, other than it defaults to 'true' that means cookies will be shared only with https connection
    secure: false
  })
);

app.use(currentUser);

app.use(createChargeRouter);

// Throw error for unspecified routes
app.all('*', async () => {
  throw new NotFoundError();
});

// Use the error handler middleware
app.use(errorHandler);

export { app };
