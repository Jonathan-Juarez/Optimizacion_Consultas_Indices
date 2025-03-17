const carModel = require('../models/carModel');


//Crear 100,000 carros.
const createCars = async (req, res) => {
    try {
        const cars = []; //Va almacenando todo lo del push.
        for (let i = 1; i <= 100000; i++) {
            cars.push({ //push siginifica que se le insertará un dato.
                name: `Carro ${i}`,
                category: ["Deportivo", "Todo terreno", "Familiar", "Lujo", "Comercial"][Math.floor(Math.random() * 5)],
                date: new Date(Math.floor(Math.random() * 25) + 2000, Math.floor(Math.random() * 12) + 1, Math.floor(Math.random() * 28) + 1),
                brand: ["Nissan", "Ford", "Chevrolet", "Bugatti", "Ferrari", "Lamborghini", "Tesla"][Math.floor(Math.random() * 7)],
                price: Math.floor(Math.random() * 300000) + 100000,
                stock: Math.floor(Math.random() * 100) + 1,
            });
        }
        await carModel.insertMany(cars); //Se inserta los carros en la DB.
        res.status(201).json({
            message: "Se han insertado 100,000 carros con éxito."
        })
    } catch (error) {
        res.status(500).json({
            error: "Error al insertar los 100,000 carros."
        })

    }
};

//Consulta funcional sin y con índice simple.
const query1 = async (req, res) => {
    try {
        //Consulta los carros de la categoría deportivo.
        const result = await carModel.find({ category: "Deportivo" }).explain("executionStats");
        console.log(result);

        res.status(200).json({
            message: "Consulta realizada con éxito."
        })
    } catch (error) {
        res.status(500).json({
            error: "Error al realizar la consulta."
        })
    }
};

//Consulta funcional sin y con indice compuesto.
const query2 = async (req, res) => {
    try {
        //Consulta los carros que cuestan entre 200,000 y 250,000 con la marca Bugatti, los cuales serán mostrados de forma descendente.
        const result = await carModel.find({ price: { $gte: 200000, $lte: 250000 }, brand: "Bugatti" }).sort({ price: -1 }).explain("executionStats");
        console.log(result);

        res.status(200).json({
            message: "Consulta realizada con éxito."
        })
    } catch (error) {
        res.status(500).json({
            error: "Error al realizar la consulta."
        })
    }
};


//Consulta funcional sin indice.
const queryWithoutIndex3 = async (req, res) => {
    try {
        //Consulta el carro 90,000. Sin el índice recorrerá entre todos los documentos de la colección hasta encontrar lo especificado.
        const result = await carModel.find({ name: { $regex: "90000" } }).explain("executionStats");
        console.log(result);

        res.status(200).json({
            message: "Consulta realizada con éxito.",
            result
        })
    } catch (error) {
        res.status(500).json({
            error: "Error al realizar la consulta."
        })
    }
};

//Consulta funcional con indice.
const queryWithIndex3 = async (req, res) => {
    try {
        //Índice que busca el carro 90,000.
        const result = await carModel.find({ $text: { $search: "90000" } }).explain("executionStats"); // "\" permite mostrar los carros que incluyan lo indicando en la cadena.
        console.log(result);

        res.status(200).json({
            message: "Consulta realizada con éxito.",
            result
        })
    } catch (error) {
        res.status(500).json({
            error: "Error al realizar la consulta."
        })
    }
};

//Crear índices para cada consulta.
const createIndexes = async (req, res) => {
    try {

        const carCollection = carModel.collection;

        //Índice simple para la consulta 1.
        await carCollection.createIndex({ category: 1 });
        //índice compuesto para la consulta 2.
        await carCollection.createIndex({ brand: 1, price: -1 });
        //índice con texto para la consulta 3.
        await carCollection.createIndex({ name: "text" })

        res.status(201).json({
            message: "Índices creados con éxito."
        })
    } catch (error) {
        res.status(500).json({
            error: "Error al crear los índices."
        })
        console.log(error);

    }
};

module.exports = {
    createCars,
    query1,
    query2,
    queryWithoutIndex3,
    queryWithIndex3,
    createIndexes
};