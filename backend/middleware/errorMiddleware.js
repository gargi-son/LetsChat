// after the logic is completed we can move to the next logic
//take the new error and if in the server.js all of the URL doesnt exist, it will fall on notFOund
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalURL}`);
  res.status(404);
  next(error);
};

//even after the first error, it throws some other error, error handler will handle that
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
