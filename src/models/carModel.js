const { Schema, model } = require("mongoose");

//Modelo que crea un objeto en base al esquema de grupo.
const carSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 100000
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    versionKey: false, //Elimina el campo __v.
    timestamps: true //Agrega el campo del tiempo de creación y de modificación
});

const Car = model("Car", carSchema);

module.exports = Car;