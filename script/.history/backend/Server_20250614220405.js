import { listen } from './App.js';
const PORT = process.env.PORT || 3000;

listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
