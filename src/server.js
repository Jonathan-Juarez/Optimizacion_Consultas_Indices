require('dotenv').config();
const express = require("express");
const ConnectDB = require('./config/db')
const app = express();
const carRoute = require('./routes/carRoute')

app.use(express.json()); //En esta app se usará json.

app.use('/api', carRoute); //Usar ruta de carro.

//Iniciar el servidor.
const PORT = process.env.PORT || 3005
app.listen(PORT, async () => { //Escucha al port y devuelve un valor asíncrono.
    await ConnectDB();
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`); //Dirección base del servidor.
});
