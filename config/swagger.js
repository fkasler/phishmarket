exports.options = {
  routePrefix: '/documentation',
  exposeRoute: true,
  swagger: {
    info: {
      title: 'Phish Market API',
      description: 'A blind man walks into a phish market...',
      version: '1.0.0'
    },
    externalDocs: {
      url: 'https://github.com/fastify/fastify-swagger',
      description: 'Find more info here'
    },
    host: 'localhost:8000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer'
        }
      }
    }
  }
}
