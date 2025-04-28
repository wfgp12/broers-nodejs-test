require('dotenv').config(); 

const express = require('express');
const cors = require('cors'); 
const { dbConnection } = require('./database/config');
const app = express();

dbConnection();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hola Mundo!');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
