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
  components: {
    schemas: {
      Task: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          title: {
            type: 'string',
          },
          description: {
            type: 'string',
            nullable: true,
          },
          status: {
            type: 'string',
            enum: ['pending', 'in_progress', 'done'],
          },
          dueDate: {
            type: 'string',
            format: 'date-time',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
        required: [
          'id',
          'title',
          'status',
          'dueDate',
          'createdAt',
          'updatedAt',
        ],
      },
      CreateTaskRequest: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          status: {
            type: 'string',
            enum: ['pending', 'in_progress', 'done'],
          },
          dueDate: {
            type: 'string',
            format: 'date-time',
          },
        },
        required: ['title', 'status', 'dueDate'],
      },
      UpdateTaskStatusRequest: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['pending', 'in_progress', 'done'],
          },
        },
        required: ['status'],
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
              },
              details: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
            required: ['message', 'details'],
          },
        },
        required: ['error'],
      },
      HealthResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'ok',
          },
        },
        required: ['status'],
      },
    },
    responses: {
      ValidationError: {
        description: 'Validation failed',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
      NotFoundError: {
        description: 'Task not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
      ServerError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
