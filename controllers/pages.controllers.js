const pages = {
    home: (req, res) => {
        res.render("home");
    },
    register: (req, res) => {
        res.render("registro");
    },
    login: (req, res) => {
        res.render("login");
    }

}


module.exports = pages;