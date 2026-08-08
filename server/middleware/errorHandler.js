const notFound = (req, res, next) => {
  res.status(404).json({ status: 'fail', message: `Route ${req.originalUrl} not found` });
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  console.error(err);
  res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'fail',
    message,
    details: process.env.NODE_ENV === 'production' ? undefined : err.details || undefined,
  });
};

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { notFound, errorHandler, asyncHandler };
