const { createInvoice } = require("./createInvoice.js");

const invoice = {
  shipping: {
    nombre: "Antonio",
    direccion: "Calle de la piruleta",
    poblacion: "San Francisco",
    cp: 94111,
    email: "buenas@gmail.com",
  },
  productos: [
    {
      producto: "James Brown",
      titulo: "The Best Of James Brown",
      cantidad: 2,
      precio: 6000
    },
    {
      producto: "ABC",
      titulo: "Jackson 5",
      cantidad: 1,
      precio: 2000
    },
    {
      producto: "Doggystyle",
      titulo: "Snoop Dogg",
      cantidad: 2,
      precio: 6000
    }
  ],
  subtotal: 8000,
  paid: 0,
  invoice_nr: 1234
};

createInvoice(invoice, "factura_vinilosFull.pdf");
