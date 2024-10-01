const express = require("express");
const NewsController = require("../controllers/NewsController");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const AuthorController = require("../controllers/AuthorController");

const router = express.Router();
router.use(AuthMiddleware.isAuth,);
router.use(AuthMiddleware.isAuthor);
router.post("/search",NewsController.SearchAuthor);
router.post("/delete/:id",NewsController.Delete);
router.post("/update/:id",NewsController.postUpdate);
router.get("/update/:id",NewsController.Edit);
router.get("/create",NewsController.Create);
router.post("/create",NewsController.postCreate);
router.get("/:id",NewsController.DetailAdmin);
router.get("/",NewsController.GetByIdUser);

module.exports = router;