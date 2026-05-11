const { ZodError } = require('zod');

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

  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        message: 'Validation failed',
        details: err.issues.map((issue) => {
          const path = issue.path.length > 0 ? issue.path.join('.') : 'request';
          return `${path}: ${issue.message}`;
        }),
      },
    });
    return;
  }

  if (err.code === 'P2025') {
    res.status(404).json({
      error: {
        message: 'Task not found',
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
