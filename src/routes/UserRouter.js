const express = require("express");
const UserController = require("../controllers/UserController");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const NewsController = require("../controllers/NewsController");

const router = express.Router();
router.use(AuthMiddleware.isAuth);
router.post("/search",NewsController.Search);
router.get("/",NewsController.GetHomeUser);
module.exports = router;
