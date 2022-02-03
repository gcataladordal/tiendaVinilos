const pages = {
    home: (req, res) => {
        res.render("pages/home");
    },
    registroLogin: (req, res) => {
        res.render("pages/registroLogin");
    }

}


module.exports = pages;