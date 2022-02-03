// Creación del producto
const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const objetoProductoSchema = {

    titulo: String,
    autor: String,
    genero: String,
    ano: String,
    numDisco: String,
    precio: String
};

const productoSchema = mongoose.Schema(objetoProductoSchema)

productoSchema.plugin(AutoIncrement, {inc_field: 'id_vinilo'});

const Producto = mongoose.model("productos", productoSchema);

// para exportar
module.exports = Producto;


