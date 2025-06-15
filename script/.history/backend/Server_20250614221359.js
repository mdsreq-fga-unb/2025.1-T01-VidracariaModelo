import pkg from './App.js'; // Importa o objeto exportado por App.js como 'pkg'
const app = pkg; // 'pkg' agora é a sua instância Express 'app'
const PORT = process.env.PORT || 3000;

listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
