const app = require('./src/app.js');
const PORT = process.env.PORT || 3200;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
