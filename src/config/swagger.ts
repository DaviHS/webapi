
import { fastifySensible } from '@fastify/sensible';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';

export const swaggerSensible = fastifySensible;
export const swaggerPlugin = fastifySwagger;
export const swaggerUiPlugin = fastifySwaggerUi;

export const swaggerOptions = {
  openapi: {
    info: {
      title: 'Web API',
      description: 'Documentação',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://10.0.0.75:3001/api',
        description: 'Local API server'
      },
    ],
  },
};