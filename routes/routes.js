const router = require("express").Router();
const pages = require("../controllers/pages.controllers")
 

//Rutas 
// Botón a página de inicio
router.get("/",pages.home);
router.get("/home", pages.verHome);
// Botón a tienda
router.get("/tienda",pages.verTienda);
// // Viene de un formulario a vista de admin
// router.post("/admin",pages.admin);
// // Viene de un botón y va a buscar historial
router.get("/buscarHist",pages.buscarHist);
// // Viene de un formulario a confirmar la compra
// router.post("/buyConfirm",pages.buyConfirm);
// // Viene de un botón al carrito
// router.get("/carrito", pages.verCarrito);
// // Viene de un submit de después de dar al carrito
// router.get("/datosEnvio", pages.datosEnvio);
// // Viene del formulario a la factura
// router.post("/factura",pages.factura)
// // Viene del formulario para ver el historial
// router.post("/historial", pages.historial);

// // Viene de Mi Perfil para modificar datos
// router.get("/modDatos", pages.modDatos);

// router.get("/insertarProducto", pages.insertarProducto)



router.get("/insertarCompra", pages.insertarCompra)
router.post("/verBusqueda", pages.verBusqueda )
router.post("/verBusquedaTitulo", pages.verBusquedaTitulo)


// // Viene de un botón al register
router.get("/registerLogin", pages.viewRegister);

router.get("/logout", pages.logout);

router.post("/verFactura", pages.verFactura)
router.post("/carritoConfirmado", pages.carritoConfirmado)
router.post("/verCarrito", pages.verCarrito)

router.post("/registro", pages.registro);
router.post("/login", pages.login);
// // Viene de un botón de perfil
router.get("/perfil", pages.verPerfil);

//Direcciona a la pg de admin

//Para volver desde el nav a la vision de admin
router.post("/volverAdmin", pages.volverAdmin);
//Inserta disco
router.post("/addDisco", pages.addDisco);
router.post("/deleteDisco", pages.deleteDisco);
router.post("/updateDisco", pages.updateDisco);
// // Viene de un botón del producto y te lleva a la info de ese producto
router.post("/verProducto", pages.verProducto);

module.exports = router;