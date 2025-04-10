import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const petOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API - Pets',
      version: '1.0.0',
      description: 'Documentación del módulo de mascotas',
    },
    servers: [
      {
        url: 'http://localhost:8080/api',
        description: 'Servidor local',
      },
    ],
  },
  apis: ['./src/routes/pets.router.js'],
};

export const petSpec = swaggerJSDoc(petOptions);
export { swaggerUi };