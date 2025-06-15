// backend/routes/user.routes.js
const express = require('express');
const router = express.Router();

// Exemplo de uma rota de teste simples
router.get('/', (req, res) => {
  res.send('API de Usuários está funcionando!');
});

module.exports = router; // Exporta o roteador