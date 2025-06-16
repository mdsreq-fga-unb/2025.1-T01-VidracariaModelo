// backend/routes/user.routes.js
const express = require('express');
const router = express.Router();

// Exemplo de uma rota de teste simplesnpm
router.get('/', (req, res) => {
  res.send('API de Usuários está funcionando!');
  console.log('chamada de API realizada')
});

module.exports = router; // Exporta o roteador