import logger from '../utils/logger.js';

export const errorHandler = (error, req, res, next) => {
  logger.error(`Error in ${req.method} ${req.path}: ${error.message}`, {
    stack: error.stack,
    body: req.body,
    params: req.params,
    query: req.query
  });

  const status = error.code || error.statusCode || 500;
  const message = error.message || 'Error interno del servidor';

  res.status(status).json({
    status: 'error',
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};