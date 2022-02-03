const pages = {
    home: (req, res) => {
        res.render("pages/home");
    },

    register: (req, res) => {
        res.render("registroLogin");
    },
    registro: (req, res) => {
        registrar(req, res);
    }
}



function registrar(req, res) {
    //! ---- Variables de la información del registro -----

    var nombre = req.body.nombre;
    var apellidos = req.body.apellidos;
    var email = req.body.email;
    var pass = req.body.password1;
    var pass2 = req.body.password2;
    var dni = req.body.dni;
    var direccion = req.body.direccion;
    var tlf = req.body.tlf;


    //! Expresiones Regulares validaciones:
    var regExpDni = new RegExp(/^[0-9]{8}\-?[a-zA-Z]{1}/);
    var regExpName = new RegExp(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ]+$/u); // Otro para apellidos por el espacio!!
    var regExpEmail = new RegExp(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/);
    var regExpPass = new RegExp(/^(?=\w*\d)(?=\w*[a-zA-Z])\S{6,10}$/);
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
    var tlfOk = regExpTlf.test(tlf);
    // console.log(`nombre: ${nombreOk} \n apellido: ${apellidosOk} \n email ${emailOk} \n pass:${passOk} \n pass:${pass2Ok} \n mismopass: ${mismoPassOk} \n dni :${dniOk} \n tlf: ${tlfOk}`);

    var ok = nombreOk && apellidosOk && emailOk && passOk && pass2Ok && mismoPassOk && dniOk && tlfOk;
    // console.log(ok);

    // var ok = true;  // Para hacerlo sin validaciones

    // //! ---- SI TODAS VALIDACIONES TRUE --------
    // if (ok) {
    //     var listaUsuarios = [];
    //     var listaMedicos = [];
    //     MongoClient.connect(url, function (err, db) {
    //         if (err) throw err;
    //         var dbo = db.db(mydb);

    //         dbo.collection(coleccionU).find({ "dni": dni }).toArray(function (err, listaUsuarios) {
    //             if (err) throw err;

    //             //! --------- Proceso de Registrar al Paciente ---------

    //             if (listaUsuarios[0] == undefined) { //* Sino existe, se inserta
    //                 dbo.collection(coleccionM).find({}).toArray(function (err, listaMedicos) {
    //                     if (err) throw err;
    //                     var randomDc = [];
    //                     randomDc.push(listaMedicos[caos(0, 3)]); //* Asignación aleatoria de médicos.
    //                     var idM = JSON.stringify(randomDc[0]._id).replace(/['"]+/g, ''); //* Se le quita las comas, sino añadia ""11rD471"".

    //                     var user = {         //* ------> Formato que se añade a la MONGODB-------
    //                         dni: dni.replace("-", ""),
    //                         pass: pass,
    //                         nombre: nombre,
    //                         apellidos: apellidos,
    //                         turno: randomDc[0].turno,
    //                         id_medico: idM,
    //                         admin: false
    //                     }

    //                     //!------- Insertar Usuario ------

    //                     dbo.collection(coleccionU).insertOne(user, function (err, result) {
    //                         if (err) throw err;
    //                         db.close();
    //                         res.sendFile(__dirname + '/registroSuccess.html');
    //                     });
    //                 });
    //             } else { //! ----- Si existe, te lanza a la pg.
    //                 db.close();
    //                 res.sendFile(__dirname + '/usuarioExist.html');
    //             }
    //         });
    //     });
    //     //! ---- Si no todas las validaciones son TRUE --------
    // } else {
    //     res.sendFile(__dirname + '/error.html');
    // }

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