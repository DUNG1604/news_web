const express = require("express");
const NewsController = require("../controllers/NewsController");
const UserController = require("../controllers/UserController");
const AuthMiddleware = require("../middleware/AuthMiddleware");

const router = express.Router();
router.use(AuthMiddleware.isAuth,);
router.use(AuthMiddleware.isAdmin);
// router.post("/search",NewsController.Search);
// router.post("/delete/:id",NewsController.Delete);
// router.post("/update/:id",NewsController.postUpdate);
// router.get("/update/:id",NewsController.Edit);
// router.get("/create",NewsController.Create);
// router.post("/create",NewsController.postCreate);
// router.get("/:id",NewsController.DetailAdmin);
router.get("/manager-users",UserController.GetAllUsers);
router.get("/manager-news",NewsController.GetAllNews);
router.get("/",NewsController.GetHomeAdmin);

module.exports = router;