const express = require("express");
const NewsController = require("../controllers/NewsController");
const AuthMiddleware = require("../middleware/AuthMiddleware");
// const multer = require('multer');
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });


const router = express.Router();
router.use(AuthMiddleware.isAuth,);
router.use(AuthMiddleware.isAdmin);
router.post("/search",NewsController.Search);
router.post("/delete/:id",NewsController.Delete);
router.post("/update/:id",NewsController.postUpdate);
router.get("/update/:id",NewsController.Edit);
router.get("/create",NewsController.Create);
router.post("/create",NewsController.postCreate);
// router.get("/getall",NewsController.GetAll);
router.get("/:id",NewsController.DetailAdmin);
router.get("/",NewsController.GetAll);

module.exports = router;