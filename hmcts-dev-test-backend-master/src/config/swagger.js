const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'HMCTS Task Management API',
    version: '1.0.0',
    description: 'API for managing caseworker tasks.',
  },
  servers: [
    {
      url: '/',
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
