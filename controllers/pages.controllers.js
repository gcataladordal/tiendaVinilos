const mongoose = require("mongoose");
const Producto = require("../models/productoModel");
const Usuario = require("../models/usuarioModel");
const Compra = require("../models/compraModel");
const scrapping = require("../scrapper")
const { createInvoice } = require("../pdfkit/createInvoice")

// ! REQUIRE de BCRYPT
const bcrypt = require('bcrypt');
const { redirect } = require("express/lib/response");
const { openDelimiter } = require("ejs");
const saltRounds = 10;



const pages = {
    addDisco: (req, res) => {
        insertarDisco(req);
    },
    home: (req, res) => {
        let infoUser = saveSesionStart();
        res.render("pages/home", { info: JSON.stringify(infoUser) });
    },
    verHome: (req, res) => {
        res.render("pages/home2");
    },
    verTienda: async (req, res) => {
        let infoDiscos = await obtenerInfoVinilos();
        let infoDiscosScrapping = await scrapping.addRecordsWeb(7);
        res.render("pages/tienda", {infoVinilos: infoDiscos, infoDiscosScrapeados: infoDiscosScrapping})

    },
    verPerfil: async (req, res) => {
        let infoDiscos = await obtenerInfoVinilos(); 
        res.render("pages/perfil", { infoVinilos: infoDiscos });

    },
  
    verProducto: async (req, res) => {
        let infoDisco = await obtenerInfoProducto(req);
        res.render("pages/producto", {infoProducto: infoDisco});
    },
  
    buscarHist: (req, res) => {
        res.render("pages/buscarHist");
    },

    verCarrito: async (req, res) => {
        let arrayProductos = await obtenerProductosCarrito(req.body.carritoData);
        if (typeof(arrayProductos) === "string"){
            res.render("pages/carritoVacio");
        } else {
            res.render("pages/carrito", { infoProductos: arrayProductos });
        }
    },
  
    verAdmin: (req, res) => {
        res.render("pages/admin");
    },
    carritoConfirmado: async (req, res) => {
        let userInfo = JSON.parse(req.body.userInfo);
        let idsVinilos = req.body.idsCompra;
        if (userInfo.nombre === "") {
            // Usuario NO registrado
            res.render("pages/datosEnvio", {idsCompra : idsVinilos});
        } else {
            // Usuario registrado
            let insertarEnCompras = await insertarCompra(idsVinilos, userInfo);
            res.render("pages/buyConfirm", { infoCompra: insertarEnCompras });
        }

    },
    verFactura: (req, res) => {
        console.log(req.body.infoUser);
        console.log(req.body.infoProductos);
        res.render("pages/factura")
        // let infoComprador = JSON.parse(req.body.infoUser)
        // let infoProductos = JSON.parse(req.body.infoProductos)
        

        // const invoice = {
        //     shipping: {
        //       nombre: req.bod,
        //       direccion: "Calle de la piruleta",
        //       poblacion: "San Francisco",
        //       cp: 94111,
        //       email: "buenas@gmail.com",
        //     },
        //     productos: [
        //       {
        //         producto: "James Brown",
        //         titulo: "The Best Of James Brown",
        //         cantidad: 2,
        //         precio: 6000
        //       },
        //       {
        //         producto: "ABC",
        //         titulo: "Jackson 5",
        //         cantidad: 1,
        //         precio: 2000
        //       },
        //       {
        //         producto: "Doggystyle",
        //         titulo: "Snoop Dogg",
        //         cantidad: 2,
        //         precio: 6000
        //       }
        //     ],
        //     subtotal: 8000,
        //     paid: 0,
        //     invoice_nr: 1234
        //   };
          
        //   createInvoice(invoice, "factura_vinilosFull.pdf");
          



    },
    viewRegister: (req, res) => {
        res.render("pages/registerLogin");
    },
    registro: (req, res) => {
        registrar(req, res);
    },

    login: (req, res) => {
        loguear(req, res);
    },
    logout: (req, res) => {
        let infoUser = saveSesionStart();
        res.render("pages/home", { info: JSON.stringify(infoUser) });
    }
}


async function insertarCompra(idsVinilos, userInfo){
    var productosComprados = [];
    let arrayIds = idsVinilos.split(",");
    
    for (let i = 0; i < arrayIds.length; i++) {
        let infoVinilo = await Producto.find({ "id_vinilo": arrayIds[i]})
        productosComprados.push(infoVinilo);
    }
      
    let compra = {
        id_usuario: userInfo.id_usuario,
        productos: productosComprados,
        created: new Date()
    }

    let nuevaCompra = new Compra(compra)

    nuevaCompra.save(function (err) {
        if (err) throw err;
        console.log("Inserción correcta de la nueva compra");
    });
    return nuevaCompra
}

async function obtenerInfoVinilos() {
    var infoVinilo = await Producto.find({})
    return infoVinilo;
}

async function obtenerInfoProducto(req) {
    var infoProducto = await Producto.find({ "id_vinilo": req.body.id_vinilo })
    return infoProducto;
}

async function obtenerProductosCarrito(ids) {
    let arrayIds = ids.split(",");
    if (arrayIds[0] !== "") {
        let arrayProductos = [];
        let precioTotal = 0;
        for (let i = 0; i < arrayIds.length; i++) {
            let infoProductos = await Producto.find({"id_vinilo": arrayIds[i] });
            arrayProductos.push(infoProductos);
            precioTotal = precioTotal + infoProductos[0].precio
        }
        arrayProductos.push(precioTotal)
        return arrayProductos;
    } else {
        let carritoSinProductos = "No has añadido nada al carrito";
        return carritoSinProductos;
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
                //ExisteEmail[0] = { Toda la info del usuario }
                if (existeEmail[0].admin) {
                    console.log("Hola ADMIN!!");
                    console.log(existeEmail[0].id_usuario);

                    let infoUser = saveSesion(existeEmail[0]);
                    res.render("pages/admin", { info: JSON.stringify(infoUser) });
                } else {

                    console.log(existeEmail[0].id_usuario);
                    let infoUser = saveSesion(existeEmail[0]);
                    res.render("pages/home", { info: JSON.stringify(infoUser) });
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

// addDisco:  titulo autor genero ano  numDIsco precio imgUrl
function insertarDisco(req) {

    const disco = {
        titulo: req.body.titulo,
        autor: req.body.autor,
        genero: req.body.genero,
        ano: req.body.ano,
        numDisco: req.body.numDisco,
        precio: req.body.precio,
        imgUrl: req.body.imgUrl
    }

    let nuevoDisco = new Producto(disco);

    nuevoDisco.save(function (err) {
        if (err) throw err;
        console.log(`Inserción correcta del disco ${disco.titulo}`);
        // mongoose.disconnect();
    });
   


}

function saveSesionStart() {
    let userStart = {
        id_usuario: "",
        nombre: "",
        apellidos: "",
        email: "",
        dni: "",
        telefono: "",
        direccion: "",
        cp: "",
        poblacion: "",
        admin: false
    }
    return userStart;
}

function saveSesion(datosUser) {
    let user = {
        id_usuario: datosUser.id_usuario,
        nombre: datosUser.nombre,
        apellidos: datosUser.apellidos,
        email: datosUser.email,
        dni: datosUser.dni,
        telefono: datosUser.telefono,
        direccion: datosUser.direccion,
        cp: datosUser.cp,
        poblacion: datosUser.poblacion,
        admin: datosUser.admin
    }
    return user;
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

    let nuevoUsuario = new Usuario(usuario);

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