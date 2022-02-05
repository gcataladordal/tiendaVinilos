const mongoose = require("mongoose");
const Producto = require("../models/productoModel");
const Usuario = require("../models/usuarioModel");
const Compra = require("../models/compraModel");
const scrapping = require("../scrapper")


// ! REQUIRE de BCRYPT
const bcrypt = require('bcrypt');
const { redirect } = require("express/lib/response");
const saltRounds = 10;



const pages = {
    home: (req, res) => {
        saveSesionStart(req)
        console.log("Al dar a Home el valor de sesion es: " + req.session.carrito);
        res.render("pages/home", { info: JSON.stringify(req.session) });
    },
    verHome: (req,res) => {
        console.log("Al dar a Home el valor de sesion es: " + req.session.carrito);
        res.render("pages/home", { info: JSON.stringify(req.session) });
    },
    verTienda: async (req, res) => {
        console.log("Al dar a TIENDA el valor de sesion es: " + req.session.nombre);
        let infoDiscos = await obtenerInfoVinilos();
        let infoDiscosScrapping = await scrapping.addRecordsWeb(7);
        console.log(req.session)
        res.render("pages/tienda", {infoVinilos: infoDiscos, infoDiscosScrapeados: infoDiscosScrapping, info: JSON.stringify(req.session)  })

    },
    verPerfil: (req, res) => {
        console.log("Al dar a verPERFIL el valor de sesion es: " + req.session.nombre);
        res.render("pages/perfil", { info: JSON.stringify(req.session) });
    },
    verProducto: async (req, res) => {
        console.log("Al dar a verPRODUCTO el valor de sesion es: " + req.session.nombre);

        let infoDisco = await obtenerInfoProducto(req);
        res.render("pages/producto", { infoProducto: infoDisco,  info : JSON.stringify(req.session) });
    },
    buscarHist: (req, res) => {
        console.log("Al dar a BUSCAR HISTORIAL el valor de sesion es: " + req.session.nombre);
        res.render("pages/buscarHist", { info: JSON.stringify(req.session) });
    },

    verCarrito: (req, res) => {
        console.log("Al dar a verCARRITO el valor de sesion es: " + req.session.nombre);
        res.render("pages/carrito", { info: JSON.stringify(req.session) });
    },
    verAdmin: (req, res) => {
        res.render("pages/admin", { info: JSON.stringify(req.session) } )
    },

    viewRegister: (req, res) => {
        console.log("Al dar a LOGUEAR/REGISTRAR el valor de sesion es: " + req.session.nombre);
        res.render("pages/registerLogin", { info: JSON.stringify(req.session) });
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
    logout: (req, res) => {
        saveSesionStart(req)
        console.log("Al dar logout, nos manda a home. SESION VALOR: " + req.session.nombre);
        res.render("pages/home", { info: JSON.stringify(req.session) });

    }
}

async function obtenerInfoVinilos() {
    var infoVinilo = await Producto.find({})
    return infoVinilo;
}

async function obtenerInfoProducto(req) {
    var infoProducto = await Producto.find({ "id_vinilo": req.body.id_vinilo })
    return infoProducto;
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
                //ExisteEmail[0] = { Toda la info del usuario }
                if (existeEmail[0].admin) {
                    console.log("Hola ADMIN!!");
                    res.render("pages/admin");
                } else {

                    var logueado = existeEmail[0];
                    console.log(existeEmail[0].id_usuario);
                    saveSesion(logueado, req);

                    console.log(req.session);
                    res.render("pages/home", { info: JSON.stringify(req.session) });
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


function saveSesionStart(req) {
    req.session.id_usuario = "";
    req.session.nombre = "";
    req.session.apellidos = "";
    req.session.email = "";
    req.session.dni = "";
    req.session.telefono = "";
    req.session.direccion = "";
    req.session.cp = "";
    req.session.poblacion = "";
    req.session.carrito = [];
    req.session.precioCompra = 0;
    req.session.admin = false;
    req.session.save();
}

function saveSesion(datosUser, req) {
    req.session.id_usuario = datosUser.id_usuario;
    req.session.nombre = datosUser.nombre,
    req.session.apellidos = datosUser.apellidos,
    req.session.email = datosUser.email,
    req.session.dni = datosUser.dni,
    req.session.telefono = datosUser.telefono,
    req.session.direccion = datosUser.direccion,
    req.session.cp = datosUser.cp,
    req.session.poblacion = datosUser.poblacion,
    req.session.carrito = [],
    req.session.precioCompra = 0,
    req.session.admin = false
    req.session.save();
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