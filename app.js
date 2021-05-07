const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// 1) MIDDLEWARES
// Middleware: adding data to request object.
// Middleware applies to every route- before route handler in code (e.g. app.get). The order matters.

const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

app.use((req, res, next) => {
  // Adds property to request object, which can be accessed in route.
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
// Mini applications for tours and users.
// Dedicated routers for tours and users.
// Tour router/ middleware function.
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4) START SERVER

// Export app to server.js
module.exports = app;
