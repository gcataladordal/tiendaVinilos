const { url } = require('inspector');
const puppeteer = require('puppeteer')
const mongoose = require("mongoose");
const urlBD = "mongodb://localhost:27017/vinilosFull";
//const Producto = require("./models/productoModel");
 const objetoProductoSchema = {
    titulo: String,
    autor: String,
    genero: String,
    ano: String,
    numDisco: String,
    precio: String,
    imgUrl: String,
};
const AutoIncrement = require('mongoose-sequence')(mongoose);
const productoSchema = mongoose.Schema(objetoProductoSchema, {versionKey: false})
productoSchema.plugin(AutoIncrement, { inc_field: 'id_vinilo' });
const Producto = mongoose.model("productos", productoSchema);


const extractData = async (url, browser) => {
    try {
        productData = {}
        const page = await browser.newPage()
        await page.goto(url);
        productData.titulo = await page.$eval("h1", title => title.innerText);
        productData.autor = await page.$eval(".hero-artistName", autor => autor.innerText);
        productData.ano = await page.$eval(".hero-year", ano => ano.innerText);
        productData.precio = await page.$eval(".reducedPrice-original", precio => precio.innerHTML);
        productData.imgUrl = await page.$eval(".hero-preview > img", imgUrl => imgUrl.src);
        productData.genero = 'Jazz';
        productData.numDisco = '2';
        return productData
    }
    catch (error) {
        console.log("Error")
    }
}

const extractUrls = async (url) => {
    try {
        const scrapedData = []
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(url);
        // console.log(`Accediendo a ${url}`)
        const productUrls = await // Evalúa la página cargada, crea un array con TODOS los selectores (Funciona como un querySelectorAll) 
            page.$$eval('.release-content > a ', (etiquetaEnlace) => etiquetaEnlace.map(a => a.href));
        console.log("Todos los enlaces encontrados")
        console.log(productUrls)
        const fiveUrls = productUrls.slice(1, 5)
        console.log("Cinco enlaces")
        console.log(fiveUrls)
        // fiveUrls.forEach(element => {
        //     const productsInfo = await extractData(element, browser); 
        //     scrapedData.push(productsInfo)})
        for (productLink in fiveUrls) {
            const productsInfo = await extractData(fiveUrls[productLink], browser)
            scrapedData.push(productsInfo);
        }
        console.log("Data scrapeada");
        console.log(scrapedData);
        mongoose.connect(urlBD, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
            .then(() => {
                console.log("Base de datos de Mongo conectada");
            })
            .then(() => {
                for (let i = 0; i < scrapedData.length; i++) {
                    let productoScraped = new Producto(scrapedData[i]);
                    productoScraped.save(function (err) {
                        if (err) throw err;
                        console.log("Inserción correcta");
                        //mongoose.disconnect();
                })};
    })
            .catch ((err) => {
    console.error(err);
});
    }
    catch (error) {
    console.log("Error")
}
}

extractUrls('https://recordsale.de/en/genres/jazz/albums')

const scrapping = {
    extractUrls: extractUrls,
    extractData: extractData
}
module.exports = scrapping