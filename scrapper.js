const { url } = require('inspector');
const puppeteer = require('puppeteer')
const mongoose = require("mongoose");
const Producto = require("./models/productoModel");
const ProductoScrap = require("./models/productoScrapModel");

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
        productData.url = url
        return productData
    }
    catch (error) {
        console.log("Error")
    }
}

const addRecordsWeb = async (num) => {
    try {
        let randomNumber = Math.floor(Math.random() * (600 - 1)) + 1;
        console.log(randomNumber)
        let url = "https://recordsale.de/en/genres/jazz/albums?page=" + randomNumber
        const scrapedData = []
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url);
        const productUrls = await 
            page.$$eval('.release-content > a ', (etiquetaEnlace) => etiquetaEnlace.map(a => a.href));
        const randomLinks = []
        // Funcion para aleatorizar los links que recogemos
        function getRandom() {
            return Math.floor(Math.random() * productUrls.length)
        }
        function checkNotRepeat(current, validNumbers) {
            return validNumbers.includes(current)
        }
        while (randomLinks.length < 6) {
            const randomIndex = getRandom()
            if (!checkNotRepeat(productUrls[randomIndex], randomLinks))
                randomLinks.push(productUrls[randomIndex])
        }
        console.log("Links aleatorios")
        for (productLink in randomLinks) {
            const productsInfo = await extractData(randomLinks[productLink], browser)
            scrapedData.push(productsInfo);
        }
        return scrapedData
    }
    catch (error) {
        console.log("Error")
    }
}

async function addRecordsDB(num) {
     let scrapedData = await addRecordsWeb(num)
    for (let i = 0; i < scrapedData.length; i++) {
        let productoScraped = new ProductoScrap(scrapedData[i]);
        productoScraped.save(function (err) {
            if (err) throw err;
            console.log("Inserción correcta");
            //mongoose.disconnect();
        })
    }
}

const scrapping = {
    addRecordsWeb: addRecordsWeb,
    addRecordsDB: addRecordsDB
}
module.exports = scrapping