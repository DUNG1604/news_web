const express = require("express");
const NewsController = require("../controllers/NewsController");

const router = express.Router();
router.get("/create",NewsController.Create);
router.post("/create",NewsController.postCreate);
router.get("/getall",NewsController.GetAll);
router.get("/",NewsController.HomeAdmin);

module.exports = router;