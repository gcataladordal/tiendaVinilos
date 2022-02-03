/* require('./database/mongo.cnx') */
require("./database/mongo")
const express = require("express");
const app = express();
const router = require("./routes/routes")

 

app.set("view engine", "pug");
app.set("views", "./views");
app.use("/Public", express.static('Public'));
 
app.use(express.urlencoded({extended: true}));
app.use(express.json());

 

app.use("/", router);

app.listen(3000)