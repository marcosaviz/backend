const express = require('express');
const app = express();
const employeeRoutes = require('./routes/employeeRoutes');

app.use(express.json());
app.use('/api/employees', employeeRoutes);

app.get('/', (req, res) => {
  res.send('Escala 12x36 API está no ar!');
});

module.exports = app;


const vacationRoutes = require('./routes/vacationRoutes');

app.use('/api/vacations', vacationRoutes);

const dayoffRoutes = require('./routes/dayoffRoutes');

app.use('/api/dayoffs', dayoffRoutes);



const shiftRoutes = require('./routes/shiftRoutes');

app.use('/api/shifts', shiftRoutes);



