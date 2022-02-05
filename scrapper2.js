const { url } = require('inspector');
const puppeteer = require('puppeteer')

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
        // console.log("Todos los enlaces encontrados")
        // console.log(productUrls)
        const fiveUrls = productUrls.slice(1, 5)
        // console.log("Cinco enlaces")
        // console.log(fiveUrls)
        // fiveUrls.forEach(element => {
        //     const productsInfo = await extractData(element, browser); 
        //     scrapedData.push(productsInfo)})
        for (productLink in fiveUrls) {
            const productsInfo = await extractData(fiveUrls[productLink], browser)
            scrapedData.push(productsInfo);
        }
        return scrapedData
        // console.log("Data scrapeada");
        // console.log(scrapedData);
        
    }
    catch (error) {
    console.log("Error")
    }       
}

// extractUrls('https://recordsale.de/en/genres/jazz/albums')

const scrapping = {
    extractUrls: extractUrls,
    extractData: extractData
}

module.exports = extractUrls('https://recordsale.de/en/genres/jazz/albums')