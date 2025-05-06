const express = require('express');
const app = express();
const employeeRoutes = require('./routes/employeeRoutes');
const cors = require('cors'); // Importe o CORS


// Configurando o CORS para permitir requisições do frontend
app.use(cors({
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200'], // Permite requisições do frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json());
app.use('/api/employees', employeeRoutes);

app.get('/', (req, res) => {
  res.send('Escala 12x36 API está no ar!');
});



const vacationRoutes = require('./routes/vacationRoutes');

app.use('/api/vacations', vacationRoutes);

const dayoffRoutes = require('./routes/dayoffRoutes');

app.use('/api/dayoffs', dayoffRoutes);



const shiftRoutes = require('./routes/shiftRoutes');

app.use('/api/shifts', shiftRoutes);

module.exports = app;


