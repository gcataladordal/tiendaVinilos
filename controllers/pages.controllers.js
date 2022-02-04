const mongoose = require("mongoose");
const Producto = require("../models/productoModel");
const Usuario = require("../models/usuarioModel");
const Compra = require("../models/compraModel");

const pages = {
    home: (req, res) => {
        res.render("pages/home");
    },
    verTienda: async (req, res) => {
        let infoDiscos = await obtenerInfoVinilos();
        res.render("pages/tienda", {infoVinilos: infoDiscos})
    },
    verPerfil: (req, res) => {
        res.render("pages/perfil")
    },
    verProducto: async (req, res) => {
        let infoDisco = await obtenerInfoProducto(req);
        res.render("pages/producto", {infoProducto: infoDisco})
    },
    buscarHist: (req, res) => {
        res.render("pages/buscarHist")
    },
    verCarrito: (req, res) => {
        res.render("pages/carrito")
    },

    viewRegister: (req, res) => {
        res.render("pages/registerLogin");
    },

    // insertarProducto: (req, res) => {
    //     let vinilo = {
    //         titulo: "A Night At The Opera",
    //         autor: "Queen",
    //         genero: "Rock",
    //         ano: "1975",
    //         numDisco: "2",
    //         precio: "44.00€",
    //         imgUrl: "https://dvfnvgxhycwzf.cloudfront.net/media/SharedImage/imageFull/.f3C7LS6U/SharedImage-53601.jpg?t=96658919e620ce1dee51"
    //     }

    //     let nuevoVinilo = new Producto(vinilo)

    //     nuevoVinilo.save(function (err) {
    //         if (err) throw err;
    //         console.log("Inserción correcta del vinilo");
    //         // mongoose.disconnect();
    //     });

    //     res.send("Ha ido Bien");

    // },

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
    },

    registro: (req, res) => {
        registrar(req, res);
    }
}

async function obtenerInfoVinilos() {
    var infoVinilo =  await Producto.find({})
    
    return infoVinilo
}

async function obtenerInfoProducto(req) {
    var infoProducto = await Producto.find({"id_vinilo": req.body.id_vinilo})
    return infoProducto
}




async function registrar(req, res) {
    //! ---- Variables de la información del registro -----

    var nombre = req.body.nombre;
    var apellidos = req.body.apellidos;
    var email = req.body.email;
    var pass = req.body.password1;
    var pass2 = req.body.password2;
    var dni = req.body.dni;
    var direccion = req.body.direccion;
    var cp = req.body.cp;
    var poblacion = req.body.poblacion;
    var tlf = req.body.tlf;


    //! Expresiones Regulares validaciones:
    var regExpDni = new RegExp(/^[0-9]{8}\-?[a-zA-Z]{1}/);
    var regExpName = new RegExp(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ]+$/u); // Otro para apellidos por el espacio!!
    var regExpEmail = new RegExp(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/);
    var regExpPass = new RegExp(/^(?=\w*\d)(?=\w*[a-zA-Z])\S{6,10}$/);
    var regExpCp = new RegExp(/^\d{5}$/);
    var regExpTlf = new RegExp(/^[0-9]{9}$/); ///^\+34\-[0-9]{9}$/

    //! Zona de validaciones

    var nombreOk = regExpName.test(nombre);
    var apellidosOk = regExpName.test(apellidos);
    var emailOk = regExpEmail.test(email);
    var passOk = regExpPass.test(pass);
    var pass2Ok = regExpPass.test(pass2);
    var mismoPassOk = pass == pass2;
    var dniOk = regExpDni.test(dni) && validation_dni(dni);
    //// var direccionOk = regExpName.test(direccion); NO pasa por validacion
    var cpOk = regExpCp.test(cp);
    var tlfOk = regExpTlf.test(tlf);
    // console.log(`nombre: ${nombreOk} \n apellido: ${apellidosOk} \n email ${emailOk} \n pass:${passOk} \n pass:${pass2Ok} \n mismopass: ${mismoPassOk} \n dni :${dniOk} \n dp :${cpOk} \n tlf: ${tlfOk}`);

    var ok = nombreOk && apellidosOk && emailOk && passOk && pass2Ok && mismoPassOk && dniOk && cpOk && tlfOk;
    console.log(ok);

    // var ok = true;  // Para hacerlo sin validaciones

    // //! ---- SI TODAS VALIDACIONES TRUE --------
    if (ok) {
        // busquedaUsuario(dni);
        // if (!users[0]) {
        //     console.log("se registra");
        insertarUsuario(nombre, apellidos, email, pass, dni, direccion, cp, poblacion, tlf, res)
        // } else {
        //     console.log("existe usuario");
        // }
        //
    } else {
        if (!nombreOk) { console.log("Nombre no válido"); }
        if (!apellidosOk) { console.log("Apellidos no válido"); }
        if (!emailOk) { console.log("Email no válido"); }
        if (!passOk) { console.log("Min 1 número y 1 caracter especial"); }
        if (!pass2Ok) { console.log("Pasword no válido"); }
        if (!mismoPassOk) { console.log(" Passwords no son iguales"); }
        if (!dniOk) { console.log(" Passwords no son iguales"); }
        if (!cpOk) { console.log(" Passwords no son iguales"); }
        if (!tlfOk) { console.log(" Passwords no son iguales"); }

    }

}


async function busquedaUsuario(dni) {
    
    Usuario.find({ dni: dni }).exec(function (err, users) {
        if (err) throw err;
        return console.log(users[0]);
    });
}

function insertarUsuario(nombre, apellidos, email, pass, dni, direccion, cp, poblacion, tlf, res) {
    dni = dni.replace("-", "");
    dni = dni.toUpperCase();
    let usuario = {
        nombre: nombre,
        apellidos: apellidos,
        email: email,
        pass: pass, //encripatar antes
        dni: dni,
        telefono: tlf,
        direccion: direccion,
        cp: cp,
        poblacion: poblacion,
        compras: [],
        admin: false
    }

    let nuevoUsuario = new Usuario(usuario)

    nuevoUsuario.save(function (err) {
        if (err) throw err;
        console.log(`Inserción correcta del Usuario ${nombre}`);
        // mongoose.disconnect();
    });

    res.render("pages/registerLogin");

}

// ******** VALIDACIONES  ************

function validationFormat(dni) {
    dni = dni.toUpperCase();
    var letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    var nums = parseInt(dni.substring(0, dni.length - 1));
    var letra = letras[nums % letras.length]; // [nums % letras.length] = posicion de la letra del array de la policia
    return letra == dni[8];
}

function quitarGuion(dni) {
    var conGuion = dni.split("-");
    if (conGuion.length == 1) {
        return dni;
    } else {
        return conGuion[0] + conGuion[1];
    }
}

function validation_dni(dni) {
    dni = quitarGuion(dni);
    return validationFormat(dni);
}

module.exports = pages;