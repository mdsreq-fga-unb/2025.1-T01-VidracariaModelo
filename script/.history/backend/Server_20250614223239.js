const app = require('./App.js'); 
const PORT = process.env.PORT || 3000;

// CHAMA O MÉTODO 'listen' NA INSTÂNCIA IMPORTADA 'app'
app.listen(PORT, () => { 
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});