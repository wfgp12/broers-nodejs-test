require('dotenv').config(); 

const express = require('express');
const cors = require('cors'); 

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

const { dbConnection } = require('./database/config');

const app = express();
dbConnection();

const PORT = process.env.PORT || 3000;

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); 
app.use(express.json()); 

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
