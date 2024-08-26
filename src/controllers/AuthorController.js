const News = require("../models/news");

const AuthorController = {
  HomeAuthor: async (req, res) => {
    return res.render("author/homeAuthor");
  },
};

module.exports = AuthorController;
