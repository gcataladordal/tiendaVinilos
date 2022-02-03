const router = require("express").Router();
const pages = require("../controllers/pages.controllers")
// const user = require("../controllers/user.controllers")
 

//Rutas 
// Botón a página de inicio
router.get("/",pages.home);
// Botón a tienda
// router.get("/tienda",pages.tienda)
// // Viene de un formulario a vista de admin
// router.post("/admin",pages.admin);
// // Viene de un botón y va a buscar historial
// router.get("/buscarHist",pages.buscarHist);
// // Viene de un formulario a confirmar la compra
// router.post("/buyConfirm",pages.buyConfirm);
// // Viene de un botón al carrito
// router.get("/carrito", pages.carrito);
// // Viene de un submit de después de dar al carrito
// router.get("/datosEnvio", pages.datosEnvio);
// // Viene del formulario a la factura
// router.post("/factura",pages.factura)
// // Viene del formulario para ver el historial
// router.post("/historial", pages.historial);

// // Viene de un botón al login
// router.get("/login", pages.login)
// // Viene de un botón al register
router.get("/registerLogin", pages.register);
router.post("/registrar", pages.registro);

// // Viene de un botón de perfil
// router.get("/perfil", pages.perfil);
// // Viene de un botón del producto y te lleva a la info de ese producto
// router.post("/producto", pages.producto)




 

module.exports = router;