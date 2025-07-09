const express = require('express');
const cors = require('cors'); // Adicione esta linha


const agendamentoRoutes = require('./Routes/agendamento_routes');
const clientesRoutes = require('./Routes/clients_routes');
const horariosRoutes = require('./Routes/horario_routes');

const app = express();

app.use(cors()); // Use o CORS aqui
app.use(express.json());

app.use('/agendamentos', agendamentoRoutes);
app.use('/clientes', clientesRoutes);
app.use('/', horariosRoutes);


app.get('/', (req, res) => {
    res.json({ mensagem: 'API está funcionando!' });
});

module.exports = app;