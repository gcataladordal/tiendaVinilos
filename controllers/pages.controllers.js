const mongoose = require("mongoose");
const Producto = require("../models/productoModel");
const Usuario = require("../models/usuarioModel");
const Compra = require("../models/compraModel");
const storage = require("node-sessionstorage");

// ! REQUIRE de BCRYPT
const bcrypt = require('bcrypt');
const saltRounds = 10;

const pages = {
    home: (req, res) => {
        res.render("pages/home");
    },
    tienda: (req, res) => {
        res.render("pages/tienda")
    },
    verPerfil: (req, res) => {
        res.render("pages/perfil")
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
    },

    registro: (req, res) => {
        registrar(req, res);
    },

    login: (req, res) => {
        loguear(req, res);
    },
    logout: (req,res) =>{
        storage.removeItem('user');
        console.log('session logout: ', storage.getItem('user'));
        res.render("pages/home");
    }
}


async function registrar(req, res) {
    //! ---- Variables de la información del registro -----

    const { nombre, apellidos, email, password, password2, dni, direccion, cp, poblacion, tlf } = req.body;

    //! Expresiones Regulares validaciones:
    var regExpDni = new RegExp(/^[0-9]{8}\-?[a-zA-Z]{1}/);
    var regExpName = new RegExp(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ]+$/u); // Otro para apellidos por el espacio!!
    var regExpEmail = new RegExp(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/);
    var regExpPass = new RegExp(/^(?=\w*\d)(?=\w*[a-zA-Z])\S{6,10}$/);
    var regExpCp = new RegExp(/^\d{5}$/);
    var regExpTlf = new RegExp(/^[0-9]{9}$/); ///^\+34\-[0-9]{9}$/

    //! Zona de validaciones

    const nombreOk = regExpName.test(nombre);
    const apellidosOk = regExpName.test(apellidos);
    const emailOk = regExpEmail.test(email);
    const passOk = regExpPass.test(password);
    const pass2Ok = regExpPass.test(password2);
    const mismoPassOk = password == password2;
    const dniOk = regExpDni.test(dni) && validation_dni(dni);
    //// const direccionOk = regExpName.test(direccion); NO pasa por validacion
    const cpOk = regExpCp.test(cp);
    const tlfOk = regExpTlf.test(tlf);
    console.log(`nombre: ${nombreOk} \n apellido: ${apellidosOk} \n email ${emailOk} \n pass:${passOk} \n pass2:${pass2Ok} \n mismopass: ${mismoPassOk} \n dni :${dniOk} \n dp :${cpOk} \n tlf: ${tlfOk}`);

    var ok = nombreOk && apellidosOk && emailOk && passOk && pass2Ok && mismoPassOk && dniOk && cpOk && tlfOk;
    // var ok = nombreOk && apellidosOk && emailOk && dniOk && cpOk && tlfOk;

    // console.log(ok);

    var ok = true;  // Para hacerlo sin validaciones
    // 47919013P

   

    // //! ---- SI TODAS VALIDACIONES TRUE --------
    if (ok) {
        console.log("Entra");
        const existeDni = await busquedaUsuarioDni(dni);
        //devuleve {} del usuario de la base de datos, sino es null
        // console.log("*******************");

        // console.log(existeDni);
        if ((existeDni) == null) {
            console.log("se registra");
            var passEnc = "";
            passEnc = await bcrypt.hash(password, saltRounds);
            console.log(passEnc);
            insertarUsuario(nombre, apellidos, email, passEnc, dni, direccion, cp, poblacion, tlf, res);

        } else {
            console.log("existe usuario");
        }
    } else {
        if (!nombreOk) { console.log("Nombre no válido"); }
        if (!apellidosOk) { console.log("Apellidos no válido"); }
        if (!emailOk) { console.log("Email no válido"); }
        if (!passOk) { console.log("Min 1 número y 1 caracter especial"); }
        if (!pass2Ok) { console.log("Pasword no válido"); }
        if (!mismoPassOk) { console.log(" Passwords no son iguales"); }
        if (!dniOk) { console.log(" dni no valido"); }
        if (!cpOk) { console.log(" cp no valido"); }
        if (!tlfOk) { console.log(" tlf no valido"); }
    }
}


// ! ********  LOGUEAR*********

async function loguear(req, res) {

    //! ---- Variables de la información del registro -----

    const email2 = req.body.email2;
    const password3 = req.body.password3;

    //! Expresiones Regulares validaciones:

    var regExpEmail = new RegExp(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/);
    var regExpPass = new RegExp(/^(?=\w*\d)(?=\w*[a-zA-Z])\S{6,10}$/);

    //! Zona de validaciones

    const emailOk = regExpEmail.test(email2);
    const passOk = regExpPass.test(password3);

    // console.log(`email ${emailOk} \n pass:${passOk} \n pass:${pass2Ok}`);
    var ok = emailOk && passOk;
    // var ok = true;  // Para hacerlo sin validaciones
    // 47919013P
    // //! ---- SI TODAS VALIDACIONES TRUE --------
    if (ok) {
        // Busca en BD si existe ese mail
        const existeEmail = await busquedaUsuarioEmail(email2);

        if ((existeEmail[0]) == undefined) {
            console.log("Registrate");
        } else {
            // console.log("Eres TU y tu pass del bd es"+ existeEmail[0].pass);
            // console.log("pass? " + existeEmail[0].pass);
            var mismoPass = await bcrypt.compare(password3, existeEmail[0].pass)     // <-- COMPARA LAS 2 PASSWORDS
            if (mismoPass) {

                if (existeEmail[0].admin) {
                    console.log("Hola ADMIN!!");
                    res.render("pages/admin");
                }else{
                    storage.setItem('user', existeEmail[0]);
                    console.log('session logeado: ', storage.getItem('user'))
                    console.log("Hola, logueaste usuario!!");
                    res.render("pages/home");
                }
            } else {
                console.log("Olvidates tu pass???");
            }
        }
    } else {
        if (!emailOk) { console.log("Email no válido"); }
        if (!passOk) { console.log("Min 1 número y 1 caracter especial"); }
    }
}


async function busquedaUsuarioDni(dni) {
    dni = dni.replace("-", "");
    dni = dni.toUpperCase();
    const datos = await Usuario.findOne({ dni: dni });
    return datos;
}

async function busquedaUsuarioEmail(email) {
    const datos2 = await Usuario.find({ email: email });
    return datos2;
}

function insertarUsuario(nombre, apellidos, email, pass, dni, direccion, cp, poblacion, tlf, res) {
    dni = dni.replace("-", "");
    dni = dni.toUpperCase();
    let usuario = {
        nombre: nombre,
        apellidos: apellidos,
        email: email,
        pass: pass, //encriptar antes
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