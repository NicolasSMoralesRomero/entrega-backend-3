import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const userOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API - Users',
      version: '1.0.0',
      description: 'Documentación del módulo de usuarios',
    },
    servers: [
      {
        url: 'http://localhost:8080/api',
        description: 'Servidor local',
      },
    ],
  },
  apis: ['./src/routes/users.router.js'],
};

export const userSpec = swaggerJSDoc(userOptions);
export { swaggerUi };