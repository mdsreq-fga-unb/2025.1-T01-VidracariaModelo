const jwt = require('jsonwebtoken');
const SECRET = 'seu_token_secreto'; // Use a mesma chave do seu login

const autenticar = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extrai "Bearer <token>"

    if (!token) {
        return res.status(401).json({ erro: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        req.usuario = {
            id: decoded.id,
            tipo: decoded.tipo_usuario // 'gerente' ou 'usuario'
        };
        next();
    } catch (err) {
        console.error('Token inválido:', err);
        res.status(401).json({ erro: 'Token inválido ou expirado' });
    }
};

// Middleware específico para gerentes
const somenteGerentes = (req, res, next) => {
    if (req.usuario.tipo !== 'gerente') {
        return res.status(403).json({ erro: 'Acesso restrito a gerentes' });
    }
    next();
};

module.exports = { autenticar, somenteGerentes };