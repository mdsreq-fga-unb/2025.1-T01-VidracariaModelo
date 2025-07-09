// swaggerConfig.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API V.Modelo',
            version: '1.0.0',
            description: 'Documentação da API com Swagger',
        },
        servers: [
            {
                url: 'http://localhost:3000', // Troque pela URL da sua API
            },
        ],
    },
    apis: ['./Routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
