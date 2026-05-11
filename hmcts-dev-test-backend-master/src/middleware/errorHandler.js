function errorHandler(err, _req, res, _next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    res.status(400).json({
      error: {
        message: 'Invalid JSON body',
        details: [],
      },
    });
    return;
  }

  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500 ? 'Internal server error' : err.message || 'Request failed';

  res.status(statusCode).json({
    error: {
      message,
      details: err.details || [],
    },
  });
}

module.exports = errorHandler;
