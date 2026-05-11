function notFoundHandler(_req, res) {
  res.status(404).json({
    error: {
      message: 'Not found',
      details: [],
    },
  });
}

module.exports = notFoundHandler;
