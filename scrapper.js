const { url } = require('inspector');
const puppeteer = require('puppeteer')
const scrapping = {
    extractUrls: extractUrls,
    extractData: extractData
}
module.exports = scrapping
// AAAA

const extractUrls = async (url) => {
    try {// Inicializamos una instancia del navegador (browser) con puppeteer.launch() y añadimos en el objeto de configuración la opción headless
        const browser = await puppeteer.launch({ headless: false });
        // Abrimos una nueva pestaña en el navegador
        const page = await browser.newPage();
        // Accedemos a la url que le pasamos por parámetros a la función
        await page.goto(url);
        // console.log(`Accediendo a ${url}`)
        const productUrls = await // Evalúa la página cargada, crea un array con TODOS los selectores (Funciona como un querySelectorAll) 
        page.$$eval('.item_picture > a', (etiquetaEnlace) => etiquetaEnlace.map(a => a.href));
        // console.log("Todos los enlaces encontrados")
        // console.log(productUrls)
        const fiveUrls = productUrls.slice(0, 5)
        // console.log("Cinco enlaces")
        // console.log(fiveUrls)
        fiveUrls.forEach(element => { scrapedData.push(element); console.log(element); console.log(scrapedData) })
        await browser.close();
        console.log(scrapedData)
        return scrapedData
    } catch (error) {
        console.log("Error")
    }
}

extractUrls('https://www.discogs.com/es/sell/list?format=Vinyl')

const extractData = async (url, browser) => {
        try {
                productData = {}
                const page = await browser.newPage()
                await page.goto(scrapedData[0]);
                productData.titulo = await page.$eval("h1", title => title.innerText);
        
                return productData
            }
        
        
            catch (error) {
        console.log("Error")
    }
}