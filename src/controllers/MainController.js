const News = require("../models/news");

const MainController = {
  Home: async (req, res) => {
    try {
      const listnews = await News.findAll();
      return res.render("home", { listnews });
    } catch (error) {
      res.status(500).send("server err");
    }
  },
};

module.exports = MainController;
