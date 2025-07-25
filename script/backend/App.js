const express = require('express');
const cors = require('cors'); // Adicione esta linha


const agendamentoRoutes = require('./Routes/agendamento_routes');
const clientesRoutes = require('./Routes/clients_routes');
const horariosRoutes = require('./Routes/horario_routes');
const vendasRoutes = require('./Routes/venda_routes');
const Login = require('./Routes/Login_routes');
const duvidasRoutes = require('./Routes/duvidas_routes');

const app = express();

app.use(cors()); // Use o CORS aqui
app.use(express.json());

app.use('/agendamentos', agendamentoRoutes);
app.use('/clientes', clientesRoutes);
app.use('/vendas', vendasRoutes);
app.use('/produtos', require('./Routes/produtos_routes'));
app.use('/orcamento', require('./Routes/solicitacao_orcamento_routes'));
app.use('/dash', require('./Routes/Dash_routes'))
app.use('/auth', Login);
app.use('/duvidas', duvidasRoutes)

app.use('/', horariosRoutes);



app.get('/', (req, res) => {
    res.json({ mensagem: 'API está funcionando!' });
});

module.exports = app;