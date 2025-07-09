const app = require('./App');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./SwaggerConfig');



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);
});

