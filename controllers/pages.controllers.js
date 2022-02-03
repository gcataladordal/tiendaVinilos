const mongoose = require("mongoose");
const Producto = require("../models/productoModel");
const Usuario = require("../models/usuarioModel");
const Compra = require("../models/compraModel");

const pages = {
    home: (req, res) => {
        res.render("home");
    },
    register: (req, res) => {
        res.render("registro");
    },
    login: (req, res) => {
        res.render("login");
    },
    insertarUsuario: (req, res) => {
        let usuario = {
            nombre: "Antonio",
            apellidos: "Flores",
            email: "Pepa",
            pass: "Antonia Martínez",
            dni: "12345678A",
            telefono: "911234567",
            direccion: "Calle del mar n6, 2G",
            cp: "28058",
            poblacion: "Madrid",
            compras: [
                "1",
                "2"
            ],
            admin: false
        }
        
        let nuevoUsuario = new Usuario(usuario)

        nuevoUsuario.save(function (err) {
            if (err) throw err;
            console.log("Inserción correcta del Usuario");
            // mongoose.disconnect();
        });

        res.send("Ha ido Bien");

    },
    insertarProducto: (req, res) => {
        let vinilo = {
            titulo: "Greatest Hits",
            autor: "James Brown",
            genero: "Funk",
            ano: "1967",
            numDisco: "2",
            precio: "65.00€"
        }
        
        let nuevoVinilo = new Producto(vinilo)

        nuevoVinilo.save(function (err) {
            if (err) throw err;
            console.log("Inserción correcta del vinilo");
            // mongoose.disconnect();
        });

        res.send("Ha ido Bien");

    },
    insertarCompra: (req, res) => {
        let compra = {
            id_usuario: "1",
            productos: ["1", "2", "3"],
            created: Date.now()
        }
        
        let nuevaCompra = new Compra(compra)

        nuevaCompra.save(function (err) {
            if (err) throw err;
            console.log("Inserción correcta de la nueva compra");
            // mongoose.disconnect();
        });

        res.send("Ha ido Bien");

    }

}


module.exports = pages;