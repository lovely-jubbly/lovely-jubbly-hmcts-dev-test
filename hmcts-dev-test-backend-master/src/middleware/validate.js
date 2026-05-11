function validate(schemas) {
  return (req, _res, next) => {
    try {
      req.validated = {};

      if (schemas.body) {
        req.validated.body = schemas.body.parse(req.body);
      }

      if (schemas.params) {
        req.validated.params = schemas.params.parse(req.params);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = validate;
