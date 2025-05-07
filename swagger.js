const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Test',
    description: ''
  },
  host: '',
  tags: [
    {
      name: 'API',
      description: 'API endpoints'
    },
    {
      name: 'Pages',
      description: 'HTML pages'
    }
  ]
};

const outputFile = './swagger.json';
const routes = ['./index.js'];

swaggerAutogen(outputFile, routes, doc);
