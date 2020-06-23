import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@jpa-tickets/common';

const app = express();
// Allows express to trust proxies
app.set('trust proxy', true);
// Allows to parse the request body
app.use(json());
// Allows us to use handle cookies
app.use(
  cookieSession({
    signed: false, // don't encrypt the cookie
    secure: process.env.NODE_ENV !== 'test' // jest set NODE_ENV to false to pass test, other than it defaults to 'true' that means cookies will be shared only with https connection
  })
);

// Routes
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// Throw error for unspecified routes
app.all('*', async () => {
  throw new NotFoundError();
});

// Use the error handler middleware
app.use(errorHandler);

export { app };
